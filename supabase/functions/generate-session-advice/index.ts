
// 1. IMPORTS
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { OpenAI } from "https://esm.sh/openai@4"

// 2. INTERFACES
interface NutritionBlock {
  content: string;
  metadata: { horizon: string; profil: string; theme: string; sources: number[]; };
}

interface Seance {
  id: number;
  date: string;
  titre: string;
  type: string;
  sport: string;
  durée: number;
  intensité: number;
  description: string;
  période_journée: string;
  id_utilisateur: string;
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

Deno.serve(async (req) => {
    // Handle CORS preflight explicitly
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { session_id, force_update } = await req.json()

        if (!session_id) {
            return new Response(JSON.stringify({ error: "session_id is required" }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const openAiKey = Deno.env.get('OPENAI_API_KEY')!;

        const supabase = createClient(supabaseUrl, supabaseKey)
        const openai = new OpenAI({ apiKey: openAiKey })

        // 1. FETCH SESSION DETAILS
        const { data: sessionData, error: sessionError } = await supabase
            .from('seance')
            .select('*')
            .eq('id', session_id)
            .single()

        if (sessionError || !sessionData) {
            console.error("Session fetch error:", sessionError)
            return new Response(JSON.stringify({ error: "Session not found" }), {
                status: 404,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        const currentSession = sessionData as Seance
        const userId = currentSession.id_utilisateur

        // 2. DELETE EXISTING ADVICE FOR THIS SESSION (Modification logic)
        // Even if creating new, we ensure no duplicates by deleting first
        const { error: deleteError } = await supabase
            .from('conseil_seance')
            .delete()
            .eq('id_seance', session_id)
        
        if (deleteError) {
             console.log("Error deleting old advice (non-fatal):", deleteError)
        }

        // 3. FETCH USER PROFILE
        const { data: profile } = await supabase
            .from('profil_utilisateur')
            .select('*')
            .eq('id', userId)
            .single()
        
        // 4. DETERMINE PROFILE TAG FOR RAG
        let profileTag = "modere"
        const vol = (profile?.frequence_entrainement || "").toLowerCase()
        if (vol.includes("10h") || vol.includes("haut niveau")) {
            profileTag = "haut_niveau"
        } else if (vol.includes("sédentaire") || vol.includes("reprise") || vol.includes("rem")) {
            profileTag = "REM"
        }

        // 5. RAG SEARCH
        // Using relevant keywords for session nutrition
        const searchQuery = `Nutrition avant pendant après sport ${currentSession.type} ${currentSession.sport} index glycémique hydratation`
        
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: searchQuery,
        })
        const embedding = embeddingResponse.data[0].embedding

        const { data: ragContextData } = await supabase.rpc('match_nutrition', {
            query_embedding: embedding,
            match_threshold: 0.4,
            match_count: 5,
            filter_profil: profileTag,
            filter_horizon: "session" // Assuming 'session' is a valid horizon in your context DB, otherwise use 'week' or generic
        })

        const ragContext = ragContextData as NutritionBlock[]
        const contextText = ragContext ? ragContext.map((r) => r.content).join("\n") : ""

        // 6. GENERATE ADVICE WITH GPT-4o
        // Using the user's prompt structure but forcing JSON output
        const prompt = `
        Tu es un nutritionniste du sport expert, agissant comme un coach personnel. Ton ton est cool, motivant et éducatif : explique le "pourquoi" pour aider l'utilisateur à comprendre l'impact de sa nutrition sur sa performance.
        
        DONNÉES D'ENTRÉE :
        Profil Utilisateur : ${JSON.stringify(profile)}
        Détails de la Séance : ${JSON.stringify(currentSession)}
        Météo : Température modérée (base : 50g de glucides/h si effort > 1h).
        CONTEXTE DU GUIDE NUTRITIONNEL (RAG) : ${contextText}
        
        DIRECTIVES DE RÉDACTION :
        ANALYSE DE L'EFFORT : Identifie le Score (0 à 3) de la séance. Précise si c'est un effort aérobie (endurance) ou contre résistance (force/gainage).
        AVANT L'EFFORT :
        Adapte le conseil nutritionnel selon le timing restant (3-4h, 2h ou 1h).
        N'oublie pas la "ration d'attente" pour maintenir la glycémie sans pic d'insuline.
        PENDANT L'EFFORT :
        Si l'effort dépasse 1h, impose un apport de 50g de glucides par heure (météo modérée).
        Cadre l'hydratation : environ 150ml toutes les 15 minutes.
        APRÈS L'EFFORT :
        Mise tout sur la fenêtre métabolique (optimale entre 30 min et 2h) pour stopper le catabolisme.
        Recommande le combo 25g Protéines + 25g Glucides.
        
        IMPORTANT : Tu dois impérativement répondre au format JSON valide.
        Structure JSON attendue :
        {
          "conseil_avant": "...",
          "conseil_pendant": "...",
          "conseil_apres": "..."
        }
        
        Remarque : 
        - Ne mets pas de markdown (json) autour, juste le JSON brut si possible ou je le nettoierai.
        `;

        const chatResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a helpful assistant that outputs JSON." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        })

        const adviceContent = chatResponse.choices[0].message.content
        let adviceJson;
        try {
            adviceJson = JSON.parse(adviceContent || "{}")
        } catch (e) {
            console.error("Failed to parse JSON advice", e)
            adviceJson = {
                conseil_avant: "Erreur de génération.",
                conseil_pendant: "Erreur de génération.",
                conseil_apres: "Erreur de génération."
            }
        }

        // 7. INSERT INTO DB
        const { error: insertError } = await supabase
            .from('conseil_seance')
            .insert({
                id_seance: session_id,
                conseil_avant: adviceJson.conseil_avant,
                conseil_pendant: adviceJson.conseil_pendant,
                conseil_apres: adviceJson.conseil_apres
            })

        if (insertError) {
            console.error("Insert error:", insertError)
             return new Response(JSON.stringify({ error: insertError.message }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        return new Response(JSON.stringify({ success: true, advice: adviceJson }), {
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
