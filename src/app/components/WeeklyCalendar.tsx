import React, { useState } from 'react';
import { TrainingSession, Competition } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeeklyCalendarProps {
  sessions: TrainingSession[];
  competitions: Competition[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

// Même utilitaire que dans le Dashboard pour la cohérence
const isSameDay = (date1: Date | string, date2: Date | string) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export default function WeeklyCalendar({
  sessions,
  competitions,
  selectedDate,
  onSelectDate
}: WeeklyCalendarProps) {
  // État pour gérer le début de la semaine visible
  const [startOfWeek, setStartOfWeek] = useState(new Date());

  const days = [];

  for (let i = -3; i <= 3; i++) {
    const date = new Date(selectedDate);
    date.setDate(selectedDate.getDate() + i);
    days.push(date);
  }

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const getEventsForDay = (date: Date) => {
    return {
      hasSession: sessions.some(s => isSameDay(s.date, date)),
      hasCompetition: competitions.some(c => isSameDay(c.date, date))
    };
  };

  const handlePrevWeek = () => {
    const newDate = new Date(startOfWeek);
    newDate.setDate(startOfWeek.getDate() - 7);
    setStartOfWeek(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(startOfWeek);
    newDate.setDate(startOfWeek.getDate() + 7);
    setStartOfWeek(newDate);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-800 mb-4">
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());

          const { hasSession, hasCompetition } = getEventsForDay(date);
          const dayName = dayNames[date.getDay()];
          const dayNumber = date.getDate();

          return (
            <button
              key={index}
              onClick={() => onSelectDate(date)}
              className={`aspect-[4/5] flex flex-col items-center justify-center rounded-xl transition-all ${isSelected
                  ? 'bg-gradient-to-br from-[#00F65C]/20 to-[#C1FB00]/20 border-2 border-[#00F65C]'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                } ${isToday && !isSelected ? 'bg-gray-50 dark:bg-gray-800' : ''}`}
            >
              <span className={`text-[10px] mb-0.5 ${isSelected
                  ? 'text-gray-900 dark:text-white font-bold'
                  : 'text-gray-400 dark:text-gray-500'
                }`}>
                {dayName}
              </span>

              <span className={`text-sm font-bold mb-1 ${isSelected
                  ? 'text-gray-900 dark:text-white'
                  : isToday
                    ? 'text-[#00F65C]'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                {dayNumber}
              </span>

        {/* Flèche Droite */}
        <button 
          onClick={handleNextWeek}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
        >
          <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </button>
      </div>
    </div>
  );
}