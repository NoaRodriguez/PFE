import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Pencil, Lightbulb, X, Clock, Activity, AlignLeft, Calendar as CalendarIcon, Trophy, MapPin, Scale } from 'lucide-react'; // Ajout icônes
import { motion, AnimatePresence } from 'framer-motion';
import { TrainingSession, Competition } from '../types';
import VisualCalendar from '../components/VisualCalendar';
import PageHeader from '../components/PageHeader';

interface CalendarPageProps {
  onNavigate: (page: string) => void;
}

export default function CalendarPage({ onNavigate }: CalendarPageProps) {
  const { sessions, competitions } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const isSameDay = (date1: Date | string, date2: Date | string) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const selectedDaySessions = sessions.filter(s => isSameDay(s.date, selectedDate));
  const selectedDayCompetitions = competitions.filter(c => isSameDay(c.date, selectedDate));

  // Fonction utilitaire pour la navigation
  const getFormattedDate = () => {
    const offset = selectedDate.getTimezoneOffset();
    const date = new Date(selectedDate.getTime() - (offset * 60 * 1000));
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="pb-24 px-4 max-w-md mx-auto min-h-screen bg-gray-50 dark:bg-gray-950">
      
      <PageHeader 
        title="Calendrier" 
        subtitle="Planifiez vos séances et compétitions"
      />

      <div className="mb-6">
        <VisualCalendar 
          sessions={sessions} 
          competitions={competitions} 
          selectedDate={selectedDate}
          onSelectDate={handleDateSelect}
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h2>
        </div>

        {selectedDaySessions.length === 0 && selectedDayCompetitions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Aucun événement prévu ce jour-là
          </p>
        ) : (
          <div className="space-y-3">
            {/* Compétitions */}
            {selectedDayCompetitions.map((competition) => (
              <div 
                key={competition.id}
                // MODIF : Le clic ouvre la modale de détail
                onClick={() => setSelectedCompetition(competition)}
                className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
              >
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{competition.nom}</h3>
                  <p className="text-sm text-[#F57BFF] capitalize">{competition.sport}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold bg-[#F57BFF]/10 text-[#F57BFF] px-2 py-1 rounded-full">
                    Compétition
                  </span>
                  {/* MODIF : Bouton Modifier actif avec stopPropagation */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(`edit-competition:${competition.id}:calendar`);
                    }}
                    className="p-2 text-gray-400 hover:text-[#F57BFF] transition-colors rounded-full hover:bg-[#F57BFF]/10"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Séances */}
            {selectedDaySessions.map((session) => (
              <div 
                key={session.id}
                // MODIF : Le clic ouvre la modale de détail maintenant
                onClick={() => setSelectedSession(session)}
                className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{session.titre}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{session.sport} • {session.type}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-gray-900 dark:text-white">{session.durée} min</p>
                    {/* MODIF : e.stopPropagation() pour que le crayon ne déclenche pas la modale */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(`edit-session:${session.id}:calendar`);
                      }}
                      className="p-2 text-gray-400 hover:text-[#00F65C] transition-colors rounded-full hover:bg-[#00F65C]/10"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* ENCADRÉ CONSEIL */}
                {session.conseil && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col gap-1.5">
                     <div className="flex items-center gap-2 mb-1 border-b border-gray-200 dark:border-gray-700 pb-1.5">
                        <div className="bg-yellow-400/20 p-1 rounded-md">
                            <Lightbulb className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <span className="text-[9px] font-bold uppercase text-gray-500 tracking-wider">Nutrition Performance</span>
                     </div>
                     <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-xs">
                        <span className="font-bold text-[#00F65C]">Avant:</span> 
                        <span className="text-gray-700 dark:text-gray-300 leading-snug">{session.conseil.avant}</span>
                        
                        <span className="font-bold text-[#C1FB00]">Pendant:</span> 
                        <span className="text-gray-700 dark:text-gray-300 leading-snug">{session.conseil.pendant}</span>
                        
                        <span className="font-bold text-[#F57BFF]">Après:</span> 
                        <span className="text-gray-700 dark:text-gray-300 leading-snug">{session.conseil.apres}</span>
                     </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-4">
          {/* MODIF ICI : On utilise getFormattedDate() dans le lien de navigation */}
          <button
            onClick={() => onNavigate(`add-session:${getFormattedDate()}`)}
            className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-[#00F65C] to-[#C1FB00] rounded-2xl text-[#292929] font-bold shadow-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" /> Séance
          </button>
          
          <button
            onClick={() => onNavigate(`add-competition:${getFormattedDate()}`)}
            className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-[#C1FB00] to-[#F57BFF] rounded-2xl text-[#292929] font-bold shadow-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" /> Compétition
          </button>
        </div>
      </div>

      {/* MODALE DÉTAIL SÉANCE */}
      <AnimatePresence>
        {selectedSession && (
          <motion.div 
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col overflow-hidden"
          >
             {/* Header Modale */}
             <div className="relative p-6 pt-8 flex items-center justify-between border-b border-gray-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate pr-4">
                  {selectedSession.titre}
                </h2>
                <button 
                  onClick={() => setSelectedSession(null)}
                  className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
             </div>

             {/* Contenu Scrollable */}
             <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-6">
                
                {/* Infos Clés */}
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                   <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 whitespace-nowrap">
                      <Activity className="w-4 h-4 text-[#00F65C]" />
                      <span className="font-medium text-sm capitalize">{selectedSession.sport}</span>
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 whitespace-nowrap">
                      <Clock className="w-4 h-4 text-[#00F65C]" />
                      <span className="font-medium text-sm">{selectedSession.durée} min</span>
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 whitespace-nowrap">
                      <span className="text-[#00F65C] font-bold text-sm">RPE {selectedSession.intensité}/3</span>
                   </div>
                </div>

                {/* Description */}
                {selectedSession.description && (
                  <div className="bg-gray-50 dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800">
                     <h3 className="flex items-center gap-2 text-sm font-bold uppercase text-gray-400 mb-3 tracking-wider">
                        <AlignLeft className="w-4 h-4" /> Notes de séance
                     </h3>
                     <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedSession.description}
                     </p>
                  </div>
                )}

                {/* --- LE CONSEIL (EN GROS) --- */}
                {selectedSession.conseil ? (
                  <div className="space-y-4">
                     <div className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-[#C1FB00]" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Stratégie Nutrition</h3>
                     </div>

                     <div className="grid gap-4">
                        <div className="p-5 bg-gradient-to-br from-[#00F65C]/10 to-[#00F65C]/5 rounded-2xl border border-[#00F65C]/20">
                           <span className="text-xs font-bold text-[#00F65C] uppercase tracking-widest mb-1 block">Avant</span>
                           <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                              {selectedSession.conseil.avant}
                           </p>
                        </div>

                        <div className="p-5 bg-gradient-to-br from-[#C1FB00]/10 to-[#C1FB00]/5 rounded-2xl border border-[#C1FB00]/20">
                           <span className="text-xs font-bold text-[#aacc00] dark:text-[#C1FB00] uppercase tracking-widest mb-1 block">Pendant</span>
                           <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                              {selectedSession.conseil.pendant}
                           </p>
                        </div>

                        <div className="p-5 bg-gradient-to-br from-[#F57BFF]/10 to-[#F57BFF]/5 rounded-2xl border border-[#F57BFF]/20">
                           <span className="text-xs font-bold text-[#F57BFF] uppercase tracking-widest mb-1 block">Après</span>
                           <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                              {selectedSession.conseil.apres}
                           </p>
                        </div>
                     </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500 bg-gray-50 dark:bg-slate-900 rounded-2xl border-dashed border border-gray-200 dark:border-slate-800">
                     Pas de conseil spécifique généré pour cette séance.
                  </div>
                )}
             </div>

             {/* Footer avec Bouton Modifier */}
             <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 pb-8">
                <button
                  onClick={() => {
                     onNavigate(`edit-session:${selectedSession.id}:calendar`);
                     setSelectedSession(null);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 active:scale-95 transition-transform"
                >
                   <Pencil className="w-4 h-4" /> Modifier la séance
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODALE DÉTAIL COMPÉTITION */}
      <AnimatePresence>
        {selectedCompetition && (
          <motion.div 
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col overflow-hidden"
          >
             {/* Header */}
             <div className="relative p-6 pt-8 flex items-center justify-between border-b border-gray-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate pr-4">
                  {selectedCompetition.nom}
                </h2>
                <button 
                  onClick={() => setSelectedCompetition(null)}
                  className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
             </div>

             {/* Contenu */}
             <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-6">
                <div className="flex flex-wrap gap-3 pb-2">
                   <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
                      <Trophy className="w-4 h-4 text-[#F57BFF]" />
                      <span className="font-medium text-sm capitalize">{selectedCompetition.sport}</span>
                   </div>
                   {selectedCompetition.distance > 0 && (
                     <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
                        <MapPin className="w-4 h-4 text-[#F57BFF]" />
                        <span className="font-medium text-sm">{selectedCompetition.distance} km</span>
                     </div>
                   )}
                   <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
                      <span className="text-gray-500 text-sm">Priorité</span>
                      <span className="text-[#F57BFF] font-bold text-sm">
                        {['C', 'B', 'A', 'A+'][selectedCompetition.intensité || 0]}
                      </span>
                   </div>
                </div>

                {/* Description / Objectif temps */}
                <div className="bg-gray-50 dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-4">
                   {selectedCompetition.durée && selectedCompetition.durée > 0 && (
                     <div>
                        <h3 className="flex items-center gap-2 text-sm font-bold uppercase text-gray-400 mb-1 tracking-wider">
                           <Clock className="w-4 h-4" /> Objectif Temps
                        </h3>
                        <p className="text-gray-900 dark:text-white font-bold text-lg">
                           {selectedCompetition.durée} min
                        </p>
                     </div>
                   )}
                   
                   {selectedCompetition.description && (
                     <div>
                        <h3 className="flex items-center gap-2 text-sm font-bold uppercase text-gray-400 mb-2 tracking-wider">
                           <AlignLeft className="w-4 h-4" /> Notes
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                           {selectedCompetition.description}
                        </p>
                     </div>
                   )}
                   
                   {!selectedCompetition.durée && !selectedCompetition.description && (
                      <p className="text-gray-500 text-sm italic">Aucune note supplémentaire.</p>
                   )}
                </div>
             </div>

             {/* Footer */}
             <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 pb-8">
                <button
                  onClick={() => {
                     onNavigate(`edit-competition:${selectedCompetition.id}:calendar`);
                     setSelectedCompetition(null);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 active:scale-95 transition-transform"
                >
                   <Pencil className="w-4 h-4" /> Modifier la compétition
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}