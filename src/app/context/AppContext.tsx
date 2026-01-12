import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  UserProfile, 
  TrainingSession, 
  Competition, 
  DailyNutrition,
  ConsumedFood,
  Ingredient
} from '../types';
import { ingredients } from '../data/ingredients';

interface AppContextType {
  isLoggedIn: boolean;
  userProfile: UserProfile | null;
  sessions: TrainingSession[];
  competitions: Competition[];
  dailyNutrition: DailyNutrition | null;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  login: () => void;
  logout: () => void;
  setUserProfile: (profile: UserProfile) => void;
  addSession: (session: TrainingSession) => void;
  updateSession: (id: string, session: TrainingSession) => void;
  deleteSession: (id: string) => void;
  addCompetition: (competition: Competition) => void;
  updateCompetition: (id: string, competition: Competition) => void;
  deleteCompetition: (id: string) => void;
  addConsumedFood: (food: ConsumedFood) => void;
  removeConsumedFood: (ingredientId: string) => void;
  getTodayNutrition: () => DailyNutrition;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [dailyNutrition, setDailyNutrition] = useState<DailyNutrition | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true; // Par défaut mode sombre
  });

  // Appliquer le mode sombre au body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const login = () => setIsLoggedIn(true);
  const logout = () => {
    setIsLoggedIn(false);
    setUserProfileState(null);
  };

  const setUserProfile = (profile: UserProfile) => {
    setUserProfileState(profile);
    // Initialize daily nutrition when profile is set
    const today = new Date().toISOString().split('T')[0];
    setDailyNutrition({
      date: today,
      consumed: [],
      totalProteins: 0,
      totalCarbs: 0,
      totalFats: 0,
    });
  };

  const addSession = (session: TrainingSession) => {
    setSessions(prev => [...prev, session]);
  };

  const updateSession = (id: string, session: TrainingSession) => {
    setSessions(prev => prev.map(s => s.id === id ? session : s));
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const addCompetition = (competition: Competition) => {
    setCompetitions(prev => [...prev, competition]);
  };

  const updateCompetition = (id: string, competition: Competition) => {
    setCompetitions(prev => prev.map(c => c.id === id ? competition : c));
  };

  const deleteCompetition = (id: string) => {
    setCompetitions(prev => prev.filter(c => c.id !== id));
  };

  const getTodayNutrition = (): DailyNutrition => {
    const today = new Date().toISOString().split('T')[0];
    if (!dailyNutrition || dailyNutrition.date !== today) {
      const newNutrition = {
        date: today,
        consumed: [],
        totalProteins: 0,
        totalCarbs: 0,
        totalFats: 0,
      };
      setDailyNutrition(newNutrition);
      return newNutrition;
    }
    return dailyNutrition;
  };

  const addConsumedFood = (food: ConsumedFood) => {
    setDailyNutrition(prev => {
      if (!prev) return prev;
      
      const newConsumed = [...prev.consumed, food];
      
      // Calculer les totaux en récupérant les ingrédients
      let totalProteins = 0;
      let totalCarbs = 0;
      let totalFats = 0;
      
      newConsumed.forEach((consumed) => {
        const ingredient = ingredients.find((i) => i.id === consumed.ingredientId);
        if (ingredient) {
          totalProteins += (ingredient.proteins * consumed.quantity) / 100;
          totalCarbs += (ingredient.carbs * consumed.quantity) / 100;
          totalFats += (ingredient.fats * consumed.quantity) / 100;
        }
      });
      
      return {
        ...prev,
        consumed: newConsumed,
        totalProteins,
        totalCarbs,
        totalFats,
      };
    });
  };

  const removeConsumedFood = (ingredientId: string) => {
    setDailyNutrition(prev => {
      if (!prev) return prev;
      
      const index = prev.consumed.findIndex(item => item.ingredientId === ingredientId);
      if (index === -1) return prev;
      
      const newConsumed = [...prev.consumed];
      newConsumed.splice(index, 1);
      
      // Recalculer les totaux en récupérant les ingrédients
      let totalProteins = 0;
      let totalCarbs = 0;
      let totalFats = 0;
      
      newConsumed.forEach((consumed) => {
        const ingredient = ingredients.find((i) => i.id === consumed.ingredientId);
        if (ingredient) {
          totalProteins += (ingredient.proteins * consumed.quantity) / 100;
          totalCarbs += (ingredient.carbs * consumed.quantity) / 100;
          totalFats += (ingredient.fats * consumed.quantity) / 100;
        }
      });
      
      return {
        ...prev,
        consumed: newConsumed,
        totalProteins,
        totalCarbs,
        totalFats,
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        userProfile,
        sessions,
        competitions,
        dailyNutrition,
        isDarkMode,
        toggleDarkMode,
        login,
        logout,
        setUserProfile,
        addSession,
        updateSession,
        deleteSession,
        addCompetition,
        updateCompetition,
        deleteCompetition,
        addConsumedFood,
        removeConsumedFood,
        getTodayNutrition,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}