import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useWeeklyAdvice } from '../hooks/useWeeklyAdvice';
// J'ai ajouté Scale et ChevronRight pour la nouvelle section
import { Calendar, Activity, LogOut, Moon, Sun, Lightbulb, Trophy, Dumbbell, Zap, Shield, Scale, ChevronRight } from 'lucide-react';
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
  const { userProfile, signOut, sessions, competitions, getTodayNutrition, isDarkMode, toggleDarkMode } = useApp();

  useWeeklyAdvice(userProfile?.id);

  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    getTodayNutrition();
  }, []);

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
              <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-gray-900 dark:text-white" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-900 dark:text-white" />
                )}
              </button>
              <button
                onClick={signOut}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
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
        <div className="mb-4 bg-gradient-to-r from-[#00F65C]/10 via-[#C1FB00]/10 to-[#F57BFF]/10 rounded-2xl p-5 border border-[#00F65C]/20">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-[#00F65C]" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Conseil du jour</h3>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-3xl">{adviceOfTheDay.icon}</div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{adviceOfTheDay.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {adviceOfTheDay.description}
              </p>
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
                    onClick={() => onNavigate(event.type === 'session' ? `edit-session:${event.id}` : `edit-competition:${event.id}`)}
                    className="p-3.5 rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      background: event.type === 'session'
                        ? 'linear-gradient(90deg, rgba(0, 246, 92, 0.1) 0%, rgba(193, 251, 0, 0.1) 100%)'
                        : 'linear-gradient(90deg, rgba(193, 251, 0, 0.1) 0%, rgba(245, 123, 255, 0.1) 100%)'
                    }}
                  >
                    <div className="flex items-center justify-between">
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
                      {event.type === 'session' ? (
                        <Activity className="w-6 h-6" style={{ color: '#00F65C' }} />
                      ) : (
                        <Trophy className="w-6 h-6" style={{ color: '#F57BFF' }} />
                      )}
                    </div>
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
                    onClick={() => onNavigate('add-session')}
                    className="px-4 py-2 bg-gradient-to-r from-[#00F65C] to-[#C1FB00] text-[#292929] rounded-xl hover:opacity-90 transition-opacity text-xs font-medium"
                  >
                    + Séance
                  </button>
                  <button
                    onClick={() => onNavigate('add-competition')}
                    className="px-4 py-2 bg-gradient-to-r from-[#C1FB00] to-[#F57BFF] text-[#292929] rounded-xl hover:opacity-90 transition-opacity text-xs font-medium"
                  >
                    + Compétition
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* -------------------------------------------------------
              MODIFICATION : CIBLES NUTRITION (REMPLACEMENT BARRES)
              ------------------------------------------------------- */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-lg font-bold text-gray-900 dark:text-white">Objectifs Journaliers</h2>
            </div>

            <div className="grid grid-cols-3 gap-3">
               {/* Carte Protéines */}
               <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-1.5">
                  <Dumbbell className="w-5 h-5 text-[#00F65C]" />
                  <div className="text-center">
                     <span className="block text-xl font-bold text-gray-900 dark:text-white">
                        {userProfile?.nutritionGoals.proteines || 0}g
                     </span>
                     <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">Protéines</span>
                  </div>
               </div>

               {/* Carte Glucides */}
               <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-1.5">
                  <Zap className="w-5 h-5 text-[#C1FB00]" />
                  <div className="text-center">
                     <span className="block text-xl font-bold text-gray-900 dark:text-white">
                        {userProfile?.nutritionGoals.glucides || 0}g
                     </span>
                     <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">Glucides</span>
                  </div>
               </div>

               {/* Carte Lipides */}
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
            onClick={() => onNavigate(`edit-competition:${upcomingCompetitions[0].id}`)}
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

        {/* -------------------------------------------------------
            AJOUT : PILIERS DE LA PERFORMANCE (À LA FIN)
            ------------------------------------------------------- */}
        <div className="mt-6">
           <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Piliers SOMA</h2>
              <button onClick={() => onNavigate('advice')} className="text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                Voir tout
              </button>
           </div>
           
           <div className="grid grid-cols-2 gap-3">
              {/* Carte 1 : Construction (Muscle) */}
              <div 
                 onClick={() => onNavigate('advice')}
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

              {/* Carte 2 : Énergie (Glucides) */}
              <div 
                 onClick={() => onNavigate('advice')}
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

              {/* Carte 3 : Protection (Récup) */}
              <div 
                 onClick={() => onNavigate('advice')}
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

              {/* Carte 4 : Vitalité (Balance) */}
              <div 
                 onClick={() => onNavigate('advice')}
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
    </div>
  );
}