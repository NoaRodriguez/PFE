import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Pencil, Lightbulb } from 'lucide-react'; // Ajout de Lightbulb
import VisualCalendar from '../components/VisualCalendar';
import PageHeader from '../components/PageHeader';

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

  const getFormattedDate = () => {
    const offset = selectedDate.getTimezoneOffset();
    const date = new Date(selectedDate.getTime() - (offset * 60 * 1000));
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="pb-24 px-4 max-w-md mx-auto min-h-screen bg-gray-50 dark:bg-gray-950">
      
      <PageHeader 
        title="Calendrier" 
        subtitle="Planifiez vos séances et compétitions"
      />

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
                className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{session.titre}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{session.sport} • {session.type}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-gray-900 dark:text-white">{session.durée} min</p>
                    <button className="p-2 text-gray-400 hover:text-[#00F65C] transition-colors rounded-full hover:bg-[#00F65C]/10">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* --- BLOC CONSEIL (AJOUTÉ) --- */}
                {session.conseil && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col gap-1.5">
                     <div className="flex items-center gap-2 mb-1 border-b border-gray-200 dark:border-gray-700 pb-1.5">
                        <div className="bg-yellow-400/20 p-1 rounded-md">
                            <Lightbulb className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <span className="text-[9px] font-bold uppercase text-gray-500 tracking-wider">Nutrition Performance</span>
                     </div>
                     <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-xs">
                        <span className="font-bold text-[#00F65C]">Avant:</span> 
                        <span className="text-gray-700 dark:text-gray-300 leading-snug">{session.conseil.avant}</span>
                        
                        <span className="font-bold text-[#C1FB00]">Pendant:</span> 
                        <span className="text-gray-700 dark:text-gray-300 leading-snug">{session.conseil.pendant}</span>
                        
                        <span className="font-bold text-[#F57BFF]">Après:</span> 
                        <span className="text-gray-700 dark:text-gray-300 leading-snug">{session.conseil.apres}</span>
                     </div>
                  </div>
                )}
                {/* ----------------------------- */}

              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={() => onNavigate(`add-session:${getFormattedDate()}`)}
            className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-[#00F65C] to-[#C1FB00] rounded-2xl text-[#292929] font-bold shadow-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" /> Séance
          </button>
          
          <button
            onClick={() => onNavigate(`add-competition:${getFormattedDate()}`)}
            className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-[#C1FB00] to-[#F57BFF] rounded-2xl text-[#292929] font-bold shadow-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" /> Compétition
          </button>
        </div>
      </div>
    </div>
  );
}