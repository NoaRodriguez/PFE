export type UserGoal = 
  | 'reprise' // Reprendre le sport
  | 'hygiene' // Avoir une bonne hygiène de vie
  | 'competition' // Préparer une compétition
  | 'performance' // Améliorer mes perfs (Remplacé 'sante')
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
  | 'interval';

export type Gender = 'male' | 'female'; // Nouveau type

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender; // Nouveau champ
  weight: number;
  height: number;
  goals: UserGoal[]; 
  sports: SportType[]; 
  customSports: string[]; 
  trainingHoursPerWeek: number; 
  nutritionGoals: {
    proteins: number; 
    carbs: number; 
    fats: number; 
  };
}

export interface TrainingSession {
  id: string;
  date: Date;
  title: string;
  sport: SportType;
  duration: number; 
  type: SessionType;
  notes?: string;
}

export interface Competition {
  id: string;
  date: Date;
  name: string;
  sport: SportType;
  distance: number; 
  expectedTime: string; 
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