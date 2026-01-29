import React from 'react';
import { Ingredient } from '../types';
import { ingredients } from './ingredients';
import { Dumbbell, Zap, Shield, Scale, Droplets, Lightbulb } from 'lucide-react';

export interface NutritionCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  themeColor: string;
  gradient: string;
  definition: string;
  details: {
    benefits: string;
    timing: string;
    science: string;
  };
  topIngredients: Ingredient[];
}

const getIngredients = (names: string[]) => {
  return ingredients.filter(i => names.includes(i.name));
};

// --- DATA: CONSEIL SEMAINE & JOUR ---

export const weeklyTip = {
  title: "L'Hydratation Stratégique",
  subtitle: "Focus Semaine 42",
  content: "Cette semaine, ne bois pas juste quand tu as soif. La soif est déjà un signe de déshydratation (-10% de perf). Vise 500ml d'eau 2h avant ta séance.",
  icon: Droplets,
  themeColor: "#00F65C"
};

export const dailyTip = {
  title: "Boost tes mitochondries",
  categoryLink: 'recovery',
  summary: "Grosse séance hier ? Tes réserves sont basses. Ce midi, ajoute une portion de **quinoa** ou de **riz complet** pour refaire ton stock.",
  // MISE À JOUR : Classes compatibles Light/Dark mode
  longContent: `
    <p>Après une séance intense, tes stocks de glycogène sont épuisés.</p>
    <p class="mt-4">Pour récupérer sans stocker de gras, il faut des glucides à index glycémique modéré.</p>
    <div class="mt-6 p-4 bg-gray-50 dark:bg-[#C1FB00]/5 rounded-xl border border-gray-200 dark:border-[#C1FB00]/20">
      <p class="font-bold text-gray-900 dark:text-[#C1FB00] mb-2">⚡ Action :</p>
      <ul class="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-slate-300">
        <li>150g de Quinoa cuit</li>
        <li>Une patate douce au four</li>
        <li>Évite le pain blanc ce midi</li>
      </ul>
    </div>
  `,
  icon: Lightbulb
};

// --- DATA: LES PILIERS (CATÉGORIES) ---

export const nutritionCategories: NutritionCategory[] = [
  {
    id: 'muscle',
    title: 'Construction',
    subtitle: 'Protéines',
    icon: Dumbbell,
    themeColor: '#00F65C',
    gradient: 'from-[#00F65C]/20 to-[#00F65C]/5',
    definition: "Les briques indispensables pour réparer et densifier tes fibres musculaires.",
    details: {
      benefits: "Optimise la récupération musculaire, augmente la masse maigre et la force.",
      science: "L'exercice crée des micro-lésions. Les acides aminés des protéines viennent réparer ces lésions pour rendre le muscle plus fort.",
      timing: "Indispensable dans les 30 à 60 minutes après l'effort (fenêtre anabolique) et à chaque repas principal."
    },
    topIngredients: getIngredients(['Poulet', 'Oeuf', 'Thon', 'Lentilles', 'Fromage blanc', 'Dinde', 'Tofu'])
  },
  {
    id: 'energy',
    title: 'Énergie',
    subtitle: 'Glucides',
    icon: Zap,
    themeColor: '#C1FB00',
    gradient: 'from-[#C1FB00]/20 to-[#C1FB00]/5',
    definition: "Le carburant haute-octane pour tenir l'intensité et la durée.",
    details: {
      benefits: "Maintient l'intensité de l'effort, évite le 'mur' (hypoglycémie) et préserve la concentration.",
      science: "Le corps stocke le sucre sous forme de glycogène. C'est ta batterie. Une fois vide, tu n'avances plus.",
      timing: "Glucides complexes (Lents) 3h avant l'effort. Glucides simples (Rapides) pendant et juste après l'effort."
    },
    topIngredients: getIngredients(['Riz', 'Pâtes', 'Banane', 'Avoine', 'Avocat', 'Patate douce', 'Dattes'])
  },
  {
    id: 'recovery',
    title: 'Protection',
    subtitle: 'Lipides & Anti-Inflam.',
    icon: Shield,
    themeColor: '#F57BFF',
    gradient: 'from-[#F57BFF]/20 to-[#F57BFF]/5',
    definition: "Les pompiers naturels pour éteindre l'inflammation et protéger tes articulations.",
    details: {
      benefits: "Réduit les courbatures, protège le système cardio-vasculaire et les tendons.",
      science: "Les Oméga-3 modulent la réponse inflammatoire naturelle du corps post-effort pour qu'elle ne devienne pas chronique.",
      timing: "À consommer loin de l'entraînement (ex: le soir) pour favoriser la régénération nocturne."
    },
    topIngredients: getIngredients(['Saumon', 'Noix', 'Huile d\'olive', 'Amandes', 'Maquereau', 'Graines de chia'])
  },
  {
    id: 'balance',
    title: 'Vitalité',
    subtitle: 'Vitamines & Minéraux',
    icon: Scale,
    themeColor: '#38BDF8',
    gradient: 'from-[#38BDF8]/20 to-[#38BDF8]/5',
    definition: "Le nettoyage interne pour éliminer l'acidité et booster l'immunité.",
    details: {
      benefits: "Meilleure contraction musculaire, moins de fatigue nerveuse, équilibre Acido-Basique.",
      science: "Le sport acidifie l'organisme. Les minéraux (Potassium, Magnésium) des végétaux tamponnent cette acidité.",
      timing: "À volonté ! Essaie d'avoir la moitié de ton assiette en légumes à chaque repas."
    },
    topIngredients: getIngredients(['Brocoli', 'Tomate', 'Pomme', 'Concombre', 'Citron', 'Epinards'])
  }
];