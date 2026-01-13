import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserGoal, SportType, UserProfile, Gender } from '../types';
import { ChevronRight, ChevronLeft, Activity, Trophy, Heart, Flame, Timer, Check, User } from 'lucide-react';

export default function ProfileSetupPage() {
  const { setUserProfile, login } = useApp();
  const [step, setStep] = useState(1);
  
  // États du formulaire
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [birthDate, setBirthDate] = useState(''); 
  const [weight, setWeight] = useState<string>(''); 
  const [height, setHeight] = useState<string>('');
  
  const [selectedGoals, setSelectedGoals] = useState<UserGoal[]>([]);
  const [selectedSports, setSelectedSports] = useState<SportType[]>([]);
  const [trainingHours, setTrainingHours] = useState<string>('');

  const [isCalculating, setIsCalculating] = useState(false);

  // Helper pour empêcher les valeurs négatives
  const handlePositiveNumber = (
    value: string, 
    setter: (val: string) => void
  ) => {
    if (value === '' || (parseFloat(value) >= 0 && !isNaN(Number(value)))) {
      setter(value);
    }
  };

  const calculateAge = (dateString: string): number => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleNext = () => {
    if (step === 1 && (!name || !birthDate || !weight || !height)) return;
    if (step === 2 && selectedGoals.length === 0) return;
    if (step === 3 && selectedSports.length === 0) return;
    
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const toggleGoal = (goal: UserGoal) => {
    setSelectedGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const toggleSport = (sport: SportType) => {
    setSelectedSports(prev => 
      prev.includes(sport)
        ? prev.filter(s => s !== sport)
        : [...prev, sport]
    );
  };

  const finishSetup = () => {
    setIsCalculating(true);
    
    // Simulation de calcul intelligent...
    setTimeout(() => {
      const age = calculateAge(birthDate);
      const weightNum = parseFloat(weight);
      
      // Calcul basique des besoins
      const proteins = Math.round(weightNum * 1.8);
      const fats = Math.round(weightNum * 1.0);
      const carbs = Math.round(weightNum * 4);

      const profile: UserProfile = {
        name,
        age,
        gender,
        weight: weightNum,
        height: parseFloat(height),
        goals: selectedGoals,
        sports: selectedSports,
        customSports: [], 
        trainingHoursPerWeek: parseFloat(trainingHours) || 0,
        nutritionGoals: {
          proteins,
          carbs,
          fats
        }
      };

      setUserProfile(profile);
      login(profile);
    }, 2000);
  };

  // Écran de chargement "Calcul"
  if (isCalculating) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 relative mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-gray-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-[#00F65C] border-t-transparent animate-spin"></div>
          <Activity className="absolute inset-0 m-auto text-[#00F65C] w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Analyse de votre profil...
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs">
          Nous calculons vos besoins nutritionnels optimaux basés sur votre métabolisme et vos objectifs.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      {/* Progress Bar */}
      <div className="h-1.5 bg-gray-100 dark:bg-gray-900">
        <div 
          className="h-full bg-gradient-to-r from-[#00F65C] to-[#C1FB00] transition-all duration-500"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          {step > 1 ? (
            <button 
              onClick={handleBack}
              className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          ) : (
            <div />
          )}
          <span className="text-xs font-medium text-gray-400 dark:text-gray-600">
            ÉTAPE {step} SUR 4
          </span>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* STEP 1: INFORMATIONS PERSONNELLES */}
        {step === 1 && (
          <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Faisons connaissance
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Ces informations nous permettent de calculer votre métabolisme de base.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Votre prénom
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#C1FB00] outline-none transition-all font-medium text-gray-900 dark:text-white"
                  placeholder="Ex: Thomas"
                />
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Genre
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setGender('male')}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all font-medium ${
                      gender === 'male'
                        ? 'border-[#00F65C] bg-[#00F65C]/10 text-gray-900 dark:text-white'
                        : 'border-transparent bg-gray-50 dark:bg-gray-900 text-gray-500'
                    }`}
                  >
                    Homme
                  </button>
                  <button
                    onClick={() => setGender('female')}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all font-medium ${
                      gender === 'female'
                        ? 'border-[#00F65C] bg-[#00F65C]/10 text-gray-900 dark:text-white'
                        : 'border-transparent bg-gray-50 dark:bg-gray-900 text-gray-500'
                    }`}
                  >
                    Femme
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Date de naissance
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#C1FB00] outline-none transition-all font-medium text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Poids (kg)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={weight}
                    onChange={(e) => handlePositiveNumber(e.target.value, setWeight)}
                    className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#C1FB00] outline-none transition-all font-medium text-gray-900 dark:text-white"
                    placeholder="70"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Taille (cm)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={height}
                    onChange={(e) => handlePositiveNumber(e.target.value, setHeight)}
                    className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#C1FB00] outline-none transition-all font-medium text-gray-900 dark:text-white"
                    placeholder="175"
                  />
                </div>
              </div>
            </div>
            <p className="mt-6 text-center text-xs text-gray-400 italic">
              Vous pourrez modifier ces informations plus tard.
            </p>
          </div>
        )}

        {/* STEP 2: OBJECTIFS */}
        {step === 2 && (
          <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Vos objectifs
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Sélectionnez ce qui vous motive le plus (choix multiples possibles).
            </p>

            <div className="space-y-3">
              {[
                { id: 'reprise', label: 'Reprendre le sport', icon: <Activity /> },
                { id: 'performance', label: 'Améliorer mes perfs', icon: <Flame /> },
                { id: 'competition', label: 'Préparer une compétition', icon: <Trophy /> },
                { id: 'perte-poids', label: 'Perdre du poids', icon: <User /> },
                { id: 'hygiene', label: 'Hygiène de vie', icon: <Heart /> },
              ].map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id as UserGoal)}
                  className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                    selectedGoals.includes(goal.id as UserGoal)
                      ? 'border-[#00F65C] bg-[#00F65C]/5 text-gray-900 dark:text-white'
                      : 'border-transparent bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    selectedGoals.includes(goal.id as UserGoal)
                      ? 'bg-[#00F65C] text-[#292929]'
                      : 'bg-white dark:bg-gray-800'
                  }`}>
                    {/* CORRECTION ERREUR TS : on retire size et on utilise className */}
                    {React.cloneElement(goal.icon as React.ReactElement<any>, { className: 'w-5 h-5' })}
                  </div>
                  <span className="font-semibold flex-1 text-left">{goal.label}</span>
                  {selectedGoals.includes(goal.id as UserGoal) && (
                    <Check className="text-[#00F65C] w-5 h-5" />
                  )}
                </button>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-gray-400 italic">
              Vous pourrez modifier vos objectifs plus tard.
            </p>
          </div>
        )}

        {/* STEP 3: SPORTS */}
        {step === 3 && (
          <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Vos sports
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Quels sports pratiquez-vous principalement ?
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'course', label: 'Course à pied', emoji: '🏃‍♂️' },
                { id: 'velo', label: 'Cyclisme', emoji: '🚴‍♂️' },
                { id: 'natation', label: 'Natation', emoji: '🏊‍♂️' },
                { id: 'trail', label: 'Trail', emoji: '⛰️' },
                { id: 'triathlon', label: 'Triathlon', emoji: '🏅' },
                { id: 'autre', label: 'Autre', emoji: '⚡' },
              ].map((sport) => (
                <button
                  key={sport.id}
                  onClick={() => toggleSport(sport.id as SportType)}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all aspect-square ${
                    selectedSports.includes(sport.id as SportType)
                      ? 'border-[#C1FB00] bg-[#C1FB00]/10 text-gray-900 dark:text-white'
                      : 'border-transparent bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="text-3xl">{sport.emoji}</span>
                  <span className="font-semibold text-sm text-center">{sport.label}</span>
                </button>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-gray-400 italic">
              Vous pourrez modifier vos sports plus tard.
            </p>
          </div>
        )}

        {/* STEP 4: FRÉQUENCE */}
        {step === 4 && (
          <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Volume d'entraînement
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Cela nous aide à calibrer vos apports en glucides.
            </p>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-6 mb-6">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-[#F57BFF]/10 rounded-full flex items-center justify-center">
                  <Timer className="w-10 h-10 text-[#F57BFF]" />
                </div>
              </div>
              
              <label className="block text-sm font-medium text-center text-gray-900 dark:text-white mb-4">
                Combien d'heures par semaine (approximativement ou en moyenne) ?
              </label>
              
              <div className="flex items-center justify-center gap-4">
                <input
                  type="number"
                  min="0"
                  value={trainingHours}
                  onChange={(e) => handlePositiveNumber(e.target.value, setTrainingHours)}
                  className="w-32 p-4 text-center text-2xl font-bold rounded-2xl bg-white dark:bg-gray-800 border-2 border-transparent focus:border-[#F57BFF] outline-none transition-all text-gray-900 dark:text-white"
                  placeholder="0"
                />
                <span className="text-xl font-medium text-gray-500">h / semaine</span>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-gray-400 italic">
              Vous pourrez ajuster cette moyenne plus tard dans votre profil.
            </p>
          </div>
        )}

        {/* Next Button */}
        <div className="pt-6">
          <button
            onClick={step === 4 ? finishSetup : handleNext}
            // ICI: On applique le dégradé "SOMA" à la place du noir/blanc
            className="w-full bg-gradient-to-r from-[#00F65C] via-[#C1FB00] to-[#F57BFF] text-[#292929] py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              (step === 1 && (!name || !birthDate || !weight || !height)) ||
              (step === 2 && selectedGoals.length === 0) ||
              (step === 3 && selectedSports.length === 0)
            }
          >
            {step === 4 ? 'Terminer' : 'Continuer'}
            {step !== 4 && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}