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
  intensité: number; // Correction : correspond à votre SQL 'intensité'
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
        Tu es un expert en nutrition sportive. Génère la STRATÉGIE DE LA SEMAINE pour ${profile?.prenom || 'l\'utilisateur'}.
        
        DONNÉES UTILISATEUR :
        - Profil : ${profileTag}
        - Séances (J à J+6) : ${JSON.stringify(seances)}
        - Compétitions : ${JSON.stringify(comps)}
        - Alerte Intensité : ${intenseCount} séances intenses détectées.
        
        CONTEXTE DU GUIDE NUTRITIONNEL :
        ${contextText}
        
        CONSIGNES PRIORITAIRES (Issues du guide) :
        - Périodisation : 55% glucides par défaut, monter à 70% si compétition à J+3 ou J+6.
        - Alerte Inflammation : Si intense_count > 3, alerte sur la production d'interleukines 6 (IL-6) et l'hepcidine qui bloque le fer.
        - Quotas Hebdo : 400g poisson gras/semaine, 3 c.à.s huile colza/jour (Oméga 3), poignée oléagineux.
        - Digestion : Si compétition à J-2, recommander régime pauvre en fibres ou sans résidus.
        - Style expert, direct, encourageant.

        FORMAT DE SORTIE :
        1. Analyse de la Charge Hebdomadaire
        2. Calendrier Stratégique (J à J+6)
        3. Checklist "Courses & Stocks"
        4. Conseil Prévention
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