import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Pencil } from 'lucide-react'; // Ajout de l'icone Pencil
import VisualCalendar from '../components/VisualCalendar';

interface CalendarPageProps {
  onNavigate: (page: string) => void;
}

export default function CalendarPage({ onNavigate }: CalendarPageProps) {
  const { sessions, competitions } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const isSameDay = (date1: Date | string, date2: Date | string) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const selectedDaySessions = sessions.filter(s => isSameDay(s.date, selectedDate));
  const selectedDayCompetitions = competitions.filter(c => isSameDay(c.date, selectedDate));

  // Fonction pour formater la date pour l'URL (YYYY-MM-DD)
  const getFormattedDate = () => {
    // On utilise le décalage horaire pour éviter les problèmes de timezone
    const offset = selectedDate.getTimezoneOffset();
    const date = new Date(selectedDate.getTime() - (offset * 60 * 1000));
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendrier</h1>
      </div>

      <div className="mb-6">
        <VisualCalendar 
          sessions={sessions} 
          competitions={competitions} 
          selectedDate={selectedDate}
          onSelectDate={handleDateSelect}
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h2>
        </div>

        {selectedDaySessions.length === 0 && selectedDayCompetitions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Aucun événement prévu ce jour-là
          </p>
        ) : (
          <div className="space-y-3">
            {/* Compétitions */}
            {selectedDayCompetitions.map((competition) => (
              <div 
                key={competition.id}
                onClick={() => onNavigate(`edit-competition:${competition.id}`)}
                className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
              >
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{competition.nom}</h3>
                  <p className="text-sm text-[#F57BFF] capitalize">{competition.sport}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold bg-[#F57BFF]/10 text-[#F57BFF] px-2 py-1 rounded-full">
                    Compétition
                  </span>
                  {/* Petit bouton modifier */}
                  <button className="p-2 text-gray-400 hover:text-[#F57BFF] transition-colors rounded-full hover:bg-[#F57BFF]/10">
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Séances */}
            {selectedDaySessions.map((session) => (
              <div 
                key={session.id}
                onClick={() => onNavigate(`edit-session:${session.id}`)}
                className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
              >
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{session.titre}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{session.sport} • {session.type}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-gray-900 dark:text-white">{session.durée} min</p>
                  {/* Petit bouton modifier */}
                  <button className="p-2 text-gray-400 hover:text-[#00F65C] transition-colors rounded-full hover:bg-[#00F65C]/10">
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Boutons d'ajout avec Date Automatique */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={() => onNavigate(`add-session:${getFormattedDate()}`)}
            className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-[#00F65C] to-[#C1FB00] rounded-2xl text-[#292929] font-bold shadow-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" /> Séance
          </button>
          
          <button
            onClick={() => onNavigate(`add-competition:${getFormattedDate()}`)}
            // MODIFICATION ICI : Dégradé Jaune -> Rose
            className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-[#C1FB00] to-[#F57BFF] rounded-2xl text-[#292929] font-bold shadow-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" /> Compétition
          </button>
        </div>
      </div>
    </div>
  );
}