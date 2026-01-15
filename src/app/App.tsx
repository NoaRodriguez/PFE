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

  // Handle edit pages with IDs
  if (currentPage.startsWith('edit-session:')) {
    const sessionId = parseInt(currentPage.split(':')[1], 10);
    return (
      <>
        <EditSessionPage sessionId={sessionId} onNavigate={setCurrentPage} />
        <BottomNav currentPage="calendar" onNavigate={setCurrentPage} />
      </>
    );
  }

  if (currentPage.startsWith('edit-competition:')) {
    const competitionId = parseInt(currentPage.split(':')[1], 10);
    return (
      <>
        <EditCompetitionPage competitionId={competitionId} onNavigate={setCurrentPage} />
        <BottomNav currentPage="calendar" onNavigate={setCurrentPage} />
      </>
    );
  }

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