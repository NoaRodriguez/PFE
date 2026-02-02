import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { TrainingSession } from '../types'; // Import du type
import { Competition } from '../types'; // Import du type
import { Calendar, Activity, LogOut, Moon, Sun, Lightbulb, Trophy, Dumbbell, Zap, Shield, Scale, ChevronRight, X, Clock, AlignLeft, Pencil, MapPin} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // Ajout des animations
import { getAdviceOfTheDay } from '../data/nutritionAdvices';
import WeeklyCalendar from '../components/WeeklyCalendar';
import logo from '../../assets/8824ddb81cd37c9aee6379966a78e0022b549f27.png';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

const isSameDay = (date1: Date | string, date2: Date | string) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { userProfile, signOut, sessions, competitions, getTodayNutrition, isDarkMode, toggleDarkMode, dailyAdvice } = useApp();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);

  useEffect(() => {
    getTodayNutrition();
  }, []);

  const getFormattedDate = () => {
    const offset = selectedDate.getTimezoneOffset();
    const date = new Date(selectedDate.getTime() - (offset * 60 * 1000));
    return date.toISOString().split('T')[0];
  };

  const selectedDaySessions = sessions.filter((s) => isSameDay(s.date, selectedDate));
  const selectedDayCompetitions = competitions.filter((c) => isSameDay(c.date, selectedDate));

  const selectedDayEvents = [
    ...selectedDaySessions.map(s => ({ ...s, type: 'session' as const })),
    ...selectedDayCompetitions.map(c => ({ ...c, type: 'competition' as const }))
  ];

  const upcomingCompetitions = competitions
    .filter((c) => new Date(c.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 1);

  const adviceOfTheDay = getAdviceOfTheDay();

  const getDayTitle = () => {
    if (isSameDay(selectedDate, new Date())) {
      return "Aujourd'hui";
    }
    return selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-24">
      {/* Header with Logo */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-950">
        <div className="max-w-md mx-auto pt-4 px-6">
          <div className="flex items-center justify-between mb-4">
            <img src={logo} alt="SOMA" className="h-8 w-auto" />
            <div className="flex items-center gap-2">
              <button onClick={toggleDarkMode} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                {isDarkMode ? <Sun className="w-5 h-5 text-gray-900 dark:text-white" /> : <Moon className="w-5 h-5 text-gray-900 dark:text-white" />}
              </button>
              <button onClick={signOut} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <LogOut className="w-5 h-5 text-gray-900 dark:text-white" />
              </button>
            </div>
          </div>
          <div>
            <h1 className="text-gray-900 dark:text-white">Bonjour {userProfile?.prenom} 👋</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Prêt à donner le meilleur de vous-même ?</p>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent mt-4" />
      </div>

      <div className="max-w-md mx-auto p-4 pb-24">
        {/* Advice of the Day */}
        <div 
          onClick={() => onNavigate('advice')}
          className="mb-4 bg-gradient-to-r from-[#00F65C]/10 via-[#C1FB00]/10 to-[#F57BFF]/10 rounded-2xl p-5 border border-[#00F65C]/20 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-[#00F65C]" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {dailyAdvice ? "Stratégie 24h" : "Conseil du jour"}
            </h3>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-3xl">
               {dailyAdvice ? "🎯" : adviceOfTheDay.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                 {dailyAdvice ? "Votre plan du jour" : adviceOfTheDay.title}
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 whitespace-pre-wrap">
                {dailyAdvice ? dailyAdvice : adviceOfTheDay.description}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Calendar Interactif */}
        <WeeklyCalendar
          sessions={sessions}
          competitions={competitions}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        {/* Selected Day Overview */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 capitalize">{getDayTitle()}</h2>

            {selectedDayEvents.length > 0 ? (
              <div className="space-y-2.5">
                {selectedDayEvents.map((event) => (
              <div
                key={`${event.type}-${event.id}`}
                // LOGIQUE : Ouvre la modale correspondante (Session ou Compet)
                onClick={() => {
                  if (event.type === 'session') {
                    setSelectedSession(event as unknown as TrainingSession);
                  } else {
                    setSelectedCompetition(event as unknown as Competition);
                  }
                }}
                className="p-3.5 rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                  background: event.type === 'session'
                    ? 'linear-gradient(90deg, rgba(0, 246, 92, 0.1) 0%, rgba(193, 251, 0, 0.1) 100%)'
                    : 'linear-gradient(90deg, rgba(193, 251, 0, 0.1) 0%, rgba(245, 123, 255, 0.1) 100%)'
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {event.type === 'session' ? event.titre : event.nom}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {event.type === 'session'
                        ? `${event.durée} min • ${event.sport}`
                        : `${event.distance} km • Compétition`
                      }
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* BOUTON MODIFIER (Pour TOUS les types maintenant) */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Empêche d'ouvrir la modale
                        if (event.type === 'session') {
                           onNavigate(`edit-session:${event.id}:dashboard`);
                        } else {
                           onNavigate(`edit-competition:${event.id}:dashboard`);
                        }
                      }}
                      className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full hover:bg-white/50 dark:hover:bg-black/20"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    {event.type === 'session' ? (
                      <Activity className="w-6 h-6" style={{ color: '#00F65C' }} />
                    ) : (
                      <Trophy className="w-6 h-6" style={{ color: '#F57BFF' }} />
                    )}
                  </div>
                </div>

                {/* Aperçu du Conseil (Session uniquement) */}
                {event.type === 'session' && event.conseil && (
                  <div className="mt-2 p-3 bg-white dark:bg-black/30 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col gap-1.5 shadow-sm">
                     <div className="flex items-center gap-2 mb-1 border-b border-gray-200 dark:border-gray-700 pb-1.5">
                        <div className="bg-yellow-400/20 p-1 rounded-md">
                            <Lightbulb className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <span className="text-[9px] font-bold uppercase text-gray-500 tracking-wider">Nutrition Performance</span>
                     </div>
                     <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-xs">
                        <span className="font-bold text-[#00F65C]">Avant:</span> 
                        <span className="text-gray-800 dark:text-gray-300 leading-snug line-clamp-1">{event.conseil.avant}</span>
                     </div>
                  </div>
                )}
              </div>
            ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2.5">
                  <Calendar className="w-7 h-7 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Aucun événement prévu ce jour-là</p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => onNavigate(`add-session:${getFormattedDate()}:dashboard`)}
                    className="px-4 py-2 bg-gradient-to-r from-[#00F65C] to-[#C1FB00] text-[#292929] rounded-xl hover:opacity-90 transition-opacity text-xs font-medium"
                  >
                    + Séance
                  </button>
                  <button
                    onClick={() => onNavigate(`add-competition:${getFormattedDate()}:dashboard`)}
                    className="px-4 py-2 bg-gradient-to-r from-[#C1FB00] to-[#F57BFF] text-[#292929] rounded-xl hover:opacity-90 transition-opacity text-xs font-medium"
                  >
                    + Compétition
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Nutrition Goals */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-lg font-bold text-gray-900 dark:text-white">Objectifs Journaliers</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
               <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-1.5">
                  <Dumbbell className="w-5 h-5 text-[#00F65C]" />
                  <div className="text-center">
                     <span className="block text-xl font-bold text-gray-900 dark:text-white">
                        {userProfile?.nutritionGoals.proteines || 0}g
                     </span>
                     <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">Protéines</span>
                  </div>
               </div>
               <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-1.5">
                  <Zap className="w-5 h-5 text-[#C1FB00]" />
                  <div className="text-center">
                     <span className="block text-xl font-bold text-gray-900 dark:text-white">
                        {userProfile?.nutritionGoals.glucides || 0}g
                     </span>
                     <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">Glucides</span>
                  </div>
               </div>
               <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-1.5">
                  <Shield className="w-5 h-5 text-[#F57BFF]" />
                  <div className="text-center">
                     <span className="block text-xl font-bold text-gray-900 dark:text-white">
                        {userProfile?.nutritionGoals.lipides || 0}g
                     </span>
                     <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">Lipides</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Upcoming Competition */}
        {upcomingCompetitions.length > 0 && (
          <div
            onClick={() => onNavigate(`edit-competition:${upcomingCompetitions[0].id}:dashboard`)}
            className="mt-4 bg-gradient-to-r from-[#00F65C]/10 via-[#C1FB00]/10 to-[#F57BFF]/10 rounded-2xl p-5 border border-[#00F65C]/20 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">Prochaine compétition</h3>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{upcomingCompetitions[0].nom}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  {new Date(upcomingCompetitions[0].date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                  {' • '}
                  {upcomingCompetitions[0].distance}km
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl">
                  🏆
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  J-{Math.ceil((new Date(upcomingCompetitions[0].date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Piliers SOMA */}
        <div className="mt-6">
           <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Piliers SOMA</h2>
              <button onClick={() => onNavigate('advice')} className="text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                Voir tout
              </button>
           </div>
           
           <div className="grid grid-cols-2 gap-3">
              <div 
                 onClick={() => onNavigate('advice:muscle:dashboard')} // ICI : Lien intelligent
                 className="p-4 rounded-2xl bg-[#00F65C]/5 border border-[#00F65C]/10 hover:bg-[#00F65C]/10 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-3"
              >
                 <div className="p-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                    <Dumbbell className="w-5 h-5 text-[#00F65C]" />
                 </div>
                 <div>
                    <span className="block font-bold text-gray-900 dark:text-white text-sm">Construction</span>
                    <span className="text-[10px] text-gray-500 uppercase font-medium">Muscle</span>
                 </div>
              </div>

              <div 
                 onClick={() => onNavigate('advice:energy:dashboard')} // ICI
                 className="p-4 rounded-2xl bg-[#C1FB00]/5 border border-[#C1FB00]/10 hover:bg-[#C1FB00]/10 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-3"
              >
                 <div className="p-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                    <Zap className="w-5 h-5 text-[#C1FB00]" />
                 </div>
                 <div>
                    <span className="block font-bold text-gray-900 dark:text-white text-sm">Énergie</span>
                    <span className="text-[10px] text-gray-500 uppercase font-medium">Fuel</span>
                 </div>
              </div>

              <div 
                 onClick={() => onNavigate('advice:recovery:dashboard')} // ICI
                 className="p-4 rounded-2xl bg-[#F57BFF]/5 border border-[#F57BFF]/10 hover:bg-[#F57BFF]/10 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-3"
              >
                 <div className="p-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                    <Shield className="w-5 h-5 text-[#F57BFF]" />
                 </div>
                 <div>
                    <span className="block font-bold text-gray-900 dark:text-white text-sm">Récup</span>
                    <span className="text-[10px] text-gray-500 uppercase font-medium">Protection</span>
                 </div>
              </div>

              <div 
                 onClick={() => onNavigate('advice:balance:dashboard')} // ICI
                 className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-3"
              >
                 <div className="p-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                    <Scale className="w-5 h-5 text-blue-400" />
                 </div>
                 <div>
                    <span className="block font-bold text-gray-900 dark:text-white text-sm">Vitalité</span>
                    <span className="text-[10px] text-gray-500 uppercase font-medium">Équilibre</span>
                 </div>
              </div>
           </div>
        </div>

      </div>

      {/* MODALE DÉTAIL SÉANCE (DASHBOARD) */}
      <AnimatePresence>
        {selectedSession && (
          <motion.div 
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col overflow-hidden"
          >
             {/* Header */}
             <div className="relative p-6 pt-8 flex items-center justify-between border-b border-gray-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate pr-4">
                  {selectedSession.titre}
                </h2>
                <button 
                  onClick={() => setSelectedSession(null)}
                  className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
             </div>

             {/* Contenu */}
             <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-6">
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                   <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 whitespace-nowrap">
                      <Activity className="w-4 h-4 text-[#00F65C]" />
                      <span className="font-medium text-sm capitalize">{selectedSession.sport}</span>
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 whitespace-nowrap">
                      <Clock className="w-4 h-4 text-[#00F65C]" />
                      <span className="font-medium text-sm">{selectedSession.durée} min</span>
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 whitespace-nowrap">
                      <span className="text-[#00F65C] font-bold text-sm">RPE {selectedSession.intensité}/3</span>
                   </div>
                </div>

                {selectedSession.description && (
                  <div className="bg-gray-50 dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800">
                     <h3 className="flex items-center gap-2 text-sm font-bold uppercase text-gray-400 mb-3 tracking-wider">
                        <AlignLeft className="w-4 h-4" /> Notes
                     </h3>
                     <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedSession.description}
                     </p>
                  </div>
                )}

                {selectedSession.conseil ? (
                  <div className="space-y-4">
                     <div className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-[#C1FB00]" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Stratégie Nutrition</h3>
                     </div>

                     <div className="grid gap-4">
                        <div className="p-5 bg-gradient-to-br from-[#00F65C]/10 to-[#00F65C]/5 rounded-2xl border border-[#00F65C]/20">
                           <span className="text-xs font-bold text-[#00F65C] uppercase tracking-widest mb-1 block">Avant</span>
                           <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                              {selectedSession.conseil.avant}
                           </p>
                        </div>

                        <div className="p-5 bg-gradient-to-br from-[#C1FB00]/10 to-[#C1FB00]/5 rounded-2xl border border-[#C1FB00]/20">
                           <span className="text-xs font-bold text-[#aacc00] dark:text-[#C1FB00] uppercase tracking-widest mb-1 block">Pendant</span>
                           <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                              {selectedSession.conseil.pendant}
                           </p>
                        </div>

                        <div className="p-5 bg-gradient-to-br from-[#F57BFF]/10 to-[#F57BFF]/5 rounded-2xl border border-[#F57BFF]/20">
                           <span className="text-xs font-bold text-[#F57BFF] uppercase tracking-widest mb-1 block">Après</span>
                           <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                              {selectedSession.conseil.apres}
                           </p>
                        </div>
                     </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500 bg-gray-50 dark:bg-slate-900 rounded-2xl border-dashed border border-gray-200 dark:border-slate-800">
                     Pas de conseil pour cette séance.
                  </div>
                )}
             </div>

             <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 pb-8">
                <button
                  onClick={() => {
                     onNavigate(`edit-session:${selectedSession.id}:dashboard`);
                     setSelectedSession(null);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 active:scale-95 transition-transform"
                >
                   <Pencil className="w-4 h-4" /> Modifier la séance
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCompetition && (
          <motion.div 
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col overflow-hidden"
          >
             {/* Header */}
             <div className="relative p-6 pt-8 flex items-center justify-between border-b border-gray-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate pr-4">
                  {selectedCompetition.nom}
                </h2>
                <button 
                  onClick={() => setSelectedCompetition(null)}
                  className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
             </div>

             {/* Contenu */}
             <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-6">
                <div className="flex flex-wrap gap-3 pb-2">
                   <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
                      <Trophy className="w-4 h-4 text-[#F57BFF]" />
                      <span className="font-medium text-sm capitalize">{selectedCompetition.sport}</span>
                   </div>
                   {selectedCompetition.distance > 0 && (
                     <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
                        <MapPin className="w-4 h-4 text-[#F57BFF]" />
                        <span className="font-medium text-sm">{selectedCompetition.distance} km</span>
                     </div>
                   )}
                   <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 whitespace-nowrap">
                      <span className="text-[#F57BFF] font-bold text-sm">RPE {selectedCompetition.intensité}/3</span>
                   </div>
                </div>

                {/* Description / Objectif temps (CORRIGÉ) */}
                <div className="bg-gray-50 dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-4">
                   {selectedCompetition.durée && selectedCompetition.durée > 0 && (
                     <div>
                        <h3 className="flex items-center gap-2 text-sm font-bold uppercase text-gray-400 mb-1 tracking-wider">
                           <Clock className="w-4 h-4" /> Objectif Temps
                        </h3>
                        <p className="text-gray-900 dark:text-white font-bold text-lg">
                           {selectedCompetition.durée} min
                        </p>
                     </div>
                   )}
                   
                   {selectedCompetition.description && (
                     <div>
                        <h3 className="flex items-center gap-2 text-sm font-bold uppercase text-gray-400 mb-2 tracking-wider">
                           <AlignLeft className="w-4 h-4" /> Notes
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                           {selectedCompetition.description}
                        </p>
                     </div>
                   )}
                   
                   {!selectedCompetition.durée && !selectedCompetition.description && (
                      <p className="text-gray-500 text-sm italic">Aucune note supplémentaire.</p>
                   )}
                </div>
             </div>

             {/* Footer */}
             <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 pb-8">
                <button
                  onClick={() => {
                     onNavigate(`edit-competition:${selectedCompetition.id}:calendar`);
                     setSelectedCompetition(null);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 active:scale-95 transition-transform"
                >
                   <Pencil className="w-4 h-4" /> Modifier la compétition
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}