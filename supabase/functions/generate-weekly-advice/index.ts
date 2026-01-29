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
}

// 2. UTILISATION DE Deno.serve (Méthode moderne recommandée)
Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

    try {
        const { userId } = await req.json()
        
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const openAiKey = Deno.env.get('OPENAI_API_KEY')!;

        const supabase = createClient(supabaseUrl, supabaseKey)
        const openai = new OpenAI({ apiKey: openAiKey })

        // 1. COLLECTE DU CONTEXTE UTILISATEUR
        const { data: profile } = await supabase.from('profil_utilisateur').select('*').eq('id', userId).single()
        const today = new Date().toISOString().split('T')[0]
        const endWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

        // Récupération avec vos noms de colonnes réels
        const { data: seances } = await supabase.from('seance').select('*').eq('id_utilisateur', userId).gte('date', today).lte('date', endWeek)
        const { data: comps } = await supabase.from('competition').select('*').eq('id_utilisateur', userId).gte('date', today).lte('date', endWeek)

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
        [Texte court de 4-5 phrases max : Identifie le point culminant de la semaine et l'objectif nutritionnel principal.]
        1. Analyse de la Charge Hebdomadaire
        2. Calendrier Stratégique (J à J+6)
        3. Conseil Prévention
        `

        const chatResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        })

        const advice = chatResponse.choices[0].message.content

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