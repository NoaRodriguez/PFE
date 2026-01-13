import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TrainingSession, Competition } from '../types';

interface VisualCalendarProps {
  sessions: TrainingSession[];
  competitions: Competition[];
  selectedDate: Date; // Ajout
  onSelectDate: (date: Date) => void; // Ajout
}

export default function VisualCalendar({ 
  sessions, 
  competitions, 
  selectedDate, 
  onSelectDate 
}: VisualCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isSameDay = (date1: Date, date2: Date) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const getEventsForDay = (date: Date) => {
    const daySessions = sessions.filter(s => isSameDay(s.date, date));
    const dayCompetitions = competitions.filter(c => isSameDay(c.date, date));
    return { sessions: daySessions, competitions: dayCompetitions };
  };

  const renderDays = () => {
    const days = [];
    const totalSlots = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;

    for (let i = 0; i < totalSlots; i++) {
      const dayNumber = i - firstDayOfMonth + 1;
      const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;

      if (isValidDay) {
        // On reconstruit la date précise de ce jour
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
        
        const events = getEventsForDay(date);
        const hasEvents = events.sessions.length > 0 || events.competitions.length > 0;
        
        const isSelected = isSameDay(date, selectedDate);
        const isToday = isSameDay(date, new Date());

        days.push(
          <button
            key={i}
            onClick={() => onSelectDate(date)}
            className={`aspect-square p-1.5 flex flex-col items-center justify-center rounded-lg transition-all ${
              isSelected
                ? 'bg-gradient-to-br from-[#00F65C]/20 to-[#C1FB00]/20 border-2 border-[#00F65C]'
                : isToday
                ? 'bg-gray-100 dark:bg-gray-800 border-2 border-transparent text-[#00F65C] font-bold'
                : hasEvents
                ? 'bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent'
                : 'hover:bg-gray-50 dark:hover:bg-gray-900 border-2 border-transparent'
            }`}
          >
            <span
              className={`text-sm mb-1 ${
                isSelected
                  ? 'text-gray-900 dark:text-white font-bold'
                  : isToday
                  ? 'text-[#00F65C]'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {dayNumber}
            </span>
            <div className="flex gap-0.5">
              {events.sessions.length > 0 && (
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#00F65C] to-[#C1FB00]" />
              )}
              {events.competitions.length > 0 && (
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#C1FB00] to-[#F57BFF]" />
              )}
            </div>
          </button>
        );
      } else {
        days.push(
          <div key={i} className="aspect-square p-1.5" />
        );
      }
    }

    return days;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-white" />
        </button>
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-900 dark:text-white" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs text-gray-500 dark:text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#00F65C] to-[#C1FB00]" />
          <span className="text-xs text-gray-600 dark:text-gray-400">Séance</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#C1FB00] to-[#F57BFF]" />
          <span className="text-xs text-gray-600 dark:text-gray-400">Compétition</span>
        </div>
      </div>
    </div>
  );
}