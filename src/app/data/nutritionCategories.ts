import { Ingredient } from '../types';
import { ingredients } from './ingredients';

export interface NutritionCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  themeColor: string;
  gradient: string;
  definition: string; // Le texte du VERSO (Teaser)
  details: {
    intro: string;
    science: string;
    timing: string;
  };
  topIngredients: Ingredient[];
}

const getIngredients = (names: string[]) => {
  return ingredients.filter(i => names.includes(i.name));
};

export const nutritionCategories: NutritionCategory[] = [
  {
    id: 'muscle',
    title: 'Construction',
    subtitle: 'Protéines',
    icon: '🏗️',
    themeColor: '#00F65C',
    gradient: 'from-[#00F65C]/20 to-[#00F65C]/5',
    // VERSO : On explique ce qu'on va trouver dedans
    definition: "Découvre comment les protéines agissent comme un ciment pour réparer tes micro-lésions après l'effort. Ici, tu apprendras quels aliments privilégier pour bâtir un corps plus fort et résistant.",
    details: {
      intro: "Réparer la casse musculaire pour mieux reconstruire.",
      science: "Lors d'un effort intense, tes fibres musculaires subissent des micro-déchirures. Les protéines apportent les acides aminés qui viennent 'cimenter' ces brèches. C'est ce processus biologique (la synthèse protéique) qui permet au muscle de s'adapter et de grossir.",
      timing: "Fenetre anabolique : Ton corps absorbe mieux les protéines dans les 30 à 60 min après la séance."
    },
    topIngredients: getIngredients(['Poulet', 'Oeuf', 'Thon', 'Lentilles', 'Fromage blanc', 'Dinde', 'Tofu', 'Sardines'])
  },
  {
    id: 'energy',
    title: 'Énergie',
    subtitle: 'Glucides',
    icon: '⚡',
    themeColor: '#C1FB00',
    gradient: 'from-[#C1FB00]/20 to-[#C1FB00]/5',
    definition: "Comprends le rôle clé du glycogène pour maintenir ton intensité. On t'explique comment éviter le fameux 'mur' ou la fringale en pleine séance grâce aux bons carburants.",
    details: {
      intro: "Le carburant haute performance du sportif.",
      science: "Le glycogène est la forme de stockage du sucre dans tes muscles et ton foie. C'est ta batterie principale. Une fois vide, l'intensité chute brutalement. Les glucides permettent de garder cette batterie chargée.",
      timing: "Mange des glucides complexes (riz, avoine) 3h avant pour le stock, et des rapides (fruit) juste avant ou pendant l'effort."
    },
    topIngredients: getIngredients(['Riz', 'Pâtes', 'Banane', 'Avoine', 'Avocat', 'Patate douce', 'Quinoa', 'Dattes'])
  },
  {
    id: 'recovery',
    title: 'Récupération',
    subtitle: 'Anti-Inflammatoire',
    icon: '🛡️',
    themeColor: '#F57BFF',
    gradient: 'from-[#F57BFF]/20 to-[#F57BFF]/5',
    definition: "Apprends à utiliser ton assiette pour éteindre le feu musculaire. Découvre les aliments qui réduisent l'inflammation naturelle causée par le sport et divisent tes courbatures par deux.",
    details: {
      intro: "Calmer l'inflammation et réparer les tissus.",
      science: "Le sport crée une réaction inflammatoire normale. Mais si elle dure, elle freine la progression. Les Oméga-3 et les antioxydants sont des modulateurs puissants qui aident ton corps à nettoyer les déchets et à réduire la douleur.",
      timing: "À consommer loin des entraînements (ex: le soir au dîner) pour favoriser la régénération nocturne."
    },
    topIngredients: getIngredients(['Saumon', 'Noix', 'Huile d\'olive', 'Carotte', 'Fruits rouges', 'Amandes', 'Graines de chia', 'Maquereau'])
  },
  {
    id: 'balance',
    title: 'Équilibre',
    subtitle: 'Vitamines',
    icon: '⚖️',
    themeColor: '#FFFFFF',
    gradient: 'from-gray-200/20 to-gray-200/5',
    definition: "Vois comment les minéraux alcalinisants nettoient l'acidité produite par l'effort. Une catégorie essentielle pour éviter la fatigue chronique et les blessures tendineuses.",
    details: {
      intro: "Tamponner l'acidité et détoxifier.",
      science: "L'effort intense acidifie ton organisme (production d'ions H+). Un terrain trop acide favorise les tendinites et la fatigue. Les végétaux, riches en potassium et magnésium, rétablissent l'équilibre pH de ton corps.",
      timing: "À chaque repas ! Vise la moitié de ton assiette en légumes colorés pour contrebalancer les protéines et féculents."
    },
    topIngredients: getIngredients(['Brocoli', 'Tomate', 'Pomme', 'Concombre', 'Citron', 'Epinards', 'Avocat'])
  }
];

export const dailyTip = {
  title: "🔥 Éteins l'incendie !",
  // Le résumé est affiché en haut de la page ouverte
  summary: "Tes muscles chauffent ? Mange des **Oméga-3** (Saumon, Noix) ce midi pour récupérer.",
  // Le contenu long est affiché juste en dessous
  longContent: `
    <p>La sensation de chaleur et de courbature que tu ressens aujourd'hui est liée à l'inflammation musculaire post-effort.</p>
    <p class="mt-4">Si elle est naturelle, elle ne doit pas durer. Les **Oméga-3** (présents dans les poissons gras, les noix, l'huile de colza) agissent comme des pompiers naturels.</p>
    <div class="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
      <p class="font-bold text-[#C1FB00] mb-2">⚡ Action SOMA :</p>
      <ul class="list-disc pl-5 space-y-2 text-sm">
        <li>Ajoute une poignée de noix à ta collation de 16h.</li>
        <li>Assaisonne ta salade avec de l'huile de colza.</li>
        <li>Évite la charcuterie ce soir.</li>
      </ul>
    </div>
  `,
  categoryLink: 'recovery'
};