import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Activity, Utensils, User, LogOut, Moon, Sun, Lightbulb } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { getAdviceOfTheDay } from '../data/nutritionAdvices';
import logo from 'figma:asset/8824ddb81cd37c9aee6379966a78e0022b549f27.png';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { userProfile, logout, sessions, competitions, dailyNutrition, getTodayNutrition, isDarkMode, toggleDarkMode } = useApp();

  useEffect(() => {
    getTodayNutrition();
  }, []);

  const todaySessions = sessions.filter(
    (s) => new Date(s.date).toDateString() === new Date().toDateString()
  );

  const upcomingCompetitions = competitions
    .filter((c) => new Date(c.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 1);

  // Calculer les totaux nutritionnels
  const totalProteins = dailyNutrition?.totalProteins || 0;
  const totalCarbs = dailyNutrition?.totalCarbs || 0;
  const totalFats = dailyNutrition?.totalFats || 0;

  // Calculer les pourcentages
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
        {/* Advice of the Day - Moved to top */}
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

        {/* Today's Overview */}
        <div className="space-y-4">
          {/* Today's Sessions */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Aujourd'hui</h2>
            {todaySessions.length > 0 ? (
              <div className="space-y-2.5">
                {todaySessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-3.5 bg-gradient-to-r from-[#00F65C]/10 to-[#C1FB00]/10 rounded-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{session.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{session.duration} min • {session.sport}</p>
                      </div>
                      <Activity className="w-6 h-6 text-[#00F65C]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2.5">
                  <Calendar className="w-7 h-7 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Aucune séance prévue aujourd'hui</p>
                <button
                  onClick={() => onNavigate('calendar')}
                  className="px-5 py-2 bg-gradient-to-r from-[#00F65C] to-[#C1FB00] text-[#292929] rounded-xl hover:opacity-90 transition-opacity text-sm font-medium"
                >
                  Ajouter une séance
                </button>
              </div>
            )}
          </div>

          {/* Nutrition Goals */}
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