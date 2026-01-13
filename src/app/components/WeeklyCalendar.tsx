import React from 'react';
import { TrainingSession, Competition } from '../types';

interface WeeklyCalendarProps {
  sessions: TrainingSession[];
  competitions: Competition[];
}

export default function WeeklyCalendar({ sessions, competitions }: WeeklyCalendarProps) {
  // On génère les 7 jours centrés sur aujourd'hui (de -3 à +3)
  const days = [];
  const today = new Date();
  
  for (let i = -3; i <= 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(date);
  }

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const getEventsForDay = (date: Date) => {
    const dateString = date.toDateString();
    return {
      hasSession: sessions.some(s => new Date(s.date).toDateString() === dateString),
      hasCompetition: competitions.some(c => new Date(c.date).toDateString() === dateString)
    };
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-800 mb-4">
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const isToday = index === 3; // L'élément au milieu (index 3) est toujours aujourd'hui
          const { hasSession, hasCompetition } = getEventsForDay(date);
          const dayName = dayNames[date.getDay()];
          const dayNumber = date.getDate();

          return (
            <div
              key={index}
              className={`aspect-[4/5] flex flex-col items-center justify-center rounded-xl transition-all ${
                isToday
                  ? 'bg-gradient-to-br from-[#00F65C]/20 to-[#C1FB00]/20 border-2 border-[#00F65C]'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <span className={`text-[10px] mb-0.5 ${
                isToday 
                  ? 'text-gray-900 dark:text-white font-bold' 
                  : 'text-gray-400 dark:text-gray-500'
              }`}>
                {dayName}
              </span>
              
              <span className={`text-sm font-bold mb-1 ${
                isToday 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {dayNumber}
              </span>

              {/* Indicateurs d'événements */}
              <div className="flex gap-0.5 h-1.5">
                {hasSession && (
                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#00F65C] to-[#C1FB00]" />
                )}
                {hasCompetition && (
                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#C1FB00] to-[#F57BFF]" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}