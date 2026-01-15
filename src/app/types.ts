export type UserGoal =
  | 'reprise' // Reprendre le sport
  | 'hygiene' // Avoir une bonne hygiène de vie
  | 'competition' // Préparer une compétition
  | 'performance' // Améliorer mes perfs
  | 'perte-poids'; // Perte de poids

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
  | 'specific'; // Ajouté pour compatibilité

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
  vma?: number; // Ajout pour compatibilité
  ftp?: number; // Ajout pour compatibilité
}

export interface TrainingSession {
  id: string | number; // String ou Number pour compatibilité Supabase
  id_utilisateur?: string;
  date: Date | string; // Date ou String pour gérer les deux formats
  titre: string;
  sport: SportType;
  durée: number;
  type: SessionType;
  description?: string;
  intensité: number; // Mis en number pour ton Slider (0-3)
  période_journée: string; // String pour être plus souple ('matin', 'soir', etc.)
}

export interface Competition {
  id: string | number;
  id_utilisateur?: string;
  date: Date | string;
  nom: string; // Nom obligatoire pour l'affichage
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