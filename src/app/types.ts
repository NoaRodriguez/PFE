export type UserGoal = 
  | 'reprise' // Reprendre le sport
  | 'hygiene' // Avoir une bonne hygiène de vie
  | 'competition' // Préparer une compétition
  | 'sante' // Rester en bonne santé
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

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  goals: UserGoal[]; // Changed from goal to goals (array)
  sports: SportType[]; // Changed from mainSport to sports (array)
  customSports: string[]; // Added for custom sports
  trainingHoursPerWeek: number; // hours per week (changed from trainingFrequency)
  nutritionGoals: {
    proteins: number; // grams
    carbs: number; // grams
    fats: number; // grams
  };
}

export interface TrainingSession {
  id: string;
  date: Date;
  title: string; // Added title field
  sport: SportType;
  duration: number; // minutes
  type: SessionType;
  notes?: string;
}

export interface Competition {
  id: string;
  date: Date;
  name: string;
  sport: SportType;
  distance: number; // km
  expectedTime: string; // HH:MM:SS format
}

export interface Ingredient {
  id: string;
  name: string;
  proteins: number; // per 100g
  carbs: number; // per 100g
  fats: number; // per 100g
  category: string;
}

export interface ConsumedFood {
  ingredientId: string;
  quantity: number; // in grams
  timestamp: Date;
}

export interface DailyNutrition {
  date: string; // YYYY-MM-DD
  consumed: ConsumedFood[];
  totalProteins: number;
  totalCarbs: number;
  totalFats: number;
}

export interface NutritionAdvice {
  title: string;
  description: string;
  type: 'weekly' | 'daily' | 'pre-session' | 'during-session' | 'post-session';
  relatedSession?: string; // session id
}