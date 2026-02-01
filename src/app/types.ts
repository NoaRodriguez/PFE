export type UserGoal =
  | 'reprise'
  | 'hygiene'
  | 'competition'
  | 'performance'
  | 'perte-poids';

export type SportType =
  | 'course'
  | 'velo'
  | 'natation'
  | 'trail'
  | 'triathlon'
  | 'autre';

export type SessionType =
  | 'frac'
  | 'endurance'
  | 'footing'
  | 'tempo'
  | 'recuperation'
  | 'interval'
  | 'specific';

export type Gender = 'male' | 'female';

export interface UserProfile {
  id?: string;
  prenom: string;
  date_naissance?: string;
  gender: Gender;
  poids: number;
  taille: number;
  objectifs: UserGoal[];
  sports: SportType[];
  customSports: string[];
  frequence_entrainement: string;
  nutritionGoals: {
    proteines: number;
    glucides: number;
    lipides: number;
  };
  vma?: number;
  ftp?: number;
}

// Nouvelle interface pour le conseil structuré
export interface SessionAdviceData {
  avant: string;
  pendant: string;
  apres: string;
}

export interface TrainingSession {
  id: string | number;
  id_utilisateur?: string;
  date: Date | string;
  titre: string;
  sport: SportType;
  durée: number;
  type: SessionType;
  description?: string;
  intensité: number;
  période_journée: string;
  conseil?: SessionAdviceData; // <--- On utilise l'objet structuré ici
}

export interface Competition {
  id: string | number;
  id_utilisateur?: string;
  date: Date | string;
  nom: string;
  sport: SportType;
  distance: number;
  durée?: number;
  intensité?: number;
  description?: string;
  location?: string;
}

export interface Ingredient {
  id: string;
  name: string;
  proteins: number;
  carbs: number;
  fats: number;
  category: string;
  calories?: number;
  image?: string;
  type?: 'protein' | 'carb' | 'fat' | 'fiber';
}

export interface ConsumedFood {
  ingredientId: string;
  quantity: number;
  timestamp: Date;
}

export interface DailyNutrition {
  date: string;
  consumed: ConsumedFood[];
  totalProteins: number;
  totalCarbs: number;
  totalFats: number;
}

export interface NutritionAdvice {
  title: string;
  description: string;
  type: 'weekly' | 'daily' | 'pre-session' | 'during-session' | 'post-session';
  relatedSession?: string;
}