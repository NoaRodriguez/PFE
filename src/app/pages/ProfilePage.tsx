import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Pencil, Check, User, Activity, Target, Plus, X, ChevronRight } from 'lucide-react';
import { UserGoal, SportType } from '../types';
import PageHeader from '../components/PageHeader';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

export default function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { userProfile, setUserProfile, isDarkMode } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    age: userProfile?.age.toString() || '',
    weight: userProfile?.weight.toString() || '',
    height: userProfile?.height.toString() || '',
    goals: userProfile?.goals || [] as UserGoal[],
    sports: userProfile?.sports || [] as SportType[],
    customSports: userProfile?.customSports || [] as string[],
    customSportInput: '',
    trainingHoursPerWeek: userProfile?.trainingHoursPerWeek?.toString() || '',
  });

  const goals = [
    { value: 'reprise' as UserGoal, label: 'Reprendre le sport' },
    { value: 'hygiene' as UserGoal, label: 'Avoir une bonne hygiène de vie' },
    { value: 'competition' as UserGoal, label: 'Préparer une compétition' },
    { value: 'sante' as UserGoal, label: 'Rester en bonne santé' },
    { value: 'perte-poids' as UserGoal, label: 'Perte de poids' },
  ];

  const sports = [
    { value: 'course' as SportType, label: 'Course à pied', icon: '🏃' },
    { value: 'velo' as SportType, label: 'Vélo', icon: '🚴' },
    { value: 'natation' as SportType, label: 'Natation', icon: '🏊' },
    { value: 'trail' as SportType, label: 'Trail', icon: '⛰️' },
    { value: 'triathlon' as SportType, label: 'Triathlon', icon: '🏅' },
  ];

  const toggleGoal = (goal: UserGoal) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
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

  const addCustomSport = () => {
    if (formData.customSportInput.trim()) {
      setFormData(prev => ({
        ...prev,
        customSports: [...prev.customSports, prev.customSportInput.trim()],
        customSportInput: ''
      }));
    }
  };

  const removeCustomSport = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customSports: prev.customSports.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    if (!userProfile) return;

    const weight = parseInt(formData.weight);
    const proteins = Math.round(weight * 1.6);
    const carbs = Math.round(weight * 5);
    const fats = Math.round(weight * 1);

    setUserProfile({
      name: formData.name,
      age: parseInt(formData.age),
      weight: parseInt(formData.weight),
      height: parseInt(formData.height),
      goals: formData.goals,
      sports: formData.sports,
      customSports: formData.customSports,
      trainingHoursPerWeek: parseInt(formData.trainingHoursPerWeek),
      nutritionGoals: {
        proteins,
        carbs,
        fats,
      },
    });
    setIsEditing(false);
  };

  const getGoalLabel = (goal: UserGoal) => {
    return goals.find((g) => g.value === goal)?.label || goal;
  };

  const getSportLabel = (sport: SportType) => {
    return sports.find((s) => s.value === sport)?.label || sport;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-24">
      {/* Header */}
      <PageHeader
        title="Mon Profil"
        subtitle="Mes informations"
        editMode={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
      />

      <div className="max-w-md mx-auto p-4">
        {!isEditing ? (
          <div className="space-y-4">
            {/* Personal Info */}
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
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{userProfile?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Âge</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{userProfile?.age} ans</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Poids</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{userProfile?.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Taille</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{userProfile?.height} cm</span>
                </div>
              </div>
            </div>

            {/* Sports Info */}
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
                    {userProfile?.customSports.map((sport, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-gradient-to-r from-[#00F65C]/10 to-[#C1FB00]/10 rounded-lg text-sm text-gray-900 dark:text-white">
                        {sport}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Fréquence</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{userProfile?.trainingHoursPerWeek} heures / semaine</span>
                </div>
              </div>
            </div>

            {/* Goals */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#F57BFF]/20 to-[#00F65C]/20 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#F57BFF]" />
                </div>
                <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Mes objectifs</h2>
              </div>
              <div className="space-y-2">
                {userProfile?.goals.map((goal, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-sm text-gray-900 dark:text-white">{getGoalLabel(goal)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrition Goals */}
            <div className="bg-gradient-to-br from-[#00F65C]/10 via-[#C1FB00]/10 to-[#F57BFF]/10 rounded-2xl p-5 border border-[#00F65C]/20">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Objectifs nutritionnels</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="w-14 h-14 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-2 shadow">
                    <span className="text-lg font-bold text-[#F57BFF]">{userProfile?.nutritionGoals.proteins}g</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Protéines</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-2 shadow">
                    <span className="text-lg font-bold text-[#00F65C]">{userProfile?.nutritionGoals.carbs}g</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Glucides</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-2 shadow">
                    <span className="text-lg font-bold text-[#C1FB00]">{userProfile?.nutritionGoals.fats}g</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Lipides</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Edit Form - Personal Info */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-800">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Informations personnelles</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1.5 text-sm text-gray-700 dark:text-gray-300">Prénom</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1.5 text-sm text-gray-700 dark:text-gray-300">Âge</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm text-gray-700 dark:text-gray-300">Poids (kg)</label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1.5 text-sm text-gray-700 dark:text-gray-300">Taille (cm)</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-sm text-gray-700 dark:text-gray-300">Fréquence (heures / semaine)</label>
                  <input
                    type="number"
                    value={formData.trainingHoursPerWeek}
                    onChange={(e) => setFormData({ ...formData, trainingHoursPerWeek: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
                  />
                </div>
              </div>
            </div>

            {/* Edit Form - Goals */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-800">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Mes objectifs</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Sélectionnez vos objectifs</p>
              <div className="space-y-2">
                {goals.map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => toggleGoal(goal.value)}
                    className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between text-sm ${
                      formData.goals.includes(goal.value)
                        ? 'bg-gradient-to-r from-[#00F65C]/20 to-[#C1FB00]/20 border-2 border-[#00F65C] text-gray-900 dark:text-white'
                        : 'bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <span>{goal.label}</span>
                    {formData.goals.includes(goal.value) && <ChevronRight className="text-[#00F65C] w-5 h-5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Edit Form - Sports */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-800">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Mes sports</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Sélectionnez vos sports</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {sports.map((sport) => (
                  <button
                    key={sport.value}
                    onClick={() => toggleSport(sport.value)}
                    className={`p-3.5 rounded-xl transition-all text-center ${
                      formData.sports.includes(sport.value)
                        ? 'bg-gradient-to-br from-[#00F65C]/20 to-[#C1FB00]/20 border-2 border-[#00F65C]'
                        : 'bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <div className="text-2xl mb-1">{sport.icon}</div>
                    <div className="text-xs text-gray-900 dark:text-white">{sport.label}</div>
                  </button>
                ))}
              </div>

              {/* Custom Sports */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Ajouter un autre sport</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.customSportInput}
                    onChange={(e) => setFormData({ ...formData, customSportInput: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomSport()}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00F65C] text-sm"
                    placeholder="Ex: Escalade, Yoga..."
                  />
                  <button
                    onClick={addCustomSport}
                    className="p-2.5 bg-gradient-to-r from-[#00F65C] to-[#C1FB00] text-[#292929] rounded-xl hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Custom Sports List */}
                {formData.customSports.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.customSports.map((sport, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2.5 bg-gradient-to-r from-[#00F65C]/10 to-[#C1FB00]/10 rounded-xl"
                      >
                        <span className="text-sm text-gray-900 dark:text-white">{sport}</span>
                        <button
                          onClick={() => removeCustomSport(index)}
                          className="p-1 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}