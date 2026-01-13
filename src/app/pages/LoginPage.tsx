import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfile } from '../types';
import logo from '../../assets/8824ddb81cd37c9aee6379966a78e0022b549f27.png';

export default function LoginPage() {
  const { login } = useApp();
  
  // États pour gérer l'affichage des onglets
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('signup');

  // Champs formulaires
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  
  const [error, setError] = useState('');

  // --- FLUX CONNEXION (Utilisateur existant) ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    // On crée un profil par défaut minimal avec juste le nom
    // Le reste sera à 0 (géré par le contexte)
    const defaultProfile: UserProfile = {
      name: username,
      age: 0,
      gender: 'male',
      weight: 0,
      height: 0,
      goals: [],
      sports: [],
      customSports: [],
      trainingHoursPerWeek: 0,
      nutritionGoals: {
        proteins: 0,
        carbs: 0,
        fats: 0
      }
    };

    // On passe le profil à login() -> Direction Dashboard directement
    login(defaultProfile);
  };

  // --- FLUX INSCRIPTION (Nouvel utilisateur) ---
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    // On appelle login() SANS profil.
    // AppContext mettra isLoggedIn = true et userProfile = null.
    // App.tsx détectera cela et affichera automatiquement ProfileSetupPage pour la suite.
    login(); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00F65C]/10 via-[#C1FB00]/10 to-[#F57BFF]/10 dark:from-[#00F65C]/5 dark:via-[#C1FB00]/5 dark:to-[#F57BFF]/5 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <img src={logo} alt="SOMA" className="h-20 w-auto transition-transform hover:scale-105 duration-500" />
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
          
          {/* Tabs Header */}
          <div className="flex border-b border-gray-100 dark:border-gray-800">
            <button
              onClick={() => { setActiveTab('signup'); setError(''); }}
              className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${
                activeTab === 'signup'
                  ? 'text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              Inscription
            </button>
            <button
              onClick={() => { setActiveTab('login'); setError(''); }}
              className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${
                activeTab === 'login'
                  ? 'text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              Connexion
            </button>
          </div>

          <div className="p-8">
            <h1 className="mb-2 text-center text-xl font-bold text-gray-900 dark:text-white">
              {activeTab === 'signup' ? 'Créer un compte' : 'Bon retour !'}
            </h1>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm">
              {activeTab === 'signup' 
                ? 'Commencez votre transformation dès aujourd\'hui' 
                : 'Connectez-vous pour suivre vos progrès'}
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs rounded-xl text-center">
                {error}
              </div>
            )}

            {/* FORMULAIRE INSCRIPTION */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C1FB00] focus:border-transparent outline-none transition-all text-sm"
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Mot de passe</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C1FB00] focus:border-transparent outline-none transition-all text-sm"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C1FB00] focus:border-transparent outline-none transition-all text-sm"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#00F65C] via-[#C1FB00] to-[#F57BFF] text-[#292929] py-3.5 rounded-2xl hover:opacity-90 transition-all shadow-lg font-bold text-sm mt-2"
                >
                  Continuer
                </button>
              </form>
            )}

            {/* FORMULAIRE CONNEXION */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Nom d'utilisateur</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C1FB00] focus:border-transparent outline-none transition-all text-sm"
                    placeholder="Pseudo"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Mot de passe</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C1FB00] focus:border-transparent outline-none transition-all text-sm"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  // ICI : Changement du style pour le dégradé SOMA
                  className="w-full bg-gradient-to-r from-[#00F65C] via-[#C1FB00] to-[#F57BFF] text-[#292929] py-3.5 rounded-2xl hover:opacity-90 transition-all shadow-lg font-bold text-sm mt-2"
                >
                  Se connecter
                </button>
              </form>
            )}
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 text-center border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              SOMA • Nutrition & Performance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}