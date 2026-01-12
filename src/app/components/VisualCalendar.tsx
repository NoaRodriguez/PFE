import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TrainingSession, Competition } from '../types';

interface VisualCalendarProps {
  sessions: TrainingSession[];
  competitions: Competition[];
}

export default function VisualCalendar({ sessions, competitions }: VisualCalendarProps) {
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

  const getEventsForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = date.toDateString();

    const daySessions = sessions.filter(
      s => new Date(s.date).toDateString() === dateString
    );
    const dayCompetitions = competitions.filter(
      c => new Date(c.date).toDateString() === dateString
    );

    return { sessions: daySessions, competitions: dayCompetitions };
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const renderDays = () => {
    const days = [];
    const totalSlots = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;

    for (let i = 0; i < totalSlots; i++) {
      const dayNumber = i - firstDayOfMonth + 1;
      const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;

      if (isValidDay) {
        const events = getEventsForDay(dayNumber);
        const hasEvents = events.sessions.length > 0 || events.competitions.length > 0;
        const today = isToday(dayNumber);

        days.push(
          <div
            key={i}
            className={`aspect-square p-1.5 flex flex-col items-center justify-center rounded-lg transition-all ${
              today
                ? 'bg-gradient-to-br from-[#00F65C]/20 to-[#C1FB00]/20 border-2 border-[#00F65C]'
                : hasEvents
                ? 'bg-gray-50 dark:bg-gray-800/50'
                : 'hover:bg-gray-50 dark:hover:bg-gray-900'
            }`}
          >
            <span
              className={`text-sm mb-1 ${
                today
                  ? 'text-gray-900 dark:text-white font-bold'
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
          </div>
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
