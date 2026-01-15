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
    // CORRECTION : On garde l'ID en string (UUID)
    const sessionId = currentPage.split(':')[1];
    return (
      <>
        <EditSessionPage sessionId={sessionId} onNavigate={setCurrentPage} />
        <BottomNav currentPage="calendar" onNavigate={setCurrentPage} />
      </>
    );
  }

  if (currentPage.startsWith('edit-competition:')) {
    // CORRECTION : On garde l'ID en string (UUID)
    const competitionId = currentPage.split(':')[1];
    return (
      <>
        <EditCompetitionPage competitionId={competitionId} onNavigate={setCurrentPage} />
        <BottomNav currentPage="calendar" onNavigate={setCurrentPage} />
      </>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'calendar':
        return <CalendarPage onNavigate={setCurrentPage} />;
      case 'tracker':
        // Correction : Ajout de onNavigate
        return <TrackerPage onNavigate={setCurrentPage} />;
      case 'advice':
        // Correction : Ajout de onNavigate
        return <AdvicePage onNavigate={setCurrentPage} />;
      case 'profile':
        // Correction : Ajout de onNavigate
        return <ProfilePage onNavigate={setCurrentPage} />;
      case 'add-session':
        return <AddSessionPage onNavigate={setCurrentPage} />;
      case 'add-competition':
        return <AddCompetitionPage onNavigate={setCurrentPage} />;
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