import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Trash2, Save, Trophy, MapPin, Clock } from 'lucide-react';
import { SportType } from '../types';
import ConfirmModal from '../components/ConfirmModal';

// AJOUT DE returnTo
interface EditCompetitionPageProps {
  competitionId: string;
  onNavigate: (page: string) => void;
  returnTo?: string; 
}

export default function EditCompetitionPage({ competitionId, onNavigate, returnTo }: EditCompetitionPageProps) {
  const { competitions, updateCompetition, deleteCompetition } = useApp();
  const competition = competitions.find(c => String(c.id) === competitionId);

  const [isDeleting, setIsDeleting] = useState(false);

  const [nom, setNom] = useState(competition?.nom || '');
  const [sport, setSport] = useState<SportType>(competition?.sport || 'course');
  const [distance, setDistance] = useState(competition?.distance.toString() || '');
  const [durée, setDurée] = useState(competition?.durée?.toString() || '');
  const [date, setDate] = useState(
    competition?.date 
      ? new Date(competition.date).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0]
  );

  if (!competition) {
    return <div className="p-4 text-center">Compétition introuvable</div>;
  }

  // FONCTION DE RETOUR INTELLIGENT
  const handleBack = () => {
    if (returnTo === 'dashboard') {
      onNavigate('dashboard');
    } else {
      onNavigate('calendar');
    }
  };

  const handleSave = async () => {
    await updateCompetition({
      ...competition,
      nom,
      sport,
      distance: parseFloat(distance) || 0,
      durée: parseInt(durée) || 0,
      date: new Date(date),
    });
    handleBack();
  };

  const handleDelete = async () => {
    await deleteCompetition(competition.id);
    handleBack();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
          <h1 className="font-bold text-lg text-gray-900 dark:text-white">Modifier la compétition</h1>
          <button 
            onClick={() => setIsDeleting(true)}
            className="p-2 -mr-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nom</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#F57BFF] outline-none transition-all text-gray-900 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
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
              <Clock className="w-4 h-4" /> Durée (min)
            </label>
            <input
              type="number"
              value={durée}
              onChange={(e) => setDurée(e.target.value)}
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#F57BFF] outline-none transition-all text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C1FB00] to-[#F57BFF] text-[#292929] font-bold shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" /> Enregistrer les modifications
        </button>
      </div>

      <ConfirmModal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onConfirm={handleDelete}
        title="Supprimer la compétition ?"
        message="Cette action est irréversible."
      />
    </div>
  );
}