import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Info } from 'lucide-react';
import { SportType, SessionType, TrainingSession } from '../types';

interface AddSessionPageProps {
  onNavigate: (page: string) => void;
}

export default function AddSessionPage({ onNavigate }: AddSessionPageProps) {
  const { addSession, isDarkMode } = useApp();
  const [sessionForm, setSessionForm] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    sport: '',
    duration: '',
    type: '',
    intensity: '0',
    moment: '',
    notes: '',
  });
  const [showTypeTooltip, setShowTypeTooltip] = useState(false);

  const sports = [
    { value: 'course', label: 'Course à pied' },
    { value: 'velo', label: 'Vélo' },
    { value: 'natation', label: 'Natation' },
    { value: 'trail', label: 'Trail' },
    { value: 'triathlon', label: 'Triathlon' },
  ];

  const sessionTypes = [
    { value: 'recuperation', label: 'Récupération' },
    { value: 'endurance', label: 'Endurance' },
    { value: 'tempo', label: 'Rythme / Tempo' },
    { value: 'frac', label: 'Fractionné' },
    { value: 'specific', label: 'Spécifique' },
  ]; 

  const handleSubmit = () => {
    if (!sessionForm.date || !sessionForm.title || !sessionForm.sport || !sessionForm.duration || !sessionForm.type) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    const newSession: TrainingSession = {
      id: Date.now().toString(),
      date: new Date(sessionForm.date),
      title: sessionForm.title,
      sport: sessionForm.sport as SportType,
      momentOfDay: sessionForm.moment,
      duration: parseInt(sessionForm.duration),
      type: sessionForm.type as SessionType,
      intensity: parseInt(sessionForm.intensity) || 0,
      notes: sessionForm.notes,
    };

    addSession(newSession);
    
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
              <h1 className="text-gray-900 dark:text-white">Nouvelle séance</h1>
            </div>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
      </div>

      <div className="max-w-md mx-auto p-4">
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Titre</label>
            <input
              type="text"
              value={sessionForm.title}
              onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
              placeholder="Ex: Séance d'entraînement"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Date</label>
            <input
              type="date"
              value={sessionForm.date}
              onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Moment de la journée</label>
            <select
              value={sessionForm.moment}
              onChange={(e) => setSessionForm({ ...sessionForm, moment: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
            >
              <option value="">Sélectionner...</option>
              <option value="matin-jeun">Matin à jeun (avant petit-déjeuner)</option>
              <option value="matinee">Matinée (après petit-déjeuner)</option>
              <option value="apres-midi">Après-midi</option>
              <option value="fin-apres-midi">Fin d’après-midi / début de soirée</option>
              <option value="soir">Soir (après dîner)</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Sport</label>
            <select
              value={sessionForm.sport}
              onChange={(e) => setSessionForm({ ...sessionForm, sport: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
            >
              <option value="">Sélectionner...</option>
              {sports.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Type</label>
              <span className="relative inline-flex">
                <button
                  type="button"
                  aria-expanded={showTypeTooltip}
                  onClick={() => setShowTypeTooltip((s) => !s)}
                  onBlur={() => setShowTypeTooltip(false)}
                  className="p-1"
                >
                  <Info className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                </button>
                <div
                  role="tooltip"
                  className={`absolute left-0 top-full mt-2 w-64 p-3 text-xs text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg transition-opacity ${showTypeTooltip ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                >
                  <strong>Récupération</strong> - Effort très léger, pour récupérer.<br/>Exemples: <em>footing lent, nage facile, vélo souple</em>
                  <hr className="my-2 border-t border-gray-100 dark:border-gray-700" />
                  <strong>Endurance</strong> - Effort continu modéré, développe l'endurance.<br/>Exemples: <em>footing endurance, sortie vélo longue, nage continue</em>
                  <hr className="my-2 border-t border-gray-100 dark:border-gray-700" />
                  <strong>Rythme / Tempo</strong> - Effort soutenu proche du seuil, améliore le maintien d’allure.<br/>Exemples: <em>tempo run, sweet spot vélo, nage au seuil</em>
                  <hr className="my-2 border-t border-gray-100 dark:border-gray-700" />
                  <strong>Fractionné</strong> - Effort intense alterné avec récup, boost cardio/VMA.<br/>Exemples: <em>fractionné court/long, VMA, fractionné en côte</em>
                  <hr className="my-2 border-t border-gray-100 dark:border-gray-700" />
                  <strong>Spécifique</strong> - Travail technique, force ou terrain spécifique.<br/>Exemples: <em>côtes, trail technique, plaquettes natation</em>
                </div>
              </span>
            </div>
            <select
              value={sessionForm.type}
              onChange={(e) => setSessionForm({ ...sessionForm, type: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
            >
              <option value="">Sélectionner...</option>
              {sessionTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Durée (minutes)</label>
            <input
              type="number"
              value={sessionForm.duration}
              onChange={(e) => setSessionForm({ ...sessionForm, duration: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
              placeholder="60"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Intensité</label>
            <div className="flex justify-between text-xs px-1 mb-1 text-gray-600 dark:text-gray-400">
              <span>0</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={3}
                step={1}
                value={sessionForm.intensity}
                onChange={(e) => setSessionForm({ ...sessionForm, intensity: e.target.value })}
                className="w-full"
                style={{ accentColor: '#00F65C' }}
              />
              <div className="w-10 text-center text-sm text-gray-700 dark:text-gray-300">{sessionForm.intensity}</div>
            </div>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">0 = repos, 1 = léger, 2 = modéré, 3 = intense</div>
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Description / Notes (optionnel)</label>
            <textarea
              value={sessionForm.notes}
              onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00F65C] min-h-[100px] resize-none"
              placeholder="Ex: Séance intense avec intervalles courts..."
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-[#00F65C] to-[#C1FB00] text-[#292929] py-4 rounded-xl hover:opacity-90 transition-all text-base font-medium shadow-lg mt-6"
          >
            Ajouter la séance
          </button>
        </div>
      </div>
    </div>
  );
}