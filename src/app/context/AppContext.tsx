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
  weeklyAdvice: string | null;
  dailyAdvice: string | null; // [NEW DAILY]
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
  const [weeklyAdvice, setWeeklyAdvice] = useState<string | null>(null);
  const [dailyAdvice, setDailyAdvice] = useState<string | null>(null); // [NEW DAILY]

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
        setWeeklyAdvice(null);
        setDailyAdvice(null); // [NEW DAILY]
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

    const today = new Date().toISOString().split('T')[0];
    const sessionAuth = await supabase.auth.getSession();
    const token = sessionAuth.data.session?.access_token;
    
    // --- LOAD WEEKLY ADVICE ---
    const { data: adviceData } = await supabase
        .from('conseil_semaine')
        .select('conseil')
        .eq('id_utilisateur', userId)
        .gte('date_creation', `${today}T00:00:00`)
        .order('date_creation', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (adviceData) {
        setWeeklyAdvice(adviceData.conseil);
    } else {
        // Trigger check WEEKLY
        supabase.functions.invoke('generate-weekly-advice', {
          body: { user_id: userId },
          headers: { Authorization: `Bearer ${token}` }
        }).then(async ({ data, error }) => {
          if (error) console.error('Error invoking weekly advice:', error);
          else if (data?.advice) {
             setWeeklyAdvice(data.advice); 
          }
        });
    }

    // --- LOAD DAILY ADVICE [NEW DAILY] ---
    const { data: dailyAdviceData } = await supabase
        .from('conseil_jour')
        .select('conseil')
        .eq('id_utilisateur', userId)
        .gte('date_creation', `${today}T00:00:00`)
        .order('date_creation', { ascending: false })
        .limit(1)
        .maybeSingle();
    
    if (dailyAdviceData) {
        setDailyAdvice(dailyAdviceData.conseil);
    } else {
        // Trigger check DAILY
        supabase.functions.invoke('generate-daily-advice', {
             body: { user_id: userId },
             headers: { Authorization: `Bearer ${token}` }
        }).then(async ({ data, error }) => {
            if (error) console.error('Error invoking daily advice:', error);
            else if (data?.advice) {
                setDailyAdvice(data.advice);
            }
        });
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

  // --- TRIGGER HELPERS ---

  const triggerWeeklyIfRelevant = async (dateStr: string, user_id: string, token: string) => {
      const date = new Date(dateStr);
      date.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tenDaysLater = new Date(today);
      tenDaysLater.setDate(today.getDate() + 10);

      if (date.getTime() >= today.getTime() && date.getTime() <= tenDaysLater.getTime()) {
          console.log(`[Weekly Trigger] Date ${dateStr} is within 10 days horizon. Regenerating...`);
          supabase.functions.invoke('generate-weekly-advice', {
              body: { user_id: user_id, force_update: true },
              headers: { Authorization: `Bearer ${token}` }
          }).then(async ({ data, error }) => {
              if (error) console.error('[Weekly Trigger] Error:', error);
              else if (data?.advice) {
                  setWeeklyAdvice(data.advice);
              }
          });
      }
  };

  const triggerDailyIfRelevant = async (dateStr: string, user_id: string, token: string) => {
      const date = new Date(dateStr);
      date.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      // Trigger if Yesterday, Today, or Tomorrow
      if (date.getTime() === yesterday.getTime() || date.getTime() === today.getTime() || date.getTime() === tomorrow.getTime()) {
          console.log(`[Daily Trigger] Date ${dateStr} is relevant (J-1, J, J+1). Regenerating...`);
           supabase.functions.invoke('generate-daily-advice', {
              body: { user_id: user_id, force_update: true },
              headers: { Authorization: `Bearer ${token}` }
          }).then(async ({ data, error }) => {
              if (error) console.error('[Daily Trigger] Error:', error);
              else if (data?.advice) {
                  setDailyAdvice(data.advice);
              }
          });
      }
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
      const newSession: TrainingSession = { ...session, id: data.id };
      setSessions(prev => [newSession, ...prev]);

      // --- TRIGGERS ---
      const sessionAuth = await supabase.auth.getSession();
      const token = sessionAuth.data.session?.access_token;
      if (token) {
          triggerWeeklyIfRelevant(session.date, user.id, token);
          triggerDailyIfRelevant(session.date, user.id, token);
      }
    }
  };

  const updateSession = async (session: TrainingSession) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; // Should allow triggers even if context user might be null? safely assume logged in if updating
    
    // Find old session to check date change
    const oldSession = sessions.find(s => s.id === session.id);
    const oldDate = oldSession?.date;
    const newDate = session.date;

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
      setSessions(prev => prev.map(s => s.id === id ? session : s));

      // --- TRIGGERS ---
      const sessionAuth = await supabase.auth.getSession();
      const token = sessionAuth.data.session?.access_token;
      if (token) {
          // Trigger for New Date
          triggerWeeklyIfRelevant(newDate, user.id, token);
          triggerDailyIfRelevant(newDate, user.id, token);

          // Trigger for Old Date (if different)
          if (oldDate && oldDate !== newDate) {
              triggerWeeklyIfRelevant(oldDate, user.id, token);
              triggerDailyIfRelevant(oldDate, user.id, token);
          }
      }

    } else {
      console.error("Erreur lors de la mise à jour de la séance:", error);
      throw error; 
    }
  };

  const deleteSession = async (id: string | number) => {
    const { data: { user } } = await supabase.auth.getUser();
    const sessionToDelete = sessions.find(s => String(s.id) === String(id));
    const deletedDate = sessionToDelete?.date;

    const { error } = await supabase.from('seance').delete().eq('id', id);
    if (!error) {
      setSessions(prev => prev.filter(s => String(s.id) !== String(id)));

       // --- TRIGGERS ---
      if (user && deletedDate) {
        const sessionAuth = await supabase.auth.getSession();
        const token = sessionAuth.data.session?.access_token;
        if (token) {
            triggerWeeklyIfRelevant(deletedDate, user.id, token);
            triggerDailyIfRelevant(deletedDate, user.id, token);
        }
      }
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
      const newComp: Competition = { ...competition, id: data.id };
      setCompetitions(prev => [...prev, newComp]);

      // --- TRIGGERS ---
      const sessionAuth = await supabase.auth.getSession();
      const token = sessionAuth.data.session?.access_token;
      if (token) {
          triggerWeeklyIfRelevant(competition.date, user.id, token);
          triggerDailyIfRelevant(competition.date, user.id, token);
      }
    }
  };

  const updateCompetition = async (competition: Competition) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const oldCompetition = competitions.find(c => c.id === competition.id);
    const oldDate = oldCompetition?.date;
    const newDate = competition.date;

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
      throw error; 
    } else {
      setCompetitions(prev => prev.map(c => c.id === id ? competition : c));

       // --- TRIGGERS ---
       const sessionAuth = await supabase.auth.getSession();
       const token = sessionAuth.data.session?.access_token;
       if (token) {
           triggerWeeklyIfRelevant(newDate, user.id, token);
           triggerDailyIfRelevant(newDate, user.id, token);

           if (oldDate && oldDate !== newDate) {
               triggerWeeklyIfRelevant(oldDate, user.id, token);
               triggerDailyIfRelevant(oldDate, user.id, token);
           }
       }
    }
  };

  const deleteCompetition = async (id: string | number) => {
    const { data: { user } } = await supabase.auth.getUser();
    const compToDelete = competitions.find(c => String(c.id) === String(id));
    const deletedDate = compToDelete?.date;

    const { error } = await supabase.from('competition').delete().eq('id', id);
    if (!error) {
      setCompetitions(prev => prev.filter(c => String(c.id) !== String(id)));

       // --- TRIGGERS ---
       if (user && deletedDate) {
           const sessionAuth = await supabase.auth.getSession();
           const token = sessionAuth.data.session?.access_token;
           if (token) {
               triggerWeeklyIfRelevant(deletedDate, user.id, token);
               triggerDailyIfRelevant(deletedDate, user.id, token);
           }
       }
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
        weeklyAdvice,
        dailyAdvice, // [NEW]
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