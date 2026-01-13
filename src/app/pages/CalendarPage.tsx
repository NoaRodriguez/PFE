import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Calendar as CalendarIcon, Trophy, Pencil } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import VisualCalendar from '../components/VisualCalendar';

interface CalendarPageProps {
  onNavigate: (page: string) => void;
}

// Fonction utilitaire ultra-robuste pour comparer les dates
// Elle convertit tout en chaîne YYYY-MM-DD locale pour éviter les bugs de fuseau horaire
const isSameDay = (date1: Date | string, date2: Date | string) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export default function CalendarPage({ onNavigate }: CalendarPageProps) {
  const { sessions, competitions } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Filtrer les événements pour le jour sélectionné
  const selectedDayEvents = [
    ...sessions.filter(s => isSameDay(s.date, selectedDate)).map((s) => ({ ...s, type: 'session' as const })),
    ...competitions.filter(c => isSameDay(c.date, selectedDate)).map((c) => ({ ...c, type: 'competition' as const })),
  ];

  const getDayTitle = () => {
    if (isSameDay(selectedDate, new Date())) {
      return "Événements d'aujourd'hui";
    }
    return `Événements du ${selectedDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`;
  };

  // Helper pour formater la date en string pour l'URL
  const getSelectedDateString = () => {
    // Attention aux décalages horaires : on veut la date locale, pas UTC
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-24">
      <PageHeader title="Mon Calendrier" subtitle="Planifiez vos séances et compétitions" />

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Calendar View Interactif */}
        <VisualCalendar 
          sessions={sessions} 
          competitions={competitions} 
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        {/* Add Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            // ICI : On envoie la date sélectionnée dans la navigation
            onClick={() => onNavigate(`add-session:${getSelectedDateString()}`)}
            className="bg-gradient-to-r from-[#00F65C] to-[#C1FB00] text-[#292929] p-4 rounded-2xl shadow-lg hover:opacity-90 transition-opacity flex flex-col items-center justify-center gap-2"
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm font-medium">Séance</span>
          </button>
          <button
            // ICI : Pareil pour compétition
            onClick={() => onNavigate(`add-competition:${getSelectedDateString()}`)}
            className="bg-gradient-to-r from-[#C1FB00] to-[#F57BFF] text-[#292929] p-4 rounded-2xl shadow-lg hover:opacity-90 transition-opacity flex flex-col items-center justify-center gap-2"
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm font-medium">Compétition</span>
          </button>
        </div>

        {/* Events List du jour sélectionné */}
        <div>
          <h2 className="text-gray-900 dark:text-white mb-3 text-lg capitalize">{getDayTitle()}</h2>
          <div className="space-y-3">
            {selectedDayEvents.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center shadow-lg border border-gray-100 dark:border-gray-800">
                <CalendarIcon className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Rien de prévu pour ce jour-là</p>
              </div>
            ) : (
              selectedDayEvents.map((event) => (
                <div
                  key={`${event.type}-${event.id}`}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-800"
                >
                  {event.type === 'session' ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#00F65C]/20 to-[#C1FB00]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <CalendarIcon className="w-5 h-5 text-[#00F65C]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">{event.title}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {event.duration} min • {event.sport}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-[#00F65C]/10 text-[#00F65C] rounded-lg text-xs font-medium flex-shrink-0">
                          Séance
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onNavigate(`edit-session:${event.id}`)}
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
                        >
                          <Pencil className="w-4 h-4 text-gray-900 dark:text-white" />
                          <span className="text-sm text-gray-900 dark:text-white">Modifier</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#C1FB00]/20 to-[#F57BFF]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Trophy className="w-5 h-5 text-[#F57BFF]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">{event.name}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {event.distance} km • {event.sport}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-[#F57BFF]/10 text-[#F57BFF] rounded-lg text-xs font-medium flex-shrink-0">
                          Course
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onNavigate(`edit-competition:${event.id}`)}
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
                        >
                          <Pencil className="w-4 h-4 text-gray-900 dark:text-white" />
                          <span className="text-sm text-gray-900 dark:text-white">Modifier</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}