import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import BottomNav from './components/BottomNav';
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
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

  if (isLoggedIn && !userProfile) {
    return <ProfileSetupPage />;
  }

  // --- Gestion des pages d'édition ---
  if (currentPage.startsWith('edit-session:')) {
    const sessionId = currentPage.split(':')[1];
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <EditSessionPage sessionId={sessionId} onNavigate={setCurrentPage} />
        <BottomNav currentPage="calendar" onNavigate={setCurrentPage} />
      </div>
    );
  }

  if (currentPage.startsWith('edit-competition:')) {
    const competitionId = currentPage.split(':')[1];
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <EditCompetitionPage competitionId={competitionId} onNavigate={setCurrentPage} />
        <BottomNav currentPage="calendar" onNavigate={setCurrentPage} />
      </div>
    );
  }

  // --- Gestion des pages d'ajout ---
  if (currentPage.startsWith('add-session:')) {
    const date = currentPage.split(':')[1];
    return <AddSessionPage onNavigate={setCurrentPage} initialDate={date} />;
  }

  if (currentPage.startsWith('add-competition:')) {
    const date = currentPage.split(':')[1];
    return <AddCompetitionPage onNavigate={setCurrentPage} initialDate={date} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'calendar':
        return <CalendarPage onNavigate={setCurrentPage} />;
      case 'advice':
        return <AdvicePage onNavigate={setCurrentPage} />;
      case 'profile':
        return <ProfilePage onNavigate={setCurrentPage} />;
      case 'add-session':
        return <AddSessionPage onNavigate={setCurrentPage} />;
      case 'add-competition':
        return <AddCompetitionPage onNavigate={setCurrentPage} />;
      default:
        return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  // On vérifie si on doit afficher la barre de navigation
  const showBottomNav = !currentPage.startsWith('add-') && !currentPage.startsWith('edit-');

  return (
    // CORRECTION MAJEURE : On utilise min-h-screen au lieu de h-screen
    // Et on laisse le navigateur gérer le scroll (plus de overflow-y-auto ici)
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      
      {/* Contenu principal qui grandit selon le besoin */}
      <div className={`flex-1 ${showBottomNav ? 'pb-24' : ''}`}>
        {renderPage()}
      </div>

      {/* Barre de navigation fixe en bas */}
      {showBottomNav && (
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