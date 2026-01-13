import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Trophy, Calendar as CalendarIcon, MapPin, Timer } from 'lucide-react';
import { SportType } from '../types';

interface AddCompetitionPageProps {
  onNavigate: (page: string) => void;
  initialDate?: string; // Nouvelle prop
}

export default function AddCompetitionPage({ onNavigate, initialDate }: AddCompetitionPageProps) {
  const { addCompetition } = useApp();
  
  // Utilisation de la date initiale
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [name, setName] = useState('');
  const [sport, setSport] = useState<SportType>('course');
  const [distance, setDistance] = useState('');
  const [expectedTime, setExpectedTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCompetition({
      id: Date.now().toString(),
      date: new Date(date),
      name,
      sport,
      distance: parseFloat(distance) || 0,
      expectedTime,
    });
    onNavigate('calendar');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => onNavigate('calendar')}
            className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
          <h1 className="font-bold text-lg text-gray-900 dark:text-white">Nouvelle compétition</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Nom de l'épreuve
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Marathon de Paris"
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#F57BFF] outline-none transition-all text-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" /> Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#F57BFF] outline-none transition-all text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sport</label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value as SportType)}
                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#F57BFF] outline-none transition-all text-gray-900 dark:text-white appearance-none"
              >
                <option value="course">Course à pied</option>
                <option value="velo">Cyclisme</option>
                <option value="natation">Natation</option>
                <option value="triathlon">Triathlon</option>
                <option value="trail">Trail</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Distance (km)
              </label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="42.195"
                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#F57BFF] outline-none transition-all text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Timer className="w-4 h-4" /> Objectif temps
            </label>
            <input
              type="text"
              value={expectedTime}
              onChange={(e) => setExpectedTime(e.target.value)}
              placeholder="03:30:00"
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#F57BFF] outline-none transition-all text-gray-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C1FB00] to-[#F57BFF] text-[#292929] font-bold shadow-lg hover:opacity-90 transition-opacity"
          >
            Ajouter la compétition
          </button>
        </form>
      </div>
    </div>
  );
}