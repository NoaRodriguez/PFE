import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Trophy, Calendar as CalendarIcon, MapPin, Trash2, Save } from 'lucide-react';
import { SportType } from '../types';
import ConfirmModal from '../components/ConfirmModal';

interface EditCompetitionPageProps {
  onNavigate: (page: string) => void;
  competitionId: string | number;
}

export default function EditCompetitionPage({ onNavigate, competitionId }: EditCompetitionPageProps) {
  const { competitions, updateCompetition, deleteCompetition } = useApp();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const idsMatch = (id1: string | number, id2: string | number) => {
    return String(id1) === String(id2);
  };

  const competition = competitions.find((c) => idsMatch(c.id, competitionId));

  const [date, setDate] = useState('');
  const [nom, setNom] = useState('');
  const [sport, setSport] = useState<SportType>('course');
  const [distance, setDistance] = useState('');
  const [durée, setDurée] = useState('');

  useEffect(() => {
    if (competition) {
      setDate(new Date(competition.date).toISOString().split('T')[0]);
      setNom(competition.nom);
      setSport(competition.sport);
      setDistance(competition.distance.toString());
      setDurée(competition.durée?.toString() || '');
    }
  }, [competition]);

  if (!competition) {
    return <div className="p-4 text-center">Compétition introuvable</div>;
  }

  const handleSave = async () => {
    if (!competition) return;
    if (!nom || !distance) {
      alert("Veuillez remplir le nom et la distance.");
      return;
    }

    try {
      await updateCompetition({
        ...competition,
        date: new Date(date),
        nom,
        sport,
        distance: parseFloat(distance),
        durée: parseInt(durée) || 0,
        intensité: competition.intensité || 10,
      });
      onNavigate('calendar');
    } catch (error) {
      console.error("Erreur update:", error);
      alert("Erreur lors de la modification");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCompetition(competitionId);
      onNavigate('calendar');
    } catch (error) {
      console.error("Erreur delete:", error);
      alert("Erreur lors de la suppression");
    }
  };

  return (
    // CORRECTION SCROLL : pb-32
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-32">
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => onNavigate('calendar')}
            className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
          <h1 className="font-bold text-lg text-gray-900 dark:text-white">Modifier la compétition</h1>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 -mr-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* Nom */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Trophy className="w-4 h-4" /> Nom de l'épreuve
          </label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#F57BFF] outline-none text-gray-900 dark:text-white"
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
            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#F57BFF] outline-none text-gray-900 dark:text-white"
          />
        </div>

        {/* Sport & Distance */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sport</label>
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value as SportType)}
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#F57BFF] outline-none appearance-none text-gray-900 dark:text-white"
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
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#F57BFF] outline-none text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Durée */}
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Durée (minutes)</label>
            <input
              type="number"
              value={durée}
              onChange={(e) => setDurée(e.target.value)}
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#F57BFF] outline-none text-gray-900 dark:text-white"
            />
        </div>

        <button
          onClick={handleSave}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C1FB00] to-[#F57BFF] text-[#292929] font-bold shadow-lg flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" /> Enregistrer les modifications
        </button>
      </div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Supprimer la compétition"
        message="Etes-vous sur de vouloir supprimer cette compétition ? Cette action est irréversible."
      />
    </div>
  );
}