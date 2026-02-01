import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Trash2, Save, Clock, AlignLeft, Activity } from 'lucide-react';
import { SportType, SessionType } from '../types';
import ConfirmModal from '../components/ConfirmModal';

// AJOUT DE returnTo
interface EditSessionPageProps {
  sessionId: string;
  onNavigate: (page: string) => void;
  returnTo?: string; 
}

export default function EditSessionPage({ sessionId, onNavigate, returnTo }: EditSessionPageProps) {
  const { sessions, updateSession, deleteSession } = useApp();
  const session = sessions.find(s => String(s.id) === sessionId);

  const [isDeleting, setIsDeleting] = useState(false);
  
  // États locaux (inchangés)
  const [titre, setTitre] = useState(session?.titre || '');
  const [durée, setDurée] = useState(session?.durée.toString() || '');
  const [description, setDescription] = useState(session?.description || '');
  const [sport, setSport] = useState<SportType>(session?.sport || 'course');
  const [type, setType] = useState<SessionType>(session?.type || 'endurance');
  const [intensité, setIntensité] = useState(session?.intensité?.toString() || '0');
  const formatDateLocal = (dateInput: Date | string) => {
    const d = new Date(dateInput);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState(
    session?.date 
      ? formatDateLocal(session.date)
      : new Date().toISOString().split('T')[0]
  );

  if (!session) {
    return <div className="p-4 text-center">Séance introuvable</div>;
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
    await updateSession({
      ...session,
      titre,
      durée: parseInt(durée) || 0,
      description,
      sport,
      type,
      intensité: parseInt(intensité) || 0,
      date: new Date(date),
    });
    handleBack(); // On utilise le retour intelligent après sauvegarde
  };

  const handleDelete = async () => {
    await deleteSession(session.id);
    handleBack(); // On utilise le retour intelligent après suppression
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={handleBack} // MODIFIE
            className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
          <h1 className="font-bold text-lg text-gray-900 dark:text-white">Modifier la séance</h1>
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
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Titre</label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#00F65C] outline-none transition-all text-gray-900 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#00F65C] outline-none transition-all text-gray-900 dark:text-white"
          />
        </div>

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
                <option value="recuperation">Récupération</option>
                <option value="endurance">Endurance</option>
                <option value="tempo">Rythme / Tempo</option>
                <option value="frac">Fractionné</option>
                <option value="specific">Spécifique</option>
              </select>
           </div>
        </div>

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
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Durée (min)
          </label>
          <input
            type="number"
            value={durée}
            onChange={(e) => setDurée(e.target.value)}
            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#00F65C] outline-none transition-all text-gray-900 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <AlignLeft className="w-4 h-4" /> Notes
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#00F65C] outline-none transition-all text-gray-900 dark:text-white resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00F65C] to-[#C1FB00] text-[#292929] font-bold shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" /> Enregistrer les modifications
        </button>
      </div>

      <ConfirmModal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onConfirm={handleDelete}
        title="Supprimer la séance ?"
        message="Cette action est irréversible."
      />
    </div>
  );
}