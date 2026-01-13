import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Activity, Utensils, User, LogOut, Moon, Sun, Lightbulb, Trophy } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { getAdviceOfTheDay } from '../data/nutritionAdvices';
import WeeklyCalendar from '../components/WeeklyCalendar';
import logo from '../../assets/8824ddb81cd37c9aee6379966a78e0022b549f27.png';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

// Fonction utilitaire pour comparer deux dates sans se soucier de l'heure
const isSameDay = (date1: Date, date2: Date) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { userProfile, logout, sessions, competitions, dailyNutrition, getTodayNutrition, isDarkMode, toggleDarkMode } = useApp();
  
  // État pour la date sélectionnée (initialisé à aujourd'hui)
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    getTodayNutrition();
  }, []);

  // 1. Récupérer les SÉANCES du jour sélectionné
  const selectedDaySessions = sessions.filter((s) => isSameDay(s.date, selectedDate));

  // 2. Récupérer les COMPÉTITIONS du jour sélectionné
  const selectedDayCompetitions = competitions.filter((c) => isSameDay(c.date, selectedDate));

  // Combiner les deux pour l'affichage
  const selectedDayEvents = [
    ...selectedDaySessions.map(s => ({ ...s, type: 'session' as const })),
    ...selectedDayCompetitions.map(c => ({ ...c, type: 'competition' as const }))
  ];

  const upcomingCompetitions = competitions
    .filter((c) => new Date(c.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 1);

  // Calculs nutritionnels (inchangés)
  const totalProteins = dailyNutrition?.totalProteins || 0;
  const totalCarbs = dailyNutrition?.totalCarbs || 0;
  const totalFats = dailyNutrition?.totalFats || 0;

  const proteinsPercentage = userProfile?.nutritionGoals.proteins 
    ? Math.min((totalProteins / userProfile.nutritionGoals.proteins) * 100, 100) 
    : 0;
  const carbsPercentage = userProfile?.nutritionGoals.carbs 
    ? Math.min((totalCarbs / userProfile.nutritionGoals.carbs) * 100, 100) 
    : 0;
  const fatsPercentage = userProfile?.nutritionGoals.fats 
    ? Math.min((totalFats / userProfile.nutritionGoals.fats) * 100, 100) 
    : 0;

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
                onClick={logout}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5 text-gray-900 dark:text-white" />
              </button>
            </div>
          </div>
          <div>
            <h1 className="text-gray-900 dark:text-white">Bonjour {userProfile?.name} 👋</h1>
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
          {/* Liste Mixte (Séances + Compétitions) */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 capitalize">{getDayTitle()}</h2>
            
            {selectedDayEvents.length > 0 ? (
              <div className="space-y-2.5">
                {selectedDayEvents.map((event) => (
                  <div
                    key={`${event.type}-${event.id}`}
                    className={`p-3.5 rounded-xl bg-gradient-to-r ${
                      event.type === 'session'
                        ? 'from-[#00F65C]/10 to-[#C1FB00]/10' // Vert -> Jaune (Séance)
                        : 'from-[#C1FB00]/10 to-[#F57BFF]/10' // Jaune -> Rose (Compétition)
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {event.type === 'session' ? event.title : event.name}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {event.type === 'session' 
                            ? `${event.duration} min • ${event.sport}`
                            : `${event.distance} km • Compétition`
                          }
                        </p>
                      </div>
                      {event.type === 'session' ? (
                        <Activity className="w-6 h-6 text-[#00F65C]" />
                      ) : (
                        <Trophy className="w-6 h-6 text-[#F57BFF]" />
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

          {/* Nutrition Goals (inchangé) */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Objectifs nutritionnels</h2>
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Protéines</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {totalProteins.toFixed(0)}g / {userProfile?.nutritionGoals.proteins}g
                  </span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#F57BFF] to-[#F57BFF]/70 transition-all duration-500" 
                    style={{ width: `${proteinsPercentage}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Glucides</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {totalCarbs.toFixed(0)}g / {userProfile?.nutritionGoals.carbs}g
                  </span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00F65C] to-[#C1FB00] transition-all duration-500" 
                    style={{ width: `${carbsPercentage}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Lipides</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {totalFats.toFixed(0)}g / {userProfile?.nutritionGoals.fats}g
                  </span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#C1FB00] to-[#F57BFF] transition-all duration-500" 
                    style={{ width: `${fatsPercentage}%` }}
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('tracker')}
              className="w-full mt-4 px-5 py-2.5 bg-gradient-to-r from-[#00F65C] to-[#C1FB00] text-[#292929] rounded-xl hover:opacity-90 transition-opacity text-sm font-medium"
            >
              Suivre ma nutrition
            </button>
          </div>
        </div>

        {/* Upcoming Competition */}
        {upcomingCompetitions.length > 0 && (
          <div className="mt-4 bg-gradient-to-r from-[#00F65C]/10 via-[#C1FB00]/10 to-[#F57BFF]/10 rounded-2xl p-5 border border-[#00F65C]/20">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">Prochaine compétition</h3>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{upcomingCompetitions[0].name}</h4>
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
      </div>
    </div>
  );
}