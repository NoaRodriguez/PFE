import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Clock, AlignLeft, Calendar as CalendarIcon, Activity, Info } from 'lucide-react';
import { SportType, SessionType } from '../types';

interface AddSessionPageProps {
  onNavigate: (page: string) => void;
  initialDate?: string;
}

export default function AddSessionPage({ onNavigate, initialDate }: AddSessionPageProps) {
  const { addSession } = useApp();
  
  // Utilisation des noms de champs compatibles BDD (titre, durée, etc.)
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [titre, setTitre] = useState('');
  const [sport, setSport] = useState<SportType>('course');
  const [durée, setDurée] = useState('');
  const [type, setType] = useState<SessionType>('endurance');
  const [description, setDescription] = useState('');
  
  // Champs spécifiques à ton design V2
  const [période_journée, setPeriodeJournee] = useState('');
  const [intensité, setIntensité] = useState('0'); // Gardé en string pour le slider, converti à l'envoi
  const [showTypeTooltip, setShowTypeTooltip] = useState(false);

  const sessionTypes = [
    { value: 'recuperation', label: 'Récupération' },
    { value: 'endurance', label: 'Endurance' },
    { value: 'tempo', label: 'Rythme / Tempo' },
    { value: 'frac', label: 'Fractionné' },
    { value: 'specific', label: 'Spécifique' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titre || !durée || !type) {
        alert('Veuillez remplir les champs obligatoires');
        return;
    }

    addSession({
      id: 0, // ID temporaire généré par la BDD
      date: new Date(date),
      titre: titre,
      sport,
      durée: parseInt(durée) || 0,
      type,
      description,
      période_journée: période_journée,
      intensité: parseInt(intensité) || 0, 
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
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
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

          {/* Moment de la journée */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Moment de la journée</label>
            <select
              value={période_journée}
              onChange={(e) => setPeriodeJournee(e.target.value)}
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#00F65C] outline-none transition-all text-gray-900 dark:text-white appearance-none"
            >
              <option value="">Sélectionner...</option>
              <option value="matin-jeun">Matin à jeun</option>
              <option value="matinee">Matinée</option>
              <option value="apres-midi">Après-midi</option>
              <option value="fin-apres-midi">Fin d’après-midi</option>
              <option value="soir">Soir</option>
            </select>
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

            <div className="space-y-2 relative">
              <div className="flex items-center gap-2 mb-2">
                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                 <button
                  type="button"
                  onClick={() => setShowTypeTooltip(!showTypeTooltip)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                 >
                   <Info className="w-4 h-4" />
                 </button>
              </div>
              
              {showTypeTooltip && (
                <div className="absolute right-0 bottom-full mb-2 w-64 p-3 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 text-gray-600 dark:text-gray-300">
                  <p className="mb-2"><strong>Récupération:</strong> Effort très léger.</p>
                  <p className="mb-2"><strong>Endurance:</strong> Effort continu modéré.</p>
                  <p className="mb-2"><strong>Rythme:</strong> Soutenu, proche du seuil.</p>
                  <p className="mb-2"><strong>Fractionné:</strong> Intense alterné.</p>
                  <p><strong>Spécifique:</strong> Technique ou force.</p>
                </div>
              )}

              <select
                value={type}
                onChange={(e) => setType(e.target.value as SessionType)}
                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#00F65C] outline-none transition-all text-gray-900 dark:text-white appearance-none"
              >
                {sessionTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Intensité */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex justify-between">
              <span>Intensité (RPE)</span>
              <span className="text-[#00F65C] font-bold">{intensité}/3</span>
            </label>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl">
              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={intensité}
                onChange={(e) => setIntensité(e.target.value)}
                className="w-full accent-[#00F65C]"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Repos</span>
                <span>Léger</span>
                <span>Modéré</span>
                <span>Intense</span>
              </div>
            </div>
          </div>

          {/* Durée */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Durée (minutes)
            </label>
            <input
              type="number"
              value={durée}
              onChange={(e) => setDurée(e.target.value)}
              placeholder="60"
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#00F65C] outline-none transition-all text-gray-900 dark:text-white"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <AlignLeft className="w-4 h-4" /> Notes
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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