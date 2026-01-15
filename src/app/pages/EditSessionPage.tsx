import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';
import { SportType, SessionType, TrainingSession } from '../types';

interface EditSessionPageProps {
  sessionId: number; // ID is usually number/bigint in Supabase now
  onNavigate: (page: string) => void;
}

import ConfirmModal from '../components/ConfirmModal';

export default function EditSessionPage({ sessionId, onNavigate }: EditSessionPageProps) {
  const { sessions, updateSession, deleteSession } = useApp();
  const session = sessions.find(s => s.id === sessionId);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [sessionForm, setSessionForm] = useState({
    date: session ? new Date(session.date).toISOString().split('T')[0] : '',
    titre: session?.titre || '',
    sport: session?.sport || '',
    durée: session?.durée.toString() || '',
    type: session?.type || '',
    description: session?.description || '',
  });

  const sports = [
    { value: 'course', label: 'Course à pied' },
    { value: 'velo', label: 'Vélo' },
    { value: 'natation', label: 'Natation' },
    { value: 'trail', label: 'Trail' },
    { value: 'triathlon', label: 'Triathlon' },
  ];

  const sessionTypes = [
    { value: 'frac', label: 'Fractionné' },
    { value: 'endurance', label: 'Endurance' },
    { value: 'footing', label: 'Footing' },
    { value: 'tempo', label: 'Tempo' },
    { value: 'recuperation', label: 'Récupération' },
    { value: 'interval', label: 'Interval' },
  ];

  const handleSubmit = async () => {
    if (!sessionForm.date || !sessionForm.titre || !sessionForm.sport || !sessionForm.durée || !sessionForm.type) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      await updateSession(sessionId, {
        id: sessionId,
        date: new Date(sessionForm.date).toISOString(),
        titre: sessionForm.titre,
        sport: sessionForm.sport as SportType,
        durée: parseInt(sessionForm.durée),
        type: sessionForm.type as SessionType,
        description: sessionForm.description,
        intensité: session?.intensité || 'moyenne',
        période_journée: session?.période_journée || 'soir'
      });

      onNavigate('calendar');
    } catch (error) {
      console.error('Error updating session:', error);
      alert('Erreur lors de la modification de la séance');
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteSession(sessionId);
      onNavigate('calendar');
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Erreur lors de la suppression de la séance');
    }
  };

  if (!session) {
    return null;
  }

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
              <h1 className="text-gray-900 dark:text-white">Modifier la séance</h1>
            </div>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
      </div>

      <div className="max-w-md mx-auto p-4">
        <div className="space-y-4">
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
            <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Titre</label>
            <input
              type="text"
              value={sessionForm.titre}
              onChange={(e) => setSessionForm({ ...sessionForm, titre: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
              placeholder="Ex: Séance d'entraînement"
            />
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
            <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Type</label>
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
              value={sessionForm.durée}
              onChange={(e) => setSessionForm({ ...sessionForm, durée: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
              placeholder="60"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Description / Notes (optionnel)</label>
            <textarea
              value={sessionForm.description}
              onChange={(e) => setSessionForm({ ...sessionForm, description: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00F65C] min-h-[100px] resize-none"
              placeholder="Ex: Séance intense avec intervalles courts..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleDeleteClick}
              className="flex-1 bg-red-500 text-white py-4 rounded-xl hover:bg-red-600 transition-all text-base font-medium shadow-lg"
            >
              Supprimer
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-[#00F65C] to-[#C1FB00] text-[#292929] py-4 rounded-xl hover:opacity-90 transition-all text-base font-medium shadow-lg"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Supprimer la séance"
        message="Êtes-vous sûr de vouloir supprimer cette séance ? Cette action est irréversible."
        confirmText="Supprimer"
        isDangerous={true}
      />
    </div>
  );
}