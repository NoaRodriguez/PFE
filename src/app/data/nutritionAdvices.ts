export const dailyAdvices = [
  {
    title: "Semaine intensité - Focus protéines",
    description: "Cette semaine, montez en intensité dans vos entraînements ! Augmentez votre apport en protéines (poulet, poisson, œufs, légumineuses) pour soutenir vos muscles et optimiser la récupération.",
    icon: "💪"
  },
  {
    title: "Hydratation matinale",
    description: "Commencez votre journée avec un grand verre d'eau pour réhydrater votre corps après la nuit.",
    icon: "💧"
  },
  {
    title: "Protéines au petit-déjeuner",
    description: "Intégrez des protéines dès le matin (œufs, fromage blanc, noix) pour une meilleure satiété.",
    icon: "🥚"
  },
  {
    title: "Collation pré-entraînement",
    description: "30-60 minutes avant votre séance, prenez une banane ou quelques dattes pour de l'énergie rapide.",
    icon: "🍌"
  },
  {
    title: "Récupération post-effort",
    description: "Dans les 30 minutes après l'effort, consommez des glucides et protéines (ratio 3:1) pour optimiser la récupération.",
    icon: "🥤"
  },
  {
    title: "Diversifiez vos légumes",
    description: "Variez les couleurs dans votre assiette : chaque couleur apporte des nutriments différents.",
    icon: "🥗"
  },
  {
    title: "Glucides complexes",
    description: "Privilégiez les glucides complets (pâtes complètes, riz complet, quinoa) pour une énergie durable.",
    icon: "🍚"
  },
  {
    title: "Omega-3 essentiels",
    description: "Intégrez des sources d'oméga-3 (poissons gras, noix, graines de lin) pour réduire l'inflammation.",
    icon: "🐟"
  }
];

export const getAdviceOfTheDay = (): typeof dailyAdvices[0] => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  return dailyAdvices[dayOfYear % dailyAdvices.length];
};