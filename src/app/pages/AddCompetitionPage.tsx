import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';
import { SportType } from '../types';

interface AddCompetitionPageProps {
  onNavigate: (page: string) => void;
}

export default function AddCompetitionPage({ onNavigate }: AddCompetitionPageProps) {
  const { addCompetition, isDarkMode } = useApp();
  const [competitionForm, setCompetitionForm] = useState({
    date: new Date().toISOString().split('T')[0],
    name: '',
    sport: '',
    distance: '',
    expectedTime: '',
  });

  const sports = [
    { value: 'course', label: 'Course à pied' },
    { value: 'velo', label: 'Vélo' },
    { value: 'natation', label: 'Natation' },
    { value: 'trail', label: 'Trail' },
    { value: 'triathlon', label: 'Triathlon' },
  ];

  const handleSubmit = () => {
    if (!competitionForm.name || !competitionForm.date || !competitionForm.sport || !competitionForm.distance) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    addCompetition({
      id: Date.now().toString(),
      date: new Date(competitionForm.date),
      name: competitionForm.name,
      sport: competitionForm.sport as SportType,
      distance: parseFloat(competitionForm.distance),
      expectedTime: competitionForm.expectedTime,
    });
    
    onNavigate('calendar');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-950">
        <div className="max-w-md mx-auto px-6 pt-4 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => onNavigate('calendar')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
            </button>
            <div className="flex-1">
              <h1 className="text-gray-900 dark:text-white">Nouvelle compétition</h1>
            </div>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
      </div>

      <div className="max-w-md mx-auto p-4">
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Nom</label>
            <input
              type="text"
              value={competitionForm.name}
              onChange={(e) => setCompetitionForm({ ...competitionForm, name: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
              placeholder="Marathon de Paris"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Date</label>
            <input
              type="date"
              value={competitionForm.date}
              onChange={(e) => setCompetitionForm({ ...competitionForm, date: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Sport</label>
            <select
              value={competitionForm.sport}
              onChange={(e) => setCompetitionForm({ ...competitionForm, sport: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
            >
              <option value="">Sélectionner...</option>
              {sports.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Distance (km)</label>
            <input
              type="number"
              value={competitionForm.distance}
              onChange={(e) => setCompetitionForm({ ...competitionForm, distance: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
              placeholder="42.2"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Temps prévu (optionnel)</label>
            <input
              type="text"
              value={competitionForm.expectedTime}
              onChange={(e) => setCompetitionForm({ ...competitionForm, expectedTime: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
              placeholder="03:45:00"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-[#C1FB00] to-[#F57BFF] text-[#292929] py-4 rounded-xl hover:opacity-90 transition-all text-base font-medium shadow-lg mt-6"
          >
            Ajouter la compétition
          </button>
        </div>
      </div>
    </div>
  );
}