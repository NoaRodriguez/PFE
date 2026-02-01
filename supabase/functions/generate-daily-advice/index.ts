// 1. UTILISATION DES URLS COMPLÈTES
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

// 2. UTILISATION DE Deno.serve
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
            .from('conseil_jour') // NOTE: Table distincte 'conseil_jour'
            .select('id')
            .eq('id_utilisateur', userId)
            .gte('date_creation', `${todayStr}T00:00:00`)
            .lt('date_creation', `${tomorrowStr}T00:00:00`)
        
        if (existingAdvice && existingAdvice.length > 0) {
            if (force_update) {
                console.log(`Force update requested. Deleting ${existingAdvice.length} existing daily advice(s) for user ${userId} on ${todayStr}.`)
                const idsToDelete = existingAdvice.map(a => a.id)
                await supabase
                    .from('conseil_jour')
                    .delete()
                    .in('id', idsToDelete)
            } else {
                console.log(`Daily advice already exists for user ${userId} today.`)
                return new Response(JSON.stringify({ message: 'Daily advice already exists for today' }), { headers: corsHeaders })
            }
        }

        // 1B. COLLECTE DU CONTEXTE UTILISATEUR
        const { data: profile } = await supabase.from('profil_utilisateur').select('*').eq('id', userId).single()
        
        // Dates pour fenêtre J-1 à J+1
        const yesterday = new Date(now)
        yesterday.setDate(now.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]

        // Récupération des séances sur la fenêtre (Hier, Auj, Demain)
        const { data: seances } = await supabase.from('seance')
            .select('*')
            .eq('id_utilisateur', userId)
            .gte('date', yesterdayStr)
            .lte('date', tomorrowStr)

        const seance_JJ = seances?.filter(s => s.date.startsWith(todayStr)) || []
        const seances_fenetre = seances || []

        // 2. DÉTERMINATION DU PROFIL
        let profileTag = "modere"
        const vol = (profile?.frequence_entrainement || "").toLowerCase()
        if (vol.includes("10h") || vol.includes("haut niveau")) {
            profileTag = "haut_niveau"
        } else if (vol.includes("sédentaire") || vol.includes("reprise") || vol.includes("rem")) {
            profileTag = "REM"
        }

        // 3. RECHERCHE RAG
        // On garde une recherche un peu générique ou ciblée "Quotidien"
        const searchQuery = "Récupération quotidienne, chronobiologie alimentaire, petit-déjeuner performance, sommeil nutrition"
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: searchQuery,
        })
        const embedding = embeddingResponse.data[0].embedding

        const { data: ragContextData } = await supabase.rpc('match_nutrition', {
            query_embedding: embedding,
            match_threshold: 0.4,
            match_count: 5, // Moins de contexte nécessaire que pour la semaine
            filter_profil: profileTag,
            filter_horizon: "null" // On peut supposer que vous avez tagué des contenus 'day' ou on garde 'week' si 'day' n'existe pas
        })

        const ragContext = ragContextData as NutritionBlock[]
        const contextText = ragContext ? ragContext.map((r) => r.content).join("\n") : ""

        // 4. GÉNÉRATION DU CONSEIL VIA GPT-4o
        const prompt = `
Tu es un nutritionniste du sport de haut niveau, agissant comme un coach personnel. Ton ton est cool, motivant et éducatif. Tu expliques le "pourquoi" des choses sans être ennuyeux, en utilisant les données scientifiques du guide pour booster la confiance de l'utilisateur.
Génère le CONSEIL DU JOUR (Stratégie 24h) pour ${profile?.prenom || 'l\'utilisateur'}

DONNÉES D'ENTRÉE :
- Profil Utilisateur : ${JSON.stringify(profile)} (Poids : ${profile?.poids}kg).
- Objectif du jour (J) : ${JSON.stringify(seance_JJ)}
- Contexte (Hier J-1 / Demain J+1) : ${JSON.stringify(seances_fenetre)}.

CONTEXTE DU GUIDE NUTRITIONNEL : ${contextText}

DIRECTIVES DE RÉDACTION :
- LE FOCUS DU JOUR : Commence par 1 à 2 phrases maximum pour donner le ton de la journée. Identifie si c'est un jour de "Grosse Performance", de "Récupération Active" ou de "Charge". Explique l'enjeu principal (ex: protéger les muscles, saturer le glycogène ou limiter l'inflammation systémique).

- LOGIQUE DE RÉPARTITION : 
* Matin : Focus protéines et bons lipides pour la vigilance (dopamine).
* Midi : Équilibre végétaux/protéines et impérativement 3 c.à.s d'huile de colza pour les Oméga-3.
* Soir : Glucides complexes pour favoriser la sérotonine (sommeil) et la recharge hépatique.

- SI AUCUNE SÉANCE N'EST PRÉVUE : Propose une journée de "Régénération Méditerranéenne". Focus sur la micro-nutrition (Zinc, Magnésium) pour réparer les tissus et l'hydratation de base (1,5 à 2L).

- LES INTERDITS : Jamais d'eau glacée (digestion). Pas de fibres ou de lactose dès ce soir si une compétition (Score 3) est prévue demain.

FORMAT DE SORTIE ATTENDU :

🎯 Ton mindset du jour 
Texte court de 1 à 2 phrases sur l'objectif n°1 de la journée

🍽️ Ta structure alimentaire
- Petit-déjeuner : [Composition] — Focus : Vigilance et satiété.
- Déjeuner : [Composition] — Focus : Anti-inflammation (Colza).
- Dîner : [Composition] — Focus : Sommeil et recharge glycogénique.

💡 Le petit plus de l'expert
Conseil micro-nutrition spécifique : Ex : 2 noix du Brésil pour le sélénium, ou importance du Magnésium ce soir si la séance d'hier était nerveuse.
`

        const chatResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        })

        const advice = chatResponse.choices[0].message.content

        // 6. SAUVEGARDE (Table 'conseil_jour')
        await supabase.from('conseil_jour').insert({
            id_utilisateur: userId,
            conseil: advice,
            date: todayStr // Optionnel si vous voulez stocker la date explicite
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
