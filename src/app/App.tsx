import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import BottomNav from './components/BottomNav';
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import TrackerPage from './pages/TrackerPage';
import AdvicePage from './pages/AdvicePage';
import ProfilePage from './pages/ProfilePage';
import AddSessionPage from './pages/AddSessionPage';
import EditSessionPage from './pages/EditSessionPage';
import AddCompetitionPage from './pages/AddCompetitionPage';
import EditCompetitionPage from './pages/EditCompetitionPage';
import LoginPage from './pages/LoginPage';
import ProfileSetupPage from './pages/ProfileSetupPage';

function AppContent() {
  const { isLoggedIn, userProfile } = useApp();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  // Si connecté mais pas de profil (cas inscription en cours)
  if (isLoggedIn && !userProfile) {
    return <ProfileSetupPage />;
  }

  const renderPage = () => {
    // Gestion de l'ajout de séance avec date pré-sélectionnée
    if (currentPage.startsWith('add-session')) {
      const dateParam = currentPage.split(':')[1];
      return <AddSessionPage onNavigate={setCurrentPage} initialDate={dateParam} />;
    }

    // Gestion de l'ajout de compétition avec date pré-sélectionnée
    if (currentPage.startsWith('add-competition')) {
      const dateParam = currentPage.split(':')[1];
      return <AddCompetitionPage onNavigate={setCurrentPage} initialDate={dateParam} />;
    }

    if (currentPage.startsWith('edit-session:')) {
      const sessionId = currentPage.split(':')[1];
      return <EditSessionPage onNavigate={setCurrentPage} sessionId={sessionId} />;
    }

    if (currentPage.startsWith('edit-competition:')) {
      const competitionId = currentPage.split(':')[1];
      return <EditCompetitionPage onNavigate={setCurrentPage} competitionId={competitionId} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'calendar':
        return <CalendarPage onNavigate={setCurrentPage} />;
      case 'tracker':
        return <TrackerPage onNavigate={setCurrentPage} />;
      case 'advice':
        return <AdvicePage onNavigate={setCurrentPage} />;
      case 'profile':
        return <ProfilePage onNavigate={setCurrentPage} />;
      default:
        return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      <div className="flex-1 overflow-y-auto">
        {renderPage()}
      </div>
      {/* On cache la barre de nav sur les pages "pleine page" comme les formulaires */}
      {!currentPage.startsWith('add-') && !currentPage.startsWith('edit-') && (
        // CORRECTION FINALE : Utilisation de la bonne prop 'currentPage'
        <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}