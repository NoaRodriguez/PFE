import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
// Ajout des icônes Utensils (pour le titre), Dumbbell, Zap, Shield (pour les macros)
import { User, Activity, Target, ChevronRight, Utensils, Dumbbell, Zap, Shield } from 'lucide-react';
import { UserGoal, SportType, Gender } from '../types';
import PageHeader from '../components/PageHeader';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

export default function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { userProfile, setUserProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);

  // Helper to calc age
  const calculateAge = (dateString?: string): number => {
    if (!dateString) return 0;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const currentAge = calculateAge(userProfile?.date_naissance);

  // On initialise les données du formulaire avec le profil existant
  const [formData, setFormData] = useState({
    prenom: userProfile?.prenom || '',
    date_naissance: userProfile?.date_naissance || '',
    gender: userProfile?.gender || 'male' as Gender,
    poids: userProfile?.poids.toString() || '',
    taille: userProfile?.taille.toString() || '',
    objectifs: userProfile?.objectifs || [] as UserGoal[],
    sports: userProfile?.sports || [] as SportType[],
    frequence_entrainement: userProfile?.frequence_entrainement || '',
  });

  // Sync state when profile loads (e.g. refresh)
  useEffect(() => {
    if (userProfile) {
      setFormData({
        prenom: userProfile.prenom || '',
        date_naissance: userProfile.date_naissance || '',
        gender: userProfile.gender || 'male',
        poids: userProfile.poids.toString() || '',
        taille: userProfile.taille.toString() || '',
        objectifs: userProfile.objectifs || [],
        sports: userProfile.sports || [],
        frequence_entrainement: userProfile.frequence_entrainement || '',
      });
    }
  }, [userProfile]);

  const goals = [
    { value: 'reprise' as UserGoal, label: 'Reprendre le sport' },
    { value: 'hygiene' as UserGoal, label: 'Avoir une bonne hygiène de vie' },
    { value: 'competition' as UserGoal, label: 'Préparer une compétition' },
    { value: 'performance' as UserGoal, label: 'Améliorer mes perfs' },
    { value: 'perte-poids' as UserGoal, label: 'Perte de poids' },
  ];

  const sports = [
    { value: 'course' as SportType, label: 'Course à pied', icon: '🏃‍♂️' },
    { value: 'velo' as SportType, label: 'Cyclisme', icon: '🚴‍♂️' },
    { value: 'natation' as SportType, label: 'Natation', icon: '🏊‍♂️' },
    { value: 'trail' as SportType, label: 'Trail', icon: '⛰️' },
    { value: 'triathlon' as SportType, label: 'Triathlon', icon: '🏅' },
    { value: 'autre' as SportType, label: 'Autre', icon: '⚡' },
  ];

  const toggleGoal = (goal: UserGoal) => {
    setFormData(prev => ({
      ...prev,
      objectifs: prev.objectifs.includes(goal)
        ? prev.objectifs.filter(g => g !== goal)
        : [...prev.objectifs, goal]
    }));
  };

  const toggleSport = (sport: SportType) => {
    setFormData(prev => ({
      ...prev,
      sports: prev.sports.includes(sport)
        ? prev.sports.filter(s => s !== sport)
        : [...prev.sports, sport]
    }));
  };

  const handleSave = async () => {
    if (!userProfile) return;

    const poidsNum = parseFloat(formData.poids) || 0;

    try {
      await setUserProfile({
        ...userProfile,
        prenom: formData.prenom,
        date_naissance: formData.date_naissance,
        gender: formData.gender,
        poids: poidsNum,
        taille: parseFloat(formData.taille) || 0,
        objectifs: formData.objectifs,
        sports: formData.sports,
        frequence_entrainement: formData.frequence_entrainement,
        customSports: [],
        nutritionGoals: {
          proteines: 0, // Handled by AppContext
          glucides: 0,
          lipides: 0,
        },
      });
      setIsEditing(false);
    } catch (error: any) {
      console.error('Failed to save profile:', error);
      alert(`Erreur lors de la sauvegarde: ${error?.message || JSON.stringify(error)}`);
    }
  };

  const getGoalLabel = (goal: UserGoal) => {
    return goals.find((g) => g.value === goal)?.label || goal;
  };

  const getSportLabel = (sport: SportType) => {
    return sports.find((s) => s.value === sport)?.label || sport;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-24">
      <PageHeader
        title="Mon Profil"
        subtitle="Mes informations"
        editMode={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
      />

      <div className="max-w-md mx-auto p-4">
        {!isEditing ? (
          /* --- MODE LECTURE --- */
          <div className="space-y-4">
            {/* Infos Perso */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00F65C]/20 to-[#C1FB00]/20 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-[#00F65C]" />
                </div>
                <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Informations personnelles</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Prénom</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{userProfile?.prenom}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Genre</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {userProfile?.gender === 'female' ? 'Femme' : 'Homme'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Âge</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{currentAge} ans</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Poids</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{userProfile?.poids} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Taille</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{userProfile?.taille} cm</span>
                </div>
              </div>
            </div>

            {/* Activité Sportive */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#C1FB00]/20 to-[#F57BFF]/20 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-[#C1FB00]" />
                </div>
                <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Activité sportive</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Mes sports</span>
                  <div className="flex flex-wrap gap-2">
                    {userProfile?.sports.map((sport, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-gradient-to-r from-[#00F65C]/10 to-[#C1FB00]/10 rounded-lg text-sm text-gray-900 dark:text-white">
                        {getSportLabel(sport)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Volume hebdo (moyen)</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{userProfile?.frequence_entrainement}h / semaine</span>
                </div>
              </div>
            </div>

            {/* Objectifs */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#F57BFF]/20 to-[#00F65C]/20 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#F57BFF]" />
                </div>
                <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Mes objectifs</h2>
              </div>
              <div className="space-y-2">
                {userProfile?.objectifs.map((goal, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-sm text-gray-900 dark:text-white">{getGoalLabel(goal)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* NOUVELLE SECTION : Objectifs Nutritionnels (Même style que Dashboard) */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                {/* Icône d'en-tête pour la nutrition */}
                <div className="w-10 h-10 bg-gradient-to-br from-[#00F65C]/20 to-[#C1FB00]/20 rounded-xl flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-[#00F65C]" />
                </div>
                <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Objectifs Nutritionnels</h2>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                 {/* Carte Protéines */}
                 <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-1.5">
                    <Dumbbell className="w-5 h-5 text-[#00F65C]" />
                    <div className="text-center">
                       <span className="block text-xl font-bold text-gray-900 dark:text-white">
                          {userProfile?.nutritionGoals.proteines || 0}g
                       </span>
                       <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">Protéines</span>
                    </div>
                 </div>

                 {/* Carte Glucides */}
                 <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-1.5">
                    <Zap className="w-5 h-5 text-[#C1FB00]" />
                    <div className="text-center">
                       <span className="block text-xl font-bold text-gray-900 dark:text-white">
                          {userProfile?.nutritionGoals.glucides || 0}g
                       </span>
                       <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">Glucides</span>
                    </div>
                 </div>

                 {/* Carte Lipides */}
                 <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-1.5">
                    <Shield className="w-5 h-5 text-[#F57BFF]" />
                    <div className="text-center">
                       <span className="block text-xl font-bold text-gray-900 dark:text-white">
                          {userProfile?.nutritionGoals.lipides || 0}g
                       </span>
                       <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">Lipides</span>
                    </div>
                 </div>
              </div>
            </div>

          </div>
        ) : (
          /* --- MODE ÉDITION --- */
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-800">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Informations personnelles</h2>
              <p className="text-xs text-gray-400 mb-4 italic">Vous pourrez modifier ces informations plus tard.</p>

              <div className="space-y-4">
                <div>
                  <label className="block mb-1.5 text-sm text-gray-700 dark:text-gray-300">Prénom</label>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
                  />
                </div>

                {/* Sélecteur Genre */}
                <div>
                  <label className="block mb-1.5 text-sm text-gray-700 dark:text-gray-300">Genre</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: 'male' })}
                      className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium ${formData.gender === 'male'
                        ? 'border-[#00F65C] bg-[#00F65C]/10 text-gray-900 dark:text-white'
                        : 'border-transparent bg-gray-50 dark:bg-gray-800 text-gray-500'
                        }`}
                    >
                      Homme
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: 'female' })}
                      className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium ${formData.gender === 'female'
                        ? 'border-[#00F65C] bg-[#00F65C]/10 text-gray-900 dark:text-white'
                        : 'border-transparent bg-gray-50 dark:bg-gray-800 text-gray-500'
                        }`}
                    >
                      Femme
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1.5 text-sm text-gray-700 dark:text-gray-300">Date de naissance</label>
                    <input
                      type="date"
                      value={formData.date_naissance}
                      onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm text-gray-700 dark:text-gray-300">Poids (kg)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.poids}
                      onChange={(e) => setFormData({ ...formData, poids: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1.5 text-sm text-gray-700 dark:text-gray-300">Taille (cm)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.taille}
                    onChange={(e) => setFormData({ ...formData, taille: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-sm text-gray-700 dark:text-gray-300">Heures sport / semaine (moyenne)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.frequence_entrainement}
                    onChange={(e) => setFormData({ ...formData, frequence_entrainement: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
                  />
                </div>
              </div>
            </div>

            {/* Edit Goals */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-800">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Mes objectifs</h2>
              <div className="space-y-2">
                {goals.map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => toggleGoal(goal.value)}
                    className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between text-sm ${formData.objectifs.includes(goal.value)
                      ? 'bg-gradient-to-r from-[#00F65C]/20 to-[#C1FB00]/20 border-2 border-[#00F65C] text-gray-900 dark:text-white'
                      : 'bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-700 text-gray-900 dark:text-white'
                      }`}
                  >
                    <span>{goal.label}</span>
                    {formData.objectifs.includes(goal.value) && <ChevronRight className="text-[#00F65C] w-5 h-5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Edit Sports */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-800">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Mes sports</h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {sports.map((sport) => (
                  <button
                    key={sport.value}
                    onClick={() => toggleSport(sport.value)}
                    className={`p-3.5 rounded-xl transition-all text-center ${formData.sports.includes(sport.value)
                      ? 'bg-gradient-to-br from-[#00F65C]/20 to-[#C1FB00]/20 border-2 border-[#00F65C]'
                      : 'bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-700'
                      }`}
                  >
                    <div className="text-2xl mb-1">{sport.icon}</div>
                    <div className="text-xs text-gray-900 dark:text-white">{sport.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}