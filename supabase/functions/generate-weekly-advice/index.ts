// 1. UTILISATION DES URLS COMPLÈTES (Pour éviter l'erreur de bundling)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { OpenAI } from "https://esm.sh/openai@4"

// Types pour votre schéma spécifique
interface NutritionBlock {
  content: string;
  metadata: { horizon: string; profil: string; theme: string; sources: number[]; };
}

interface Seance {
  date: string;
  titre: string;
  type: string;
  intensité: number; 
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

// 2. UTILISATION DE Deno.serve (Méthode moderne recommandée)
Deno.serve(async (req) => {
    // Handle CORS preflight explicitly
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { user_id: userId, force_update } = await req.json()
        
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const openAiKey = Deno.env.get('OPENAI_API_KEY')!;

        const supabase = createClient(supabaseUrl, supabaseKey)
        const openai = new OpenAI({ apiKey: openAiKey })

        // 1. CHECK IF ADVICE ALREADY EXISTS FOR TODAY (STRICT DAY COMPARISON)
        const now = new Date()
        const todayStr = now.toISOString().split('T')[0]
        
        // Calculate tomorrow for strict upper bound
        const tomorrow = new Date(now)
        tomorrow.setDate(tomorrow.getDate() + 1)
        const tomorrowStr = tomorrow.toISOString().split('T')[0]

        const { data: existingAdvice } = await supabase
            .from('conseil_semaine')
            .select('id')
            .eq('id_utilisateur', userId)
            .gte('date_creation', `${todayStr}T00:00:00`)
            .lt('date_creation', `${tomorrowStr}T00:00:00`)
        
        if (existingAdvice && existingAdvice.length > 0) {
            if (force_update) {
                console.log(`Force update requested. Deleting ${existingAdvice.length} existing advice(s) for user ${userId} on ${todayStr}.`)
                const idsToDelete = existingAdvice.map(a => a.id)
                await supabase
                    .from('conseil_semaine')
                    .delete()
                    .in('id', idsToDelete)
            } else {
                console.log(`generate-weekly-advice: Existing advice found for user ${userId} on ${todayStr}. Count=${existingAdvice.length}. force_update=${force_update}`)
                return new Response(JSON.stringify({ message: 'Advice already exists for today' }), { headers: corsHeaders })
            }
        }

        // 1B. COLLECTE DU CONTEXTE UTILISATEUR
        const { data: profile } = await supabase.from('profil_utilisateur').select('*').eq('id', userId).single()
        
        const endWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

        // Récupération avec vos noms de colonnes réels
        const { data: seances } = await supabase.from('seance').select('*').eq('id_utilisateur', userId).gte('date', todayStr).lte('date', endWeek)
        const { data: comps } = await supabase.from('competition').select('*').eq('id_utilisateur', userId).gte('date', todayStr).lte('date', endWeek)

        // 2. DÉTERMINATION DU PROFIL
        let profileTag = "modere"
        const vol = (profile?.frequence_entrainement || "").toLowerCase()
        
        if (vol.includes("10h") || vol.includes("haut niveau")) {
            profileTag = "haut_niveau"
        } else if (vol.includes("sédentaire") || vol.includes("reprise") || vol.includes("rem")) {
            profileTag = "REM"
        }

        // 3. RECHERCHE RAG (Appel RPC match_nutrition)
        const searchQuery = "Modèle méditerranéen, Oméga 3, équilibre acido-basique, charge glucidique"
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: searchQuery,
        })
        const embedding = embeddingResponse.data[0].embedding

        const { data: ragContextData } = await supabase.rpc('match_nutrition', {
            query_embedding: embedding,
            match_threshold: 0.4,
            match_count: 8,
            filter_profil: profileTag,
            filter_horizon: "week"
        })

        const ragContext = ragContextData as NutritionBlock[]
        const contextText = ragContext ? ragContext.map((r) => r.content).join("\n") : ""

        // 4. ANALYSE D'INTENSITÉ (Détection risque IL-6)
        const userSeances = (seances || []) as Seance[]
        // Utilisation de 'intensité' avec accent comme dans votre table
        const intenseCount = userSeances.filter((s) => s.intensité >= 2).length

        // 5. GÉNÉRATION DU CONSEIL VIA GPT-4o
        const prompt = `
        Tu es un expert en nutrition sportive, agissant comme un préparateur physique personnel. Ton ton est cool, motivant et éducatif : évite le jargon médical froid, utilise des analogies concrètes, mais reste précis sur les chiffres.
        Génère la STRATÉGIE DE LA SEMAINE pour ${profile?.prenom || 'l\'utilisateur'}.
        
        DONNÉES UTILISATEUR :
        - Profil : ${JSON.stringify(profile)}
        - profil_tag : ${profileTag}
        - Séances (J à J+6) : ${JSON.stringify(seances)}
        - Compétitions : ${JSON.stringify(comps)}
        - Alerte Intensité : ${intenseCount} séances intenses détectées.
        
        CONTEXTE DU GUIDE NUTRITIONNEL :
        ${contextText}
        
        DIRECTIVES DE REDACTION : 
        - Focus de ta semaine : Commence par 4 à 5 phrases maximum qui donnent le "LA" de la semaine. Identifie l'événement majeur (une grosse séance, une compétition ou la récupération) et explique à l'utilisateur quel doit être son "Mindset" nutritionnel.
        - SI AUCUNE SÉANCE N'EST PRÉVUE : Ne sois pas générique. Encourage une semaine de "Régénération" basée sur l'assiette méditerranéenne, le maintien des bons lipides et la micro-nutrition pour réparer les tissus.
        - LOGIQUE DE PÉRIODISATION : 
        Semaine calme : Garde le curseur à 55% de glucides complexes.
        Prépa intense ou Compétition (J+3 ou J+6) : Annonce le passage à 70% pour saturer le glycogène
        - ALERTE INFLAMMATION : Si intense_count > 3, explique avec pédagogie que trop d'intensité sans "resucre" produit de l'IL-6 qui bloque l'absorption du fer via l'hepcidine
        
        FORMAT DE SORTIE :
        Titre court avec Texte court de 2-3 phrases max : Identifie le point culminant de la semaine et l'objectif nutritionnel principal.[ne mentionne pas ce titre dans ta réponse]
        Analyse de la Charge Hebdomadaire [ne mentionne pas ce titre dans ta réponse]
        Calendrier Stratégique (J à J+6) [ne mentionne pas ce titre dans ta réponse]
        Conseil Prévention [ne mentionne pas ce titre dans ta réponse]
        `
                
        const chatResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        })

        const advice = chatResponse.choices[0].message.content

        // Log brief info about the OpenAI response
        try {
            console.log("OpenAI response received. Length:", (advice || "").length)
            console.log("Advice preview:", (advice || "").slice(0, 300).replace(/\n/g, ' '))
        } catch (e) {
            console.log("Failed to log OpenAI response preview", e)
        }

        // 6. SAUVEGARDE (Correction : nom de colonne 'conseil' selon votre SQL)
        await supabase.from('conseil_semaine').insert({
            id_utilisateur: userId,
            conseil: advice
        })

        return new Response(JSON.stringify({ advice }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Erreur inconnue"
        console.error(errorMessage)
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})