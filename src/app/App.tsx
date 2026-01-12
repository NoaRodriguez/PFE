import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import AddSessionPage from './pages/AddSessionPage';
import AddCompetitionPage from './pages/AddCompetitionPage';
import EditSessionPage from './pages/EditSessionPage';
import EditCompetitionPage from './pages/EditCompetitionPage';
import TrackerPage from './pages/TrackerPage';
import AdvicePage from './pages/AdvicePage';
import ProfilePage from './pages/ProfilePage';
import BottomNav from './components/BottomNav';

function AppContent() {
  const { isLoggedIn, userProfile } = useApp();
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  if (!userProfile) {
    return <ProfileSetupPage onComplete={() => setCurrentPage('dashboard')} />;
  }

  // Handle edit pages with IDs
  if (currentPage.startsWith('edit-session:')) {
    const sessionId = currentPage.split(':')[1];
    return (
      <>
        <EditSessionPage sessionId={sessionId} onNavigate={setCurrentPage} />
        <BottomNav currentPage="calendar" onNavigate={setCurrentPage} />
      </>
    );
  }

  if (currentPage.startsWith('edit-competition:')) {
    const competitionId = currentPage.split(':')[1];
    return (
      <>
        <EditCompetitionPage competitionId={competitionId} onNavigate={setCurrentPage} />
        <BottomNav currentPage="calendar" onNavigate={setCurrentPage} />
      </>
    );
  }

  return (
    <>
      {currentPage === 'dashboard' && <DashboardPage onNavigate={setCurrentPage} />}
      {currentPage === 'calendar' && <CalendarPage onNavigate={setCurrentPage} />}
      {currentPage === 'add-session' && <AddSessionPage onNavigate={setCurrentPage} />}
      {currentPage === 'add-competition' && <AddCompetitionPage onNavigate={setCurrentPage} />}
      {currentPage === 'tracker' && <TrackerPage onNavigate={setCurrentPage} />}
      {currentPage === 'advice' && <AdvicePage onNavigate={setCurrentPage} />}
      {currentPage === 'profile' && <ProfilePage onNavigate={setCurrentPage} />}
      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}