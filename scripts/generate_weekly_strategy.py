import os
import json
import sys
from datetime import datetime, timedelta
from openai import OpenAI
from supabase import create_client
from dotenv import load_dotenv

# --- CONFIGURATION ---
# Load environment variables from .env.local in the project root
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
env_path = os.path.join(project_root, '.env.local')

if os.path.exists(env_path):
    load_dotenv(env_path, override=True)
else:
    print(f"❌ Fichier .env.local non trouvé à : {env_path}")
    exit(1)

SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("VITE_SUPABASE_SERVICE_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY or not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("❌ Erreur : Variables d'environnement manquantes.")
    exit(1)

client_ai = OpenAI(api_key=OPENAI_API_KEY)
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def get_weekly_data(user_id):
    """Récupère tout le contexte utilisateur pour les 7 prochains jours."""
    # 1. Profil
    try:
        profile_response = supabase.table("profil_utilisateur").select("*").eq("id", user_id).single().execute()
        profile = profile_response.data
    except Exception as e:
        print(f"Erreur récupération profil: {e}")
        return None, None, None
    
    # 2. Séances de J à J+6
    today = datetime.now().date()
    end_week = today + timedelta(days=6)
    
    try:
        seances = supabase.table("seance").select("*").eq("id_utilisateur", user_id).gte("date", today.isoformat()).lte("date", end_week.isoformat()).execute().data
    except Exception as e:
        print(f"Erreur récupération séances: {e}")
        seances = []
    
    # 3. Compétition (J à J+10 pour anticipation)
    end_horizon = today + timedelta(days=10)
    try:
        competitions = supabase.table("competition").select("*").eq("id_utilisateur", user_id).gte("date", today.isoformat()).lte("date", end_horizon.isoformat()).execute().data
    except Exception as e:
        print(f"Erreur récupération compétitions: {e}")
        competitions = []
    
    return profile, seances, competitions

def determine_profile_tag(profile):
    """Détermine le profil selon le document source."""
    if not profile:
        return "tous"
        
    # Volume hebdo > 10h ou mention 'Haut Niveau'
    vol = str(profile.get("frequence_entrainement", "")).lower()
    if "10h" in vol or "haut niveau" in vol:
        return "haut_niveau"
    if "sédentaire" in vol or "reprise" in vol or "rem" in vol:
        return "REM"
    return "modere"

def retrieve_rag_context(query, profile_tag):
    """Recherche les connaissances dans la table nutrition."""
    embedding = client_ai.embeddings.create(
        input=query,
        model="text-embedding-3-small"
    ).data[0].embedding

    # Utilisation de la fonction RPC match_nutrition
    rpc_params = {
        "query_embedding": embedding,
        "match_threshold": 0.4,
        "match_count": 8,
        "filter_profil": profile_tag,
        "filter_horizon": "week"
    }
    
    try:
        results = supabase.rpc("match_nutrition", rpc_params).execute()
        return "\n".join([f"- {r['content']}" for r in results.data])
    except Exception as e:
        print(f"Erreur RPC match_nutrition: {e}")
        return ""

def check_advice_exists(user_id):
    """Vérifie si un conseil a déjà été généré aujourd'hui."""
    today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)
    
    response = supabase.table("conseil_semaine").select("id").eq("id_utilisateur", user_id).gte("date_creation", today_start.isoformat()).lt("date_creation", today_end.isoformat()).execute()
    
    return len(response.data) > 0

def generate_weekly_strategy(user_id):
    print(f"Génération de la stratégie pour l'utilisateur {user_id}...")
    
    # Check if advice already exists for today
    if check_advice_exists(user_id):
        print("✅ Un conseil pour la semaine a déjà été généré aujourd'hui.")
        return None

    # 1. Collecte des données
    profile, seances, comps = get_weekly_data(user_id)
    if not profile:
        print("❌ Profil utilisateur introuvable.")
        return None
        
    profile_tag = determine_profile_tag(profile)
    print(f"Profil détecté : {profile_tag}")
    
    # 2. Analyse de l'intensité
    intense_count = len([s for s in seances if (s.get('intensité') or 0) >= 2]) # Score 2-3
    
    # 3. Recherche RAG
    print("Recherche de contexte RAG...")
    search_query = "Modèle méditerranéen, Oméga 3, équilibre acido-basique, charge glucidique compétition"
    rag_context = retrieve_rag_context(search_query, profile_tag)

    # 4. Construction du Prompt Final
    prompt = f"""
    Tu es un expert en nutrition sportive. Génère la STRATÉGIE DE LA SEMAINE pour {profile.get('prenom', 'l\'utilisateur')}.
    
    DONNÉES UTILISATEUR :
    - Profil : {profile_tag}
    - Séances (J à J+6) : {json.dumps(seances, default=str)}
    - Compétition proche : {json.dumps(comps, default=str)}
    - Alerte Intensité : {intense_count} séances intenses détectées.
    
    CONTEXTE DU GUIDE NUTRITIONNEL :
    {rag_context}
    
    CONSIGNES DE RÉDACTION (Prompt 3) :
    - Analyse le volume global.
    - Périodisation : 55% glucides par défaut, 70% si compétition à J+3 ou J+6.
    - Alerte Inflammation : Si intense_count > 3, renforce les conseils anti-inflammatoires (IL-6/Hepcidine).
    - Quotas : 400g poisson gras/semaine, 3 c.à.s huile colza/jour, oléagineux (Vit E).
    - Zéro conseil médical. Ton direct et expert.
    
    FORMAT DE SORTIE :
    1. Analyse de la Charge Hebdomadaire
    2. Calendrier Stratégique (J à J+6)
    3. Checklist "Courses & Stocks"
    4. Conseil Prévention (Blessures & Alimentation Durable)
    """

    print("Appel à GPT-4o...")
    response = client_ai.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )
    
    advice_content = response.choices[0].message.content
    
    # 5. Insertion en base
    print("Insertion du conseil en base de données...")
    new_advice = {
        "id_utilisateur": user_id,
        "conseil": advice_content
    }
    
    try:
        supabase.table("conseil_semaine").insert(new_advice).execute()
        print("✅ Stratégie hebdomadaire générée et sauvegardée avec succès.")
        return advice_content
    except Exception as e:
        print(f"❌ Erreur lors de la sauvegarde du conseil : {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 generate_weekly_strategy.py <UUID_UTILISATEUR>")
        exit(1)
    
    user_uuid = sys.argv[1]
    result = generate_weekly_strategy(user_uuid)
    if result:
        print("\n--- APPEL À L'ACTION ---")
        print("Aperçu du conseil :")
        print(result[:200] + "...")
