import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
// CORRECTION ICI : Ajout de Clock et Gauge dans les imports
import { ChevronLeft, Trophy, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import { SportType } from '../types';

// AJOUT DE returnTo DANS LES PROPS
interface AddCompetitionPageProps {
  onNavigate: (page: string) => void;
  initialDate?: string;
  returnTo?: string; 
}

export default function AddCompetitionPage({ onNavigate, initialDate, returnTo }: AddCompetitionPageProps) {
  const { addCompetition } = useApp();
  
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  
  useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
    }
  }, [initialDate]);

  const [nom, setNom] = useState('');
  const [sport, setSport] = useState<SportType>('course');
  const [distance, setDistance] = useState('');
  const [durée, setDurée] = useState('');
  const [intensité, setIntensité] = useState('0');

  // FONCTION INTELLIGENTE DE RETOUR
  const handleBack = () => {
    if (returnTo === 'dashboard') {
      onNavigate('dashboard');
    } else {
      onNavigate('calendar');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !sport) {
        alert('Veuillez remplir les champs obligatoires');
        return;
    }

    try {
      await addCompetition({
        id: 0,
        date: new Date(date),
        nom,
        sport,
        distance: parseInt(distance) || 0,
        durée: parseInt(durée) || 0,
        intensité: parseInt(intensité) || 0,
      });
      // UTILISATION DU RETOUR INTELLIGENT
      handleBack();
    } catch (error) {
      console.error('Failed to add competition:', error);
      alert("Erreur lors de l'ajout de la compétition.");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={handleBack} // MODIFIE ICI
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
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nom de la course</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Sport
            </label>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Distance (km)
              </label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#F57BFF] outline-none transition-all text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Objectif (min)
              </label>
              <input
                type="number"
                value={durée}
                onChange={(e) => setDurée(e.target.value)}
                placeholder="Optionnel"
                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#F57BFF] outline-none transition-all text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex justify-between">
              <span>Intensité (RPE)</span>
              <span className="text-[#F57BFF] font-bold">{intensité}/3</span>
            </label>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl">
              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={intensité}
                onChange={(e) => setIntensité(e.target.value)}
                className="w-full accent-[#F57BFF]"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Repos</span>
                <span>Léger</span>
                <span>Modéré</span>
                <span>Intense</span>
              </div>
            </div>
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