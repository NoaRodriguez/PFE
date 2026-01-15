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
  id?: string; // UUID from auth.users
  prenom: string; // was name
  date_naissance?: string; // date
  gender: Gender;
  poids: number; // weight
  taille: number; // height
  objectifs: UserGoal[]; // goals
  sports: SportType[];
  customSports: string[];
  frequence_entrainement: string; // text in SQL
  nutritionGoals: {
    proteines: number;
    glucides: number;
    lipides: number;
  };
}

export interface TrainingSession {
  id?: number; // bigint
  id_utilisateur?: string;
  date: string; // timestamp
  titre: string; // title
  sport: SportType;
  durée: number; // duration
  type: SessionType;
  description?: string; // notes
  intensité: 'faible' | 'moyenne' | 'haute'; // intensity
  période_journée: 'matin' | 'midi' | 'soir'; // period
}

export interface Competition {
  id?: number; // bigint
  id_utilisateur?: string;
  date: string; // timestamp
  nom?: string; // name in logic, but not in sql? checking schema... 'sport text' is there. 'titre' is in seance, competition has no name in provided schema, but keep for UI if needed or map to sport? 
  // Wait, the SQL for competition has: id, id_utilisateur, date, sport, durée, distance, intensité.
  // The original has 'name'. I will keep 'name' optional or remove if strict.
  // User said "Aligner les champs durée, distance, intensité".
  // I will check if 'name' is used in UI later, but for now I will add the new fields.
  sport: SportType;
  durée: number;
  distance: number;
  intensité: number;
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