import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserGoal, SportType } from '../types';
import { ChevronRight, Plus, X } from 'lucide-react';

interface ProfileSetupPageProps {
  onComplete: () => void;
}

export default function ProfileSetupPage({ onComplete }: ProfileSetupPageProps) {
  const { setUserProfile, isDarkMode } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    goals: [] as UserGoal[],
    sports: [] as SportType[],
    customSports: [] as string[],
    customSportInput: '',
    trainingHoursPerWeek: '',
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

  const handleSubmit = () => {
    // Calculate nutrition goals based on weight and activity level
    const weight = parseInt(formData.weight);
    const proteins = Math.round(weight * 1.6); // 1.6g per kg for athletes
    const carbs = Math.round(weight * 5); // 5g per kg for endurance athletes
    const fats = Math.round(weight * 1); // 1g per kg

    setUserProfile({
      name: formData.name,
      age: parseInt(formData.age),
      weight: parseInt(formData.weight),
      height: parseInt(formData.height),
      goals: formData.goals,
      sports: formData.sports,
      customSports: formData.customSports,
      trainingHoursPerWeek: parseFloat(formData.trainingHoursPerWeek),
      nutritionGoals: {
        proteins,
        carbs,
        fats,
      },
    });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00F65C]/10 via-[#C1FB00]/10 to-[#F57BFF]/10 dark:from-[#00F65C]/5 dark:via-[#C1FB00]/5 dark:to-[#F57BFF]/5 dark:bg-gray-950 p-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 mx-1 rounded-full transition-colors ${
                  s <= step ? 'bg-gradient-to-r from-[#00F65C] to-[#C1FB00]' : 'bg-gray-200 dark:bg-gray-800'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">Étape {step} sur 4</p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 border border-gray-100 dark:border-gray-800">
          {step === 1 && (
            <div>
              <h2 className="text-xl mb-5 text-gray-900 dark:text-white">Informations personnelles</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1.5 text-sm text-gray-700 dark:text-gray-300">Prénom</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
                    placeholder="Votre prénom"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1.5 text-sm text-gray-700 dark:text-gray-300">Âge</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm text-gray-700 dark:text-gray-300">Poids (kg)</label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
                      placeholder="70"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1.5 text-sm text-gray-700 dark:text-gray-300">Taille (cm)</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
                    placeholder="175"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl mb-2 text-gray-900 dark:text-white">Quels sont vos objectifs ?</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Vous pouvez en sélectionner plusieurs</p>
              <div className="space-y-2.5">
                {goals.map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => toggleGoal(goal.value)}
                    className={`w-full p-3.5 rounded-xl text-left transition-all flex items-center justify-between text-sm ${
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
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl mb-2 text-gray-900 dark:text-white">Vos sports</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Sélectionnez tous vos sports</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {sports.map((sport) => (
                  <button
                    key={sport.value}
                    onClick={() => toggleSport(sport.value)}
                    className={`p-4 rounded-xl transition-all text-center ${
                      formData.sports.includes(sport.value)
                        ? 'bg-gradient-to-br from-[#00F65C]/20 to-[#C1FB00]/20 border-2 border-[#00F65C]'
                        : 'bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <div className="text-3xl mb-1.5">{sport.icon}</div>
                    <div className="text-sm text-gray-900 dark:text-white">{sport.label}</div>
                  </button>
                ))}
              </div>
              
              {/* Custom Sports */}
              <div className="mt-5 pt-5 border-t border-gray-200 dark:border-gray-800">
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
          )}

          {step === 4 && (
            <div>
              <h2 className="text-xl mb-5 text-gray-900 dark:text-white">Fréquence d'entraînement</h2>
              <div>
                <label className="block mb-1.5 text-sm text-gray-700 dark:text-gray-300">
                  Nombre d'heures de sport par semaine
                </label>
                <input
                  type="number"
                  value={formData.trainingHoursPerWeek}
                  onChange={(e) => setFormData({ ...formData, trainingHoursPerWeek: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00F65C]"
                  placeholder="5"
                  min="1"
                  max="50"
                  step="0.5"
                />
              </div>
              <div className="mt-5 p-3.5 bg-gradient-to-r from-[#00F65C]/10 to-[#C1FB00]/10 rounded-xl">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Nous allons calculer vos besoins nutritionnels en fonction de votre profil et de votre activité sportive.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-5 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white text-sm font-medium"
              >
                Retour
              </button>
            )}
            <button
              onClick={() => {
                if (step < 4) {
                  setStep(step + 1);
                } else {
                  handleSubmit();
                }
              }}
              disabled={
                (step === 1 && (!formData.name || !formData.age || !formData.weight || !formData.height)) ||
                (step === 2 && formData.goals.length === 0) ||
                (step === 3 && formData.sports.length === 0 && formData.customSports.length === 0) ||
                (step === 4 && !formData.trainingHoursPerWeek)
              }
              className="flex-1 bg-gradient-to-r from-[#00F65C] via-[#C1FB00] to-[#F57BFF] text-[#292929] py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {step < 4 ? 'Continuer' : 'Terminer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}