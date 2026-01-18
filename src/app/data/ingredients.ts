import { Ingredient } from '../types';

export const ingredients: Ingredient[] = [
  // --- PROTÉINES ---
  { 
    id: 'p1', 
    name: 'Poulet', 
    category: 'viande', 
    calories: 165, 
    proteins: 31, 
    carbs: 0, 
    fats: 3.6, 
    type: 'protein', 
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 'p2', 
    name: 'Oeuf', 
    category: 'oeuf', 
    calories: 155, 
    proteins: 13, 
    carbs: 1.1, 
    fats: 11, 
    type: 'protein', 
    image: 'https://images.unsplash.com/photo-1491524062933-cb0289261700?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 'p3', 
    name: 'Thon', 
    category: 'poisson', 
    calories: 130, 
    proteins: 28, 
    carbs: 0, 
    fats: 1, 
    type: 'protein', 
    image: 'https://images.unsplash.com/photo-1536502280287-21a4f0099452?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 'p4', 
    name: 'Lentilles', 
    category: 'legumineuse', 
    calories: 116, 
    proteins: 9, 
    carbs: 20, 
    fats: 0.4, 
    type: 'protein', 
    image: 'https://images.unsplash.com/photo-1585994270220-49635b75f858?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 'p5', 
    name: 'Fromage blanc', 
    category: 'laitier', 
    calories: 50, 
    proteins: 8, 
    carbs: 4, 
    fats: 0, 
    type: 'protein', 
    image: 'https://plus.unsplash.com/premium_photo-1663852297514-2211cfb8ae9b?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 'p6', 
    name: 'Dinde', 
    category: 'viande', 
    calories: 135, 
    proteins: 29, 
    carbs: 0, 
    fats: 1, 
    type: 'protein', 
    image: 'https://images.unsplash.com/photo-1580910051074-3eb6948d3aa7?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 'p7', 
    name: 'Tofu', 
    category: 'vegetal', 
    calories: 76, 
    proteins: 8, 
    carbs: 1.9, 
    fats: 4.8, 
    type: 'protein', 
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 'p8', 
    name: 'Sardines', 
    category: 'poisson', 
    calories: 208, 
    proteins: 25, 
    carbs: 0, 
    fats: 11, 
    type: 'protein', 
    image: 'https://images.unsplash.com/photo-1599321955726-90471f64560b?auto=format&fit=crop&w=100&q=80' 
  },

  // --- GLUCIDES (ÉNERGIE) ---
  { 
    id: 'c1', 
    name: 'Riz', 
    category: 'feculent', 
    calories: 130, 
    proteins: 2.7, 
    carbs: 28, 
    fats: 0.3, 
    type: 'carb', 
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 'c2', 
    name: 'Pâtes', 
    category: 'feculent', 
    calories: 131, 
    proteins: 5, 
    carbs: 25, 
    fats: 1.1, 
    type: 'carb', 
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 'c3', 
    name: 'Banane', 
    category: 'fruit', 
    calories: 89, 
    proteins: 1.1, 
    carbs: 23, 
    fats: 0.3, 
    type: 'carb', 
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 'c4', 
    name: 'Avoine', 
    category: 'cereale', 
    calories: 389, 
    proteins: 16.9, 
    carbs: 66, 
    fats: 6.9, 
    type: 'carb', 
    image: 'https://images.unsplash.com/photo-1610452336688-6623c34cf50e?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 'c5', 
    name: 'Patate douce', 
    category: 'legume', 
    calories: 86, 
    proteins: 1.6, 
    carbs: 20, 
    fats: 0.1, 
    type: 'carb', 
    image: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 'c6', 
    name: 'Quinoa', 
    category: 'cereale', 
    calories: 120, 
    proteins: 4.1, 
    carbs: 21, 
    fats: 1.9, 
    type: 'carb', 
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 'c7', 
    name: 'Dattes', 
    category: 'fruit', 
    calories: 282, 
    proteins: 2.5, 
    carbs: 75, 
    fats: 0.4, 
    type: 'carb', 
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=100&q=80' 
  },

  // --- LIPIDES & ANTI-INFLAMMATOIRE ---
  { 
    id: 'f1', 
    name: 'Saumon', 
    category: 'poisson', 
    calories: 208, 
    proteins: 20, 
    carbs: 0, 
    fats: 13, 
    type: 'fat', 
    image: 'https://images.unsplash.com/photo-1616422204616-0e1d51a66a9d?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 'f2', 
    name: 'Avocat', 
    category: 'fruit', 
    calories: 160, 
    proteins: 2, 
    carbs: 9, 
    fats: 15, 
    type: 'fat', 
    image: 'https://images.unsplash.com/photo-1523049673856-3860322c9126?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 'f3', 
    name: 'Noix', 
    category: 'oleagineux', 
    calories: 654, 
    proteins: 15, 
    carbs: 14, 
    fats: 65, 
    type: 'fat', 
    image: 'https://images.unsplash.com/photo-1594046243098-0fceea9d451e?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 'f4', 
    name: "Huile d'olive", 
    category: 'huile', 
    calories: 884, 
    proteins: 0, 
    carbs: 0, 
    fats: 100, 
    type: 'fat', 
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcdcc3a?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 'f5', 
    name: 'Amandes', 
    category: 'oleagineux', 
    calories: 579, 
    proteins: 21, 
    carbs: 22, 
    fats: 50, 
    type: 'fat', 
    image: 'https://images.unsplash.com/photo-1613769049987-b31b641325b1?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 'f6', 
    name: 'Graines de chia', 
    category: 'graine', 
    calories: 486, 
    proteins: 17, 
    carbs: 42, 
    fats: 31, 
    type: 'fat', 
    image: 'https://images.unsplash.com/photo-1611575825224-3474360e2d31?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 'f7', 
    name: 'Maquereau', 
    category: 'poisson', 
    calories: 205, 
    proteins: 19, 
    carbs: 0, 
    fats: 14, 
    type: 'fat', 
    image: 'https://images.unsplash.com/photo-1599321955726-90471f64560b?auto=format&fit=crop&w=100&q=80' 
  },

  // --- LÉGUMES & ALCALINS ---
  { 
    id: 'v1', 
    name: 'Brocoli', 
    category: 'legume', 
    calories: 34, 
    proteins: 2.8, 
    carbs: 7, 
    fats: 0.4, 
    type: 'fiber', 
    image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 'v2', 
    name: 'Tomate', 
    category: 'legume', 
    calories: 18, 
    proteins: 0.9, 
    carbs: 3.9, 
    fats: 0.2, 
    type: 'fiber', 
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 'v3', 
    name: 'Carotte', 
    category: 'legume', 
    calories: 41, 
    proteins: 0.9, 
    carbs: 10, 
    fats: 0.2, 
    type: 'fiber', 
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 'v4', 
    name: 'Citron', 
    category: 'fruit', 
    calories: 29, 
    proteins: 1.1, 
    carbs: 9, 
    fats: 0.3, 
    type: 'fiber', 
    image: 'https://images.unsplash.com/photo-1568569350062-ebfa3cb195df?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 'v5', 
    name: 'Fruits rouges', 
    category: 'fruit', 
    calories: 50, 
    proteins: 1, 
    carbs: 12, 
    fats: 0.5, 
    type: 'fiber', 
    image: 'https://images.unsplash.com/photo-1576669801775-ffdeb553e857?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 'v6', 
    name: 'Concombre', 
    category: 'legume', 
    calories: 15, 
    proteins: 0.7, 
    carbs: 3.6, 
    fats: 0.1, 
    type: 'fiber', 
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 'v7', 
    name: 'Pomme', 
    category: 'fruit', 
    calories: 52, 
    proteins: 0.3, 
    carbs: 14, 
    fats: 0.2, 
    type: 'carb', 
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 'v8', 
    name: 'Epinards', 
    category: 'legume', 
    calories: 23, 
    proteins: 2.9, 
    carbs: 3.6, 
    fats: 0.4, 
    type: 'fiber', 
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=100&q=80' 
  }
];