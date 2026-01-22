import os
import json
from openai import OpenAI
from supabase import create_client
from dotenv import load_dotenv

# --- CONFIGURATION ---
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
env_path = os.path.join(project_root, '.env.local')

if os.path.exists(env_path):
    load_dotenv(env_path, override=True)
    SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
    SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("VITE_SUPABASE_SERVICE_KEY")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
else:
    print(f"❌ Fichier .env.local non trouvé à : {env_path}")
    exit(1)

if not OPENAI_API_KEY or not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("❌ Erreur : Variables d'environnement manquantes.")
    exit(1)

client_ai = OpenAI(api_key=OPENAI_API_KEY)
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# --- LES BLOCS DE CONNAISSANCES (L'intégralité du document) ---
knowledge_chunks = [
    {
        "content": "Définitions et types d'activités : FC (Fréquence Cardiaque), REM (Remise en mouvement), IG (Indice Glycémique), IL (Interleukines), IMC (Indice de Masse Corporelle). Activité Faible (<70% FC max) : marche lente, pétanque, voile, golf, volley, tennis de table plaisir. Activité Modérée (>70% FC max) : marche rapide, danse, vélo/natation plaisir, aquagym, ski, footing. Activité Élevée/Intense (>70% FC max) : marche en côte, rando, course (fractionné/compétition), natation, saut à la corde, sports de combat/collectifs.",
        "sources": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        "metadata": {"horizon": "jour", "profil": "tous", "theme": "general"}
    },
    {
        "content": "Physiologie de l'effort intense/prolongé : Le muscle oxyde ses réserves de glycogène. Sans apport de glucides, la production d'interleukines 6 (IL-6) génère une inflammation (blessures, déprime) persistant au repos. Les IL-6 augmentent l'hepcidine, ce qui diminue l'absorption du fer, altère l'oxygénation intestinale (imperméabilité) et diminue le coenzyme Q10 (énergie/antioxydant).",
        "sources": [11, 12, 13, 14, 15, 16, 17, 18, 19],
        "metadata": {"horizon": "seance", "profil": "modere_intense", "theme": "physiologie"}
    },
    {
        "content": "Profil REM (Remise en mouvement) - Activité : Concerne les sédentaires souhaitant reprendre le sport quel que soit le poids. Conseil : marche rapide sans essoufflement (pouvoir parler sans chanter) 25-30 min, 3 fois par semaine, plutôt que 1h30 une seule fois. Ne jamais dépasser 70% de la FC max (cross-over point).",
        "sources": [20, 21, 22, 23, 24],
        "metadata": {"horizon": "week", "profil": "REM", "theme": "activite"}
    },
    {
        "content": "Profil REM (Remise en mouvement) - Nutrition : Apport énergétique 2000-2500 kcal/j. Glucides : 30-50% (proche de 30% si l'IMC est élevé). Protéines : 1,4g par poids de corps. Lipides : 1,2g par poids de corps. Assiette à IG bas, pas de glucides simples. Restriction modérée des glucides à distance de l'exercice. Si l'intensité augmente après quelques mois, l'apport glucidique peut augmenter. Le sport intense n'est pas recommandé pour ce profil, mais si pratiqué, le resucre est obligatoire.",
        "sources": [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 89, 90],
        "metadata": {"horizon": "jour", "profil": "REM", "theme": "nutrition"}
    },
    {
        "content": "Profil Sportif faible : activité physique régulière modérée 1h/jour. Apport glucides: 4 à 5g par poids de corps. Apport protéines: 0,8 à 0,9g par poids de corps. Apport lipides: 1,2g par poids de corps. Axes nutritionnels: Equilibre oméga3/antioxydant, Modèle méditerranéen-crétois.",
        "sources": [39, 40, 41, 42, 43, 44, 45, 46],
        "metadata": {"horizon": "jour", "profil": "faible", "theme": "nutrition"}
    },
    {
        "content": "Profil Sportif modéré : activité intense et plus d'une heure par jour (-10h/semaine). Apport glucides: 6g par poids de corps. Apport protéines: 1g à 1,2g par poids de corps. Apport lipides: 1,2g par poids de corps. Si sportif d'endurance (vélo, run, natation): majorer les hydrates de carbone (céréales, légumineuses, légumes). Modèle méditerranéen-crétois enrichi.",
        "sources": [47, 48, 49, 50, 51, 52, 53, 54, 55],
        "metadata": {"horizon": "jour", "profil": "modere", "theme": "nutrition"}
    },
    {
        "content": "Profil Sportif haut niveau : activité intense/endurance 4h/jour (+10h/semaine). Apport glucides: 10 à 12g par poids de corps. Apport protéines: 1,7g par poids de corps. Apport lipides: 1,2g par poids de corps. Équilibre ratio animal/végétal 50/50. Marathon/trail/cyclisme: introduire des acides aminés en fin d'effort.",
        "sources": [56, 57, 58, 59, 60, 61, 62, 63, 64, 65],
        "metadata": {"horizon": "jour", "profil": "haut_niveau", "theme": "nutrition"}
    },
    {
        "content": "Consommation des lipides/glucides en fonction de la FCmax : Au repos: brûle majoritairement des lipides. Jusqu'à 70% FCmax (220-âge): plus de gras consommé que de glucides, permet de perdre du gras sans épuiser le glycogène. Au-delà de 70%: essoufflement, consommation prédominante de glucides, nécessité de renflouer les stocks de glycogène.",
        "sources": [66, 67, 68, 69, 70, 71],
        "metadata": {"horizon": "seance", "profil": "tous", "theme": "physiologie"}
    },
    {
        "content": "Alimentation générale du sportif : Assiette méditerranéenne, chronobiologie et alimentation durable. Objectifs: 400-600g fruits/légumes par jour, épices, poignée de graines, céréales complètes, légumineuses. 400g poissons gras par semaine, 3 c.à.s d'huile de colza par jour.",
        "sources": [72, 73, 74, 75, 76, 77, 78, 79],
        "metadata": {"horizon": "week", "profil": "tous", "theme": "general"}
    },
    {
        "content": "Chronobiologie nutritionnelle : Petit déjeuner copieux protéiné, faible en sucre. Déjeuner copieux. Dîner léger riche en glucides, tendance végétarienne.",
        "sources": [80, 81, 82, 83],
        "metadata": {"horizon": "jour", "profil": "tous", "theme": "chronobiologie"}
    },
    {
        "content": "Apports énergétiques : Règle générale 50-55% glucides, 10-17% protéines, 40-45% lipides. En préparation intense ou J-3 avant compétition, les glucides complexes peuvent monter à 70% sans réduire protéines/lipides. Recours aux glucides simples justifié uniquement durant l'effort prolongé/intense et juste après.",
        "sources": [84, 85, 86, 87, 88, 91, 92, 93, 94, 95],
        "metadata": {"horizon": "week", "profil": "tous", "theme": "glucides"}
    },
    {
        "content": "Lipides et Oméga 3 : Consommer chaque jour >= 500mg/j ou 1 c.à.s d'huile de colza (anti-inflammatoire). Sources: lin, noix, chia, cameline, poissons gras (saumon, sardine, maquereau). Ratio Oméga 6/3 le plus faible possible. Éviter excès d'Oméga 6 (tournesol, viande rouge, ultra-transformés).",
        "sources": [96, 97, 98, 99, 100, 101, 102, 103, 104, 105],
        "metadata": {"horizon": "week", "profil": "tous", "theme": "lipides"}
    },
    {
        "content": "Protéines : Ratio 50/50 entre sources animales (œufs, volaille, poisson, laitiers) et végétales (céréales, légumineuses, noix). L'excès de protéines animales favorise l'acidose et les crampes. Prendre des protéines le matin et le midi pour la synthèse musculaire même au repos.",
        "sources": [106, 107, 108, 109, 110, 111, 112],
        "metadata": {"horizon": "jour", "profil": "tous", "theme": "proteines"}
    },
    {
        "content": "Acides aminés : BCAA (leucine, isoleucine, valine) pour la fatigue cérébrale. Glutamine (2-3g/j) pour l'intestin et immunité. Leucine (200-300g) midi ou après l'effort pour synthèse musculaire (plus efficace avec Vit D).",
        "sources": [113, 114, 115],
        "metadata": {"horizon": "seance", "profil": "tous", "theme": "proteines"}
    },
    {
        "content": "Alimentation autour de la séance : Céréales semi-complètes (quinoa, amarante si sans gluten), IG bas, pâtes, riz, tubercules. 300g pain semi-complet par jour. Avant séance: <1h (compote, 1/2 banane), 1-2h (glucides + peu protéines), 2-3h (grosse collation glucidique sandwich blanc), 3-4h (repas complet riche glucides). Après l'effort: repas 1h-3h après.",
        "sources": [116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131],
        "metadata": {"horizon": "seance", "profil": "tous", "theme": "timing"}
    },
    {
        "content": "Protocoles Compétition : Classique (J-6 à J-3): glucides 70% (complexes). J-3 à JJ: glucides 50-55% (simples). Urgence: J-3 à JJ: glucides simples 70%. Régime sans résidus strict ou pauvre en fibres 24/48h avant selon tolérance. Stopper lipides 8h avant (sauf colza). Favoriser fruits bien mûrs (sucres simples).",
        "sources": [132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146],
        "metadata": {"horizon": "week", "profil": "modere_intense", "theme": "competition"}
    },
    {
        "content": "JJ Compétition : Petit déj 3h avant (riz/pâtes blanches, miel, fruits mûrs). Mastication 20 min. Ration d'attente: petites quantités IG élevé (pâtes fruits, pain d'épice) toutes les 20-30 min jusqu'à 30 min avant pour éviter pic insuline.",
        "sources": [147, 148, 149, 150, 151, 152, 153],
        "metadata": {"horizon": "seance", "profil": "tous", "theme": "competition"}
    },
    {
        "content": "Pendant l'épreuve : <1h (boisson hypotonique). >1h (boisson glucidique 150ml toutes les 15min). Épreuve longue >2h: aliments solides toutes les heures. Apport glucides/heure: 25g (chaud), 50g (tempéré), 80g (froid). Vitamine B1 importante pour aérobie.",
        "sources": [154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167],
        "metadata": {"horizon": "seance", "profil": "tous", "theme": "hydratation"}
    },
    {
        "content": "Récupération Post-Effort : Synthèse musculaire augmentée tôt après. Fenêtre 30min à 2h max: ingérer 500ml eau + 25g protéines + 5g BCAA + 25g glucides. Ne pas oublier Oméga 3 journaliers.",
        "sources": [168, 169, 170, 171, 172, 173, 174],
        "metadata": {"horizon": "seance", "profil": "tous", "theme": "recuperation"}
    },
    {
        "content": "Hydratation générale : 1,5 à 2L/jour hors sport. Manque d'eau = inflammation, blessures, baisse performance. Méthode de la pesée avant/après pour mesurer les pertes. Risque si perte >2% poids corporel.",
        "sources": [175, 176, 177, 178, 179, 180, 181, 182, 183],
        "metadata": {"horizon": "jour", "profil": "tous", "theme": "hydratation"}
    },
    {
        "content": "Hydratation Technique : Efforts <1h (eau suffit). >1h (boisson glucidique ex: jus raisin 20%). >2h (boisson effort glucides + sels minéraux). Volume: <3h (jusqu'à 1,5L/h), >3h (1,5L/h systématique). Après effort: compenser pertes toutes les 15-20 min pendant 1h. Éviter eau glacée.",
        "sources": [184, 185, 186, 187, 188, 196, 197, 198],
        "metadata": {"horizon": "seance", "profil": "tous", "theme": "hydratation"}
    },
    {
        "content": "Composition boisson effort : Glucides 15-87,5g/l. Sodium 460-1150mg/l. Osmolarité 200-330 mos/kg. Hypotonique pour hydratation rapide (chaleur, pilates, yoga).",
        "sources": [189, 190, 191, 192, 193, 194, 195],
        "metadata": {"horizon": "seance", "profil": "tous", "theme": "hydratation"}
    },
    {
        "content": "Micronutriments : Souvent déficitaires (Fer, Sélénium ex 2 noix Brésil/j, Magnésium, Vit D, C, E, Zinc). Le Zinc est vital pour réparer les fibres cassées après fractionné.",
        "sources": [199, 200, 201, 202, 203, 204, 205, 206],
        "metadata": {"horizon": "week", "profil": "tous", "theme": "micronutriments"}
    },
    {
        "content": "Aliments Alcalinisants (PRAL négatif) du plus au moins: Raisin, Épinard, Banane, Carotte, Abricot, Chou Bruxelles, Kiwi, Chou-fleur, PDT, Radis, Cerise, Mangue, Tomate, Poire, Orange, Citron, Laitue, Pêche, Pomme, Oignon, Champignon, Brocoli, Concombre, Tofu.",
        "sources": [207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234],
        "metadata": {"horizon": "jour", "profil": "tous", "theme": "alcalin"}
    },
    {
        "content": "Aliments Acidifiants (PRAL positif) du moins au plus: Lait, Pois, Crème, Yaourt, Lentilles, Pain blanc, Maïs, Amandes, Riz, Farine froment, Pâtes, Sole, Porc, Pain complet, Bœuf, Œuf, Cacahuètes, Canard, Pistache, Poulet, Saumon, Dinde, Foie, Sardines, Gouda, Edam, Emmental, Cheddar, Parmesan.",
        "sources": [235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266],
        "metadata": {"horizon": "jour", "profil": "tous", "theme": "acide"}
    },
    {
        "content": "Synthèse PRAL : Fruits/Légumes (Très alcalins) > Céréales/Légumineuses (Neutres à acides) > Protéines animales (Acidifiantes) > Produits laitiers affinés (Très acidifiants).",
        "sources": [267, 268, 269, 270, 271],
        "metadata": {"horizon": "week", "profil": "tous", "theme": "general"}
    }
]

def generate_embedding(text):
    """Crée le vecteur pour la recherche sémantique."""
    response = client_ai.embeddings.create(
        input=text,
        model="text-embedding-3-small"
    )
    return response.data[0].embedding

def automate_ingestion():
    print(f"--- Début de l'ingestion de {len(knowledge_chunks)} blocs manuels ---")
    
    for i, block in enumerate(knowledge_chunks):
        try:
            # 1. Génération de l'embedding
            embedding = generate_embedding(block['content'])
            
            # 2. Préparation de la ligne
            row = {
                "content": block['content'],
                "embedding": embedding,
                "metadata": {
                    "horizon": block['metadata']['horizon'],
                    "profil": block['metadata']['profil'],
                    "theme": block['metadata']['theme'],
                    "sources": block['sources']
                }
            }
            
            # 3. Insertion dans la table 'nutrition'
            supabase.table("nutrition").insert(row).execute()
            print(f"✅ Bloc {i+1}/{len(knowledge_chunks)} inséré (Profil: {block['metadata']['profil']})")
            
        except Exception as e:
            print(f"❌ Erreur sur le bloc {i+1} : {e}")

if __name__ == "__main__":
    automate_ingestion()