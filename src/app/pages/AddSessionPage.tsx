import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Clock, AlignLeft, Calendar as CalendarIcon, Activity } from 'lucide-react';
import { SportType, SessionType } from '../types';

interface AddSessionPageProps {
  onNavigate: (page: string) => void;
  initialDate?: string; // Nouvelle prop
}

export default function AddSessionPage({ onNavigate, initialDate }: AddSessionPageProps) {
  const { addSession } = useApp();
  
  // On utilise la date passée en paramètre, ou la date du jour par défaut
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');
  const [sport, setSport] = useState<SportType>('course');
  const [duration, setDuration] = useState('');
  const [type, setType] = useState<SessionType>('footing');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSession({
      id: Date.now().toString(),
      date: new Date(date),
      title: title || 'Séance sans titre',
      sport,
      duration: parseInt(duration) || 0,
      type,
      notes,
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
          <h1 className="font-bold text-lg text-gray-900 dark:text-white">Nouvelle séance</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Titre */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Titre de la séance</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Sortie longue"
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#00F65C] outline-none transition-all text-gray-900 dark:text-white"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" /> Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#00F65C] outline-none transition-all text-gray-900 dark:text-white"
            />
          </div>

          {/* Sport & Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Sport
              </label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value as SportType)}
                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#00F65C] outline-none transition-all text-gray-900 dark:text-white appearance-none"
              >
                <option value="course">Course à pied</option>
                <option value="velo">Cyclisme</option>
                <option value="natation">Natation</option>
                <option value="triathlon">Triathlon</option>
                <option value="trail">Trail</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as SessionType)}
                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#00F65C] outline-none transition-all text-gray-900 dark:text-white appearance-none"
              >
                <option value="footing">Footing</option>
                <option value="frac">Fractionné</option>
                <option value="endurance">Endurance</option>
                <option value="tempo">Tempo</option>
                <option value="recuperation">Récupération</option>
              </select>
            </div>
          </div>

          {/* Durée */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Durée (minutes)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="60"
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#00F65C] outline-none transition-all text-gray-900 dark:text-white"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <AlignLeft className="w-4 h-4" /> Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Sensations, parcours..."
              rows={4}
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#00F65C] outline-none transition-all text-gray-900 dark:text-white resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00F65C] to-[#C1FB00] text-[#292929] font-bold shadow-lg hover:opacity-90 transition-opacity"
          >
            Ajouter la séance
          </button>
        </form>
      </div>
    </div>
  );
}