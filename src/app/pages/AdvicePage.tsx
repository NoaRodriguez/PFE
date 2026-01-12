import React from 'react';
import { useApp } from '../context/AppContext';
import { Lightbulb, Calendar, Clock, Activity, Droplet, Apple } from 'lucide-react';
import PageHeader from '../components/PageHeader';

interface AdvicePageProps {
  onNavigate: (page: string) => void;
}

export default function AdvicePage({ onNavigate }: AdvicePageProps) {
  const { userProfile, sessions, isDarkMode } = useApp();

  const todaySessions = sessions.filter(
    (s) => new Date(s.date).toDateString() === new Date().toDateString()
  );

  const getGoalAdvice = () => {
    switch (userProfile?.goals?.[0]) {
      case 'reprise':
        return "Pour reprendre le sport en douceur, privilégiez une alimentation équilibrée avec des glucides complexes pour l'énergie et des protéines pour la récupération.";
      case 'hygiene':
        return "Une alimentation variée et équilibrée est la clé. Mangez beaucoup de fruits et légumes, des protéines de qualité et des bonnes graisses.";
      case 'competition':
        return "En préparation de compétition, augmentez progressivement votre apport en glucides les jours précédant l'épreuve (carb loading).";
      case 'sante':
        return "Maintenez une alimentation équilibrée avec suffisamment de fruits, légumes, protéines maigres et glucides complexes.";
      case 'perte-poids':
        return "Pour la perte de poids, créez un déficit calorique modéré tout en maintenant un apport suffisant en protéines pour préserver votre masse musculaire.";
      default:
        return "Cette semaine, montez en intensité dans vos entraînements ! Augmentez votre apport en protéines (poulet, poisson, œufs, légumineuses) pour soutenir vos muscles et optimiser la récupération.";
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-24">
      {/* Header */}
      <PageHeader title="Conseils Nutrition" subtitle="Personnalisés pour vous" />

      <div className="max-w-md mx-auto p-4">
        {/* Weekly Advice */}
        <div className="bg-gradient-to-br from-[#00F65C]/10 to-[#C1FB00]/10 rounded-2xl p-5 mb-4 border border-[#00F65C]/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-[#00F65C]" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1.5 font-semibold text-gray-900 dark:text-white">Conseil de la semaine</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{getGoalAdvice()}</p>
            </div>
          </div>
        </div>

        {/* Daily Advice */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-800 mb-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#C1FB00]/20 to-[#F57BFF]/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-[#C1FB00]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">Conseils du jour</h3>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3.5 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center gap-2 mb-1.5">
                <Droplet className="w-4 h-4 text-[#00F65C]" />
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Hydratation</h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Buvez au moins 1,5 à 2 litres d'eau tout au long de la journée, plus si vous vous entraînez.
              </p>
            </div>
            <div className="p-3.5 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center gap-2 mb-1.5">
                <Apple className="w-4 h-4 text-[#00F65C]" />
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Répartition des repas</h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Mangez 3 repas principaux et 1-2 collations pour maintenir votre énergie stable.
              </p>
            </div>
            <div className="p-3.5 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center gap-2 mb-1.5">
                <Activity className="w-4 h-4 text-[#00F65C]" />
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Post-entraînement</h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Dans les 30 minutes suivant l'effort, consommez des protéines et des glucides pour optimiser la récupération.
              </p>
            </div>
          </div>
        </div>

        {/* Session Specific Advice */}
        {todaySessions.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-800">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#F57BFF]/20 to-[#00F65C]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-[#F57BFF]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">Pour votre séance d'aujourd'hui</h3>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3.5 bg-[#00F65C]/10 rounded-xl">
                <h4 className="font-semibold text-sm mb-1.5 text-gray-900 dark:text-white">Avant (2-3h avant)</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Repas riche en glucides complexes (pâtes, riz, pain complet) et modéré en protéines. Évitez les aliments gras ou trop riches en fibres.
                </p>
              </div>
              <div className="p-3.5 bg-[#C1FB00]/10 rounded-xl">
                <h4 className="font-semibold text-sm mb-1.5 text-gray-900 dark:text-white">Pendant (si &gt; 1h)</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Boisson isotonique ou eau avec une pincée de sel. Pour les efforts prolongés, ajoutez des glucides rapides (gel, banane).
                </p>
              </div>
              <div className="p-3.5 bg-[#F57BFF]/10 rounded-xl">
                <h4 className="font-semibold text-sm mb-1.5 text-gray-900 dark:text-white">Après (dans les 30 min)</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Collation avec un ratio 3:1 glucides-protéines. Exemple : yaourt grec avec fruits, ou shake protéiné avec banane.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* General Tips */}
        <div className="mt-4 bg-gradient-to-br from-[#F57BFF]/10 to-[#00F65C]/10 rounded-2xl p-5 border border-[#F57BFF]/20">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Le saviez-vous ?</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
              <span className="text-[#00F65C] mt-0.5">•</span>
              <span>Les glucides sont le carburant principal lors d'efforts d'endurance</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
              <span className="text-[#C1FB00] mt-0.5">•</span>
              <span>Les protéines aident à réparer les fibres musculaires après l'effort</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
              <span className="text-[#F57BFF] mt-0.5">•</span>
              <span>Les bonnes graisses (oméga-3) réduisent l'inflammation</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}