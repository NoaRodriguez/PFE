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
  dailyAdvice: string | null;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, data: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
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
  const [dailyAdvice, setDailyAdvice] = useState<string | null>(null);

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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsLoggedIn(true);
        loadUserData(session.user.id);
      } else {
        setIsLoggedIn(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        loadUserData(session.user.id);
      } else {
        setIsLoggedIn(false);
        setUserProfileState(null);
        setSessions([]);
        setCompetitions([]);
        setWeeklyAdvice(null);
        setDailyAdvice(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    // 1. Profile
    const { data: profileData } = await supabase.from('profil_utilisateur').select('*').eq('id', userId).maybeSingle();
    const { data: macroData } = await supabase.from('macronutriment').select('*').eq('id', userId).maybeSingle();

    if (profileData) {
      setUserProfileState({
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
      });
    }

    // 2. SÉANCES + CONSEILS (JOIN)
    // On récupère les séances ET les conseils liés dans la table conseil_seance
    const { data: sessionData } = await supabase
      .from('seance')
      .select('*, conseil_seance(*)') // La jointure magique
      .eq('id_utilisateur', userId)
      .order('date', { ascending: false });

    if (sessionData) {
      const mappedSessions: TrainingSession[] = sessionData.map((s: any) => {
        // On récupère le premier conseil trouvé (s'il existe)
        const adviceDB = s.conseil_seance && s.conseil_seance.length > 0 ? s.conseil_seance[0] : null;
        
        return {
          id: s.id,
          date: s.date,
          titre: s.titre,
          sport: s.sport,
          durée: s.durée,
          type: s.type,
          description: s.description,
          intensité: s.intensité,
          période_journée: s.période_journée,
          // On structure l'objet conseil pour le frontend
          conseil: adviceDB ? {
            avant: adviceDB.conseil_avant,
            pendant: adviceDB.conseil_pendant,
            apres: adviceDB.conseil_apres
          } : undefined
        };
      });
      setSessions(mappedSessions);
    }

    // 3. Competitions
    const { data: compData } = await supabase.from('competition').select('*').eq('id_utilisateur', userId);
    if (compData) {
      setCompetitions(compData.map((c: any) => ({
        id: c.id,
        date: c.date,
        sport: c.sport,
        durée: c.durée,
        distance: c.distance,
        intensité: c.intensité,
        nom: c.titre || 'Competition'
      })));
    }

    // 4. Conseils Hebdo/Journalier (inchangé)
    const today = new Date().toISOString().split('T')[0];
    const sessionAuth = await supabase.auth.getSession();
    const token = sessionAuth.data.session?.access_token;
    
    const { data: adviceData } = await supabase.from('conseil_semaine').select('conseil').eq('id_utilisateur', userId).gte('date_creation', `${today}T00:00:00`).order('date_creation', { ascending: false }).limit(1).maybeSingle();
    if (adviceData) setWeeklyAdvice(adviceData.conseil);
    else supabase.functions.invoke('generate-weekly-advice', { body: { user_id: userId }, headers: { Authorization: `Bearer ${token}` } }).then(({ data }) => { if (data?.advice) setWeeklyAdvice(data.advice); });

    const { data: dailyAdviceData } = await supabase.from('conseil_jour').select('conseil').eq('id_utilisateur', userId).gte('date_creation', `${today}T00:00:00`).order('date_creation', { ascending: false }).limit(1).maybeSingle();
    if (dailyAdviceData) setDailyAdvice(dailyAdviceData.conseil);
    else supabase.functions.invoke('generate-daily-advice', { body: { user_id: userId }, headers: { Authorization: `Bearer ${token}` } }).then(({ data }) => { if (data?.advice) setDailyAdvice(data.advice); });
  };

  const parseJsonSafe = (input: string | any[] | null) => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    try { return JSON.parse(input); } catch (e) { return input.split(','); }
  };

  const signIn = async (email: string, password: string) => { const { error } = await supabase.auth.signInWithPassword({ email, password }); return { error }; };
  const signUp = async (email: string, password: string, data: any) => { const { error } = await supabase.auth.signUp({ email, password, options: { data: { username: data.username } } }); return { error }; };
  const signOut = async () => { await supabase.auth.signOut(); };

  const setUserProfile = async (profile: UserProfile) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const profileUpdates = { id: user.id, prenom: profile.prenom, poids: Number(profile.poids) || null, taille: Number(profile.taille) || null, objectifs: profile.objectifs, sports: profile.sports, frequence_entrainement: profile.frequence_entrainement, genre: profile.gender, date_naissance: profile.date_naissance };
    await supabase.from('profil_utilisateur').upsert(profileUpdates);
    const weight = Number(profile.poids) || 0;
    const macroUpdates = { id: user.id, date: new Date().toISOString(), proteine: Math.round(weight * 0.8), glucide: Math.round(weight * 4), lipide: Math.round(weight * 1.2) };
    await supabase.from('macronutriment').upsert(macroUpdates);
    setUserProfileState({ ...profile, nutritionGoals: { proteines: macroUpdates.proteine, glucides: macroUpdates.glucide, lipides: macroUpdates.lipide } });
  };

  // --- Helpers Trigger IA ---
  const triggerWeeklyIfRelevant = async (dateInput: string | Date, user_id: string, token: string) => {
      const date = new Date(dateInput); date.setHours(0, 0, 0, 0);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const tenDaysLater = new Date(today); tenDaysLater.setDate(today.getDate() + 10);
      if (date.getTime() >= today.getTime() && date.getTime() <= tenDaysLater.getTime()) {
          supabase.functions.invoke('generate-weekly-advice', { body: { user_id: user_id, force_update: true }, headers: { Authorization: `Bearer ${token}` } }).then(({ data }) => { if (data?.advice) setWeeklyAdvice(data.advice); });
      }
  };

  const triggerDailyIfRelevant = async (dateInput: string | Date, user_id: string, token: string) => {
      const date = new Date(dateInput); date.setHours(0, 0, 0, 0);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
      const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
      if (date.getTime() === yesterday.getTime() || date.getTime() === today.getTime() || date.getTime() === tomorrow.getTime()) {
           supabase.functions.invoke('generate-daily-advice', { body: { user_id: user_id, force_update: true }, headers: { Authorization: `Bearer ${token}` } }).then(({ data }) => { if (data?.advice) setDailyAdvice(data.advice); });
      }
  };

  // --- ADD SESSION : La logique clé ---
  const addSession = async (session: TrainingSession) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. On insère la SÉANCE
    const row = {
      id_utilisateur: user.id,
      date: session.date,
      sport: session.sport,
      titre: session.titre,
      type: session.type,
      durée: session.durée,
      description: session.description,
      intensité: session.intensité,
      période_journée: session.période_journée
      // Pas de champ conseil ici, car il n'est pas dans la table seance
    };

    const { data: sessionData, error: sessionError } = await supabase
      .from('seance')
      .insert(row)
      .select()
      .single();

    if (sessionError) {
      console.error('Error adding session:', sessionError);
      return;
    }

    if (sessionData) {
      // 2. Si on a un conseil, on l'insère dans la table CONSEIL_SEANCE
      if (session.conseil) {
         const adviceRow = {
            id_seance: sessionData.id, // On lie avec l'ID de la séance qu'on vient de créer
            conseil_avant: session.conseil.avant,
            conseil_pendant: session.conseil.pendant,
            conseil_apres: session.conseil.apres
         };
         
         const { error: adviceError } = await supabase
            .from('conseil_seance')
            .insert(adviceRow);
            
         if (adviceError) console.error('Error adding session advice:', adviceError);
      }

      // Mise à jour de l'état local
      const newSession: TrainingSession = { ...session, id: sessionData.id };
      setSessions(prev => [newSession, ...prev]);

      const sessionAuth = await supabase.auth.getSession();
      const token = sessionAuth.data.session?.access_token;
      if (token) {
          triggerWeeklyIfRelevant(session.date, user.id, token);
          triggerDailyIfRelevant(session.date, user.id, token);
      }
    }
  };

  const updateSession = async (session: TrainingSession) => {
    // Pour simplifier, l'update ne met à jour que la séance pour l'instant.
    // La logique de mise à jour du conseil demanderait de vérifier s'il existe déjà ou non.
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; 
    
    const oldSession = sessions.find(s => s.id === session.id);
    const oldDate = oldSession?.date;
    const newDate = session.date;

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
      .eq('id', session.id);

    if (!error) {
      setSessions(prev => prev.map(s => s.id === session.id ? session : s));
      // Triggers IA...
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
    } else {
      console.error("Erreur update session:", error);
      throw error; 
    }
  };

  const deleteSession = async (id: string | number) => {
    const { data: { user } } = await supabase.auth.getUser();
    const sessionToDelete = sessions.find(s => String(s.id) === String(id));
    const deletedDate = sessionToDelete?.date;

    // Supabase gère la cascade delete si configuré, sinon on devrait supprimer le conseil avant.
    // On suppose que la BDD est bien faite (ON DELETE CASCADE), sinon on supprime juste la séance.
    const { error } = await supabase.from('seance').delete().eq('id', id);
    if (!error) {
      setSessions(prev => prev.filter(s => String(s.id) !== String(id)));
      if (user && deletedDate) {
        const sessionAuth = await supabase.auth.getSession();
        const token = sessionAuth.data.session?.access_token;
        if (token) {
            triggerWeeklyIfRelevant(deletedDate, user.id, token);
            triggerDailyIfRelevant(deletedDate, user.id, token);
        }
      }
    } else {
      console.error("Erreur delete session:", error);
    }
  };

  const addCompetition = async (competition: Competition) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const row = { id_utilisateur: user.id, date: competition.date, sport: competition.sport, durée: Math.round(competition.durée || 0), distance: Math.round(competition.distance || 0), intensité: Math.round(competition.intensité || 0) };
    const { data, error } = await supabase.from('competition').insert(row).select().single();
    if (data) {
      setCompetitions(prev => [...prev, { ...competition, id: data.id }]);
      const sessionAuth = await supabase.auth.getSession(); const token = sessionAuth.data.session?.access_token;
      if (token) { triggerWeeklyIfRelevant(competition.date, user.id, token); triggerDailyIfRelevant(competition.date, user.id, token); }
    } else { console.error('Error add comp:', error); }
  };

  const updateCompetition = async (competition: Competition) => {
    const { data: { user } } = await supabase.auth.getUser(); if (!user) return;
    const oldDate = competitions.find(c => c.id === competition.id)?.date;
    const { error } = await supabase.from('competition').update({ date: competition.date, sport: competition.sport, durée: Math.round(competition.durée || 0), distance: Math.round(competition.distance || 0), intensité: Math.round(competition.intensité || 0) }).eq('id', competition.id);
    if (!error) {
      setCompetitions(prev => prev.map(c => c.id === competition.id ? competition : c));
      const sessionAuth = await supabase.auth.getSession(); const token = sessionAuth.data.session?.access_token;
      if (token) { triggerWeeklyIfRelevant(competition.date, user.id, token); triggerDailyIfRelevant(competition.date, user.id, token); if (oldDate && oldDate !== competition.date) { triggerWeeklyIfRelevant(oldDate, user.id, token); triggerDailyIfRelevant(oldDate, user.id, token); } }
    } else { console.error('Error update comp:', error); throw error; }
  };

  const deleteCompetition = async (id: string | number) => {
    const { data: { user } } = await supabase.auth.getUser();
    const deletedDate = competitions.find(c => String(c.id) === String(id))?.date;
    const { error } = await supabase.from('competition').delete().eq('id', id);
    if (!error) {
      setCompetitions(prev => prev.filter(c => String(c.id) !== String(id)));
      if (user && deletedDate) { const sessionAuth = await supabase.auth.getSession(); const token = sessionAuth.data.session?.access_token; if (token) { triggerWeeklyIfRelevant(deletedDate, user.id, token); triggerDailyIfRelevant(deletedDate, user.id, token); } }
    } else { console.error("Error delete comp:", error); }
  };

  const getTodayNutrition = (): DailyNutrition => {
    const today = new Date().toISOString().split('T')[0];
    if (!dailyNutrition || dailyNutrition.date !== today) {
      const newNutrition = { date: today, consumed: [], totalProteins: 0, totalCarbs: 0, totalFats: 0 };
      setDailyNutrition(newNutrition);
      return newNutrition;
    }
    return dailyNutrition;
  };

  const addConsumedFood = (food: ConsumedFood) => {
    setDailyNutrition(prev => { if (!prev) return prev; const newConsumed = [...prev.consumed, food]; let totalProteins = 0; let totalCarbs = 0; let totalFats = 0; newConsumed.forEach((consumed) => { const ingredient = ingredients.find((i) => i.id === consumed.ingredientId); if (ingredient) { totalProteins += (ingredient.proteins * consumed.quantity) / 100; totalCarbs += (ingredient.carbs * consumed.quantity) / 100; totalFats += (ingredient.fats * consumed.quantity) / 100; } }); return { ...prev, consumed: newConsumed, totalProteins, totalCarbs, totalFats }; });
  };

  const removeConsumedFood = (ingredientId: string) => {
    setDailyNutrition(prev => { if (!prev) return prev; const index = prev.consumed.findIndex(item => item.ingredientId === ingredientId); if (index === -1) return prev; const newConsumed = [...prev.consumed]; newConsumed.splice(index, 1); let totalProteins = 0; let totalCarbs = 0; let totalFats = 0; newConsumed.forEach((consumed) => { const ingredient = ingredients.find((i) => i.id === consumed.ingredientId); if (ingredient) { totalProteins += (ingredient.proteins * consumed.quantity) / 100; totalCarbs += (ingredient.carbs * consumed.quantity) / 100; totalFats += (ingredient.fats * consumed.quantity) / 100; } }); return { ...prev, consumed: newConsumed, totalProteins, totalCarbs, totalFats }; });
  };

  return (
    <AppContext.Provider value={{ isLoggedIn, userProfile, sessions, competitions, dailyNutrition, weeklyAdvice, dailyAdvice, isDarkMode, toggleDarkMode, signIn, signUp, signOut, setUserProfile, addSession, updateSession, deleteSession, addCompetition, updateCompetition, deleteCompetition, addConsumedFood, removeConsumedFood, getTodayNutrition }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) { throw new Error('useApp must be used within an AppProvider'); }
  return context;
}