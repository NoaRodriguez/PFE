import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
  UserProfile,
  TrainingSession,
  Competition,
  DailyNutrition,
  ConsumedFood,
} from '../types';
import { ingredients } from '../data/ingredients';
import { supabase } from '../../lib/supabase';

interface AppContextType {
  isLoggedIn: boolean;
  userProfile: UserProfile | null;
  sessions: TrainingSession[];
  competitions: Competition[];
  dailyNutrition: DailyNutrition | null;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  // Auth methods
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, data: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;

  // Data methods
  setUserProfile: (profile: UserProfile) => Promise<void>;
  addSession: (session: TrainingSession) => Promise<void>;
  updateSession: (session: TrainingSession) => Promise<void>;
  deleteSession: (id: string | number) => Promise<void>;
  addCompetition: (competition: Competition) => Promise<void>;
  updateCompetition: (competition: Competition) => Promise<void>;
  deleteCompetition: (id: string | number) => Promise<void>;
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
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev: boolean) => !prev);

  // --- SUPABASE AUTH & DATA ---

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsLoggedIn(true);
        loadUserData(session.user.id);
      } else {
        setIsLoggedIn(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        loadUserData(session.user.id);
      } else {
        setIsLoggedIn(false);
        setUserProfileState(null);
        setSessions([]);
        setCompetitions([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    // 1. Load Profile
    const { data: profileData, error: profileError } = await supabase
      .from('profil_utilisateur')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    // 2. Load Macronutrients (Goals)
    const { data: macroData } = await supabase
      .from('macronutriment')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileData) {
      // Map SQL to App Type
      const mappedProfile: UserProfile = {
        id: profileData.id,
        prenom: profileData.prenom,
        date_naissance: profileData.date_naissance,
        gender: profileData.genre as any,
        poids: profileData.poids,
        taille: profileData.taille,
        objectifs: parseJsonSafe(profileData.objectifs),
        sports: parseJsonSafe(profileData.sports),
        customSports: [],
        frequence_entrainement: profileData.frequence_entrainement,
        nutritionGoals: {
          proteines: macroData?.proteine || 0,
          glucides: macroData?.glucide || 0,
          lipides: macroData?.lipide || 0
        }
      };
      setUserProfileState(mappedProfile);
    } else if (profileError) {
      console.error('Error fetching profile:', profileError);
    }

    // Load Sessions
    const { data: sessionData, error: sessionError } = await supabase
      .from('seance')
      .select('*')
      .eq('id_utilisateur', userId)
      .order('date', { ascending: false });

    if (sessionData) {
      const mappedSessions: TrainingSession[] = sessionData.map((s: any) => ({
        id: s.id,
        date: s.date, // ISO string
        titre: s.titre,
        sport: s.sport,
        durée: s.durée,
        type: s.type, // check valid enum?
        description: s.description,
        intensité: s.intensité,
        période_journée: s.période_journée
      }));
      setSessions(mappedSessions);
    }

    // Load Competitions
    const { data: compData, error: compError } = await supabase
      .from('competition')
      .select('*')
      .eq('id_utilisateur', userId);

    if (compData) {
      const mappedCompetitions: Competition[] = compData.map((c: any) => ({
        id: c.id,
        date: c.date,
        sport: c.sport,
        durée: c.durée,
        distance: c.distance,
        intensité: c.intensité,
        nom: c.titre || 'Competition'
      }));
      setCompetitions(mappedCompetitions);
    }
  };

  const parseJsonSafe = (input: string | any[] | null) => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    try {
      return JSON.parse(input);
    } catch (e) {
      return input.split(','); // Fallback
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, data: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: data.username // meta data
        }
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const setUserProfile = async (profile: UserProfile) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Upsert Profile
    const profileUpdates = {
      id: user.id,
      prenom: profile.prenom,
      poids: isNaN(Number(profile.poids)) ? null : Number(profile.poids),
      taille: isNaN(Number(profile.taille)) ? null : Number(profile.taille),
      objectifs: profile.objectifs,
      sports: profile.sports,
      frequence_entrainement: profile.frequence_entrainement,
      genre: profile.gender,
      date_naissance: profile.date_naissance,
    };

    const { error: profileError } = await supabase
      .from('profil_utilisateur')
      .upsert(profileUpdates);

    // 2. Upsert Nutrition Goals (Macronutriment)
    // Rule: Proteins = Weight * 0.8, Carbs = Weight * 4, Fats = Weight * 1.2
    const weight = Number(profile.poids) || 0;

    const macroUpdates = {
      id: user.id,
      date: new Date().toISOString(),
      proteine: Math.round(weight * 0.8),
      glucide: Math.round(weight * 4),
      lipide: Math.round(weight * 1.2),
    };

    const { error: macroError } = await supabase
      .from('macronutriment')
      .upsert(macroUpdates);

    if (profileError || macroError) {
      console.error('Error updating profile/macros:', { profileError, macroError }, 'Payloads:', { profileUpdates, macroUpdates });
      throw profileError || macroError;
    }

    // Update local state immediately with calculated macros
    setUserProfileState({
      ...profile,
      nutritionGoals: {
        proteines: macroUpdates.proteine,
        glucides: macroUpdates.glucide,
        lipides: macroUpdates.lipide
      }
    });
  };

  const addSession = async (session: TrainingSession) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const row = {
      id_utilisateur: user.id,
      date: session.date, // ensure ISO string
      sport: session.sport,
      titre: session.titre,
      type: session.type,
      durée: session.durée,
      description: session.description,
      intensité: session.intensité,
      période_journée: session.période_journée
    };

    const { data, error } = await supabase
      .from('seance')
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error('Error adding session:', error);
      return;
    }

    if (data) {
      // Map back
      const newSession: TrainingSession = {
        ...session,
        id: data.id
      };
      setSessions(prev => [newSession, ...prev]);
    }
  };

  const updateSession = async (session: TrainingSession) => {
    // On récupère l'ID directement depuis l'objet session
    const id = session.id;
    
    const { error } = await supabase
      .from('seance')
      .update({
        date: session.date,
        sport: session.sport,
        titre: session.titre,
        type: session.type,
        durée: session.durée,
        description: session.description,
        intensité: session.intensité,
        période_journée: session.période_journée
      })
      .eq('id', id);

    if (!error) {
      // Mise à jour de l'état local
      setSessions(prev => prev.map(s => s.id === id ? session : s));
    } else {
      console.error("Erreur lors de la mise à jour de la séance:", error);
      throw error; // Important pour que le 'catch' de la page fonctionne
    }
  };

  const deleteSession = async (id: string | number) => {
    const { error } = await supabase.from('seance').delete().eq('id', id);
    if (!error) {
      // CORRECTION : On convertit tout en String pour être sûr que "15" élimine bien 15
      setSessions(prev => prev.filter(s => String(s.id) !== String(id)));
    } else {
      console.error("Erreur lors de la suppression de la séance:", error);
    }
  };

  const addCompetition = async (competition: Competition) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const row = {
      id_utilisateur: user.id,
      date: competition.date,
      sport: competition.sport,
      durée: Math.round(competition.durée || 0),
      distance: Math.round(competition.distance || 0),
      intensité: Math.round(competition.intensité || 0)
    };

    const { data, error } = await supabase.from('competition').insert(row).select().single();

    if (error) {
      console.error('Error adding competition:', error, row);
      return;
    }

    if (data) {
      const newComp: Competition = {
        ...competition,
        id: data.id
      };
      setCompetitions(prev => [...prev, newComp]);
    }
  };

  const updateCompetition = async (competition: Competition) => {
    // On récupère l'ID directement depuis l'objet competition
    const id = competition.id;

    const updates = {
      date: competition.date,
      sport: competition.sport,
      durée: Math.round(competition.durée || 0),
      distance: Math.round(competition.distance || 0),
      intensité: Math.round(competition.intensité || 0)
    };

    const { error } = await supabase
      .from('competition')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating competition:', error, updates);
      throw error; // Important pour propager l'erreur
    } else {
      // Mise à jour de l'état local
      setCompetitions(prev => prev.map(c => c.id === id ? competition : c));
    }
  };

  const deleteCompetition = async (id: string | number) => {
    const { error } = await supabase.from('competition').delete().eq('id', id);
    if (!error) {
      // CORRECTION : Idem ici, conversion en String pour la comparaison
      setCompetitions(prev => prev.filter(c => String(c.id) !== String(id)));
    } else {
      console.error("Erreur lors de la suppression de la compétition:", error);
    }
  };

  // --- NUTRITION (Keep Local or TODO Supabase?) ---
  // Request didn't specify Nutrition table. 
  // "Lecture : Charger sessions et competitions... Ecriture : addSession, updateSession... setUserProfile" 
  // No mention of nutrition logic persistence except maybe in Profile (goals). 
  // But DailyNutrition logic was local. I will keep it local or simple for now until requested.
  // The user prompt: "Utiliser supabase... ... Lecture : Charger sessions et competitions... Ecriture ... addSession... setDescription... setUserProfile".
  // Nutrition usage seems transient or not migrated yet.

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
      // Recalc logic... (simplified copy from original)
      let totalProteins = 0; let totalCarbs = 0; let totalFats = 0;
      newConsumed.forEach((consumed) => {
        const ingredient = ingredients.find((i) => i.id === consumed.ingredientId);
        if (ingredient) {
          totalProteins += (ingredient.proteins * consumed.quantity) / 100;
          totalCarbs += (ingredient.carbs * consumed.quantity) / 100;
          totalFats += (ingredient.fats * consumed.quantity) / 100;
        }
      });
      return { ...prev, consumed: newConsumed, totalProteins, totalCarbs, totalFats };
    });
  };

  const removeConsumedFood = (ingredientId: string) => {
    setDailyNutrition(prev => {
      if (!prev) return prev;
      const index = prev.consumed.findIndex(item => item.ingredientId === ingredientId);
      if (index === -1) return prev;
      const newConsumed = [...prev.consumed];
      newConsumed.splice(index, 1);
      // Recalc logic... 
      let totalProteins = 0; let totalCarbs = 0; let totalFats = 0;
      newConsumed.forEach((consumed) => {
        const ingredient = ingredients.find((i) => i.id === consumed.ingredientId);
        if (ingredient) {
          totalProteins += (ingredient.proteins * consumed.quantity) / 100;
          totalCarbs += (ingredient.carbs * consumed.quantity) / 100;
          totalFats += (ingredient.fats * consumed.quantity) / 100;
        }
      });
      return { ...prev, consumed: newConsumed, totalProteins, totalCarbs, totalFats };
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
        signIn,
        signUp,
        signOut,
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