import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Clock, AlignLeft, Calendar as CalendarIcon, Activity, Trash2, Save, Info } from 'lucide-react';
import { SportType, SessionType } from '../types';
import ConfirmModal from '../components/ConfirmModal';

interface EditSessionPageProps {
  onNavigate: (page: string) => void;
  sessionId: string | number;
}

export default function EditSessionPage({ onNavigate, sessionId }: EditSessionPageProps) {
  const { sessions, updateSession, deleteSession } = useApp();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTypeTooltip, setShowTypeTooltip] = useState(false);
  
  const idsMatch = (id1: string | number, id2: string | number) => {
    return String(id1) === String(id2);
  };

  const session = sessions.find((s) => idsMatch(s.id, sessionId));

  const [date, setDate] = useState('');
  const [titre, setTitre] = useState('');
  const [sport, setSport] = useState<SportType>('course');
  const [durée, setDurée] = useState('');
  const [type, setType] = useState<SessionType>('endurance');
  const [description, setDescription] = useState('');
  const [période_journée, setPeriodeJournee] = useState('');
  const [intensité, setIntensité] = useState('0');

  useEffect(() => {
    if (session) {
      setDate(new Date(session.date).toISOString().split('T')[0]);
      setTitre(session.titre);
      setSport(session.sport);
      setDurée(session.durée.toString());
      setType(session.type);
      setDescription(session.description || '');
      setPeriodeJournee(session.période_journée || 'soir');
      setIntensité(session.intensité?.toString() || '0');
    }
  }, [session]);

  const sessionTypes = [
    { value: 'recuperation', label: 'Récupération' },
    { value: 'endurance', label: 'Endurance' },
    { value: 'tempo', label: 'Rythme / Tempo' },
    { value: 'frac', label: 'Fractionné' },
    { value: 'specific', label: 'Spécifique' },
  ];

  if (!session) {
    return <div className="p-4 text-center">Séance introuvable</div>;
  }

  const handleSave = async () => {
    if (!session) return;
    if (!titre || !durée) {
       alert("Veuillez remplir le titre et la durée.");
       return;
    }
    
    try {
      await updateSession({
        ...session,
        date: new Date(date),
        titre,
        sport,
        durée: parseInt(durée) || 0,
        type,
        description,
        période_journée,
        intensité: parseInt(intensité) || 0,
      });
      onNavigate('calendar');
    } catch (error) {
      console.error("Erreur update:", error);
      alert("Erreur lors de la modification");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSession(sessionId);
      onNavigate('calendar');
    } catch (error) {
      console.error("Erreur delete:", error);
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-32">
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => onNavigate('calendar')}
            className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
          <h1 className="font-bold text-lg text-gray-900 dark:text-white">Modifier la séance</h1>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 -mr-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Titre */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Titre</label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#00F65C] outline-none text-gray-900 dark:text-white"
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
             className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#00F65C] outline-none text-gray-900 dark:text-white"
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
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#00F65C] outline-none appearance-none text-gray-900 dark:text-white"
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
                 <button type="button" onClick={() => setShowTypeTooltip(!showTypeTooltip)}>
                   <Info className="w-4 h-4 text-gray-400" />
                 </button>
             </div>
             {showTypeTooltip && (
                <div className="absolute right-0 bottom-full mb-2 w-64 p-3 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 text-gray-600 dark:text-gray-300">
                  <p><strong>Endurance:</strong> Effort continu modéré.</p>
                  <p><strong>Fractionné:</strong> Intense alterné.</p>
                  <p><strong>Tempo:</strong> Rythme soutenu.</p>
                </div>
              )}
             <select
              value={type}
              onChange={(e) => setType(e.target.value as SessionType)}
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#00F65C] outline-none appearance-none text-gray-900 dark:text-white"
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
              <span>Intensité</span>
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
              {/* AJOUTÉ ICI : Les labels manquants */}
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
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#00F65C] outline-none text-gray-900 dark:text-white"
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
              rows={4}
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#00F65C] outline-none text-gray-900 dark:text-white resize-none"
            />
        </div>

        <button
          onClick={handleSave}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00F65C] to-[#C1FB00] text-[#292929] font-bold shadow-lg flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" /> Enregistrer les modifications
        </button>
      </div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Supprimer la séance"
        message="Etes-vous sur de vouloir supprimer cette seance ? Cette action est irréversible."
      />
    </div>
  );
}