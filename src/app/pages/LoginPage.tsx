import React from 'react';
import { useApp } from '../context/AppContext';
import logo from '../../assets/8824ddb81cd37c9aee6379966a78e0022b549f27.png';

export default function LoginPage() {
  const { login } = useApp();

  const handleLogin = () => {
    login();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00F65C]/10 via-[#C1FB00]/10 to-[#F57BFF]/10 dark:from-[#00F65C]/5 dark:via-[#C1FB00]/5 dark:to-[#F57BFF]/5 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <img src={logo} alt="SOMA" className="h-20 w-auto" />
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 border border-gray-100 dark:border-gray-800">
          <h1 className="mb-2 text-center text-2xl text-gray-900 dark:text-white">Bienvenue sur SOMA</h1>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm">
            Votre coach nutrition sportive
          </p>

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-[#00F65C] via-[#C1FB00] to-[#F57BFF] text-[#292929] py-3.5 rounded-2xl hover:opacity-90 transition-opacity shadow-lg font-medium"
          >
            Se connecter
          </button>

          <p className="text-center text-gray-400 dark:text-gray-500 mt-5 text-xs">
            Sports d'endurance • Nutrition personnalisée
          </p>
        </div>
      </div>
    </div>
  );
}