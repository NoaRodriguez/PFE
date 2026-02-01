import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import BottomNav from './components/BottomNav';
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import AdvicePage from './pages/AdvicePage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import AddSessionPage from './pages/AddSessionPage';
import EditSessionPage from './pages/EditSessionPage';
import AddCompetitionPage from './pages/AddCompetitionPage';
import EditCompetitionPage from './pages/EditCompetitionPage';

function AppContent() {
  const { isLoggedIn, userProfile } = useApp();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  if (isLoggedIn && userProfile && !userProfile.prenom) {
    return <ProfileSetupPage onComplete={() => setCurrentPage('dashboard')} />;
  }

  // Découpage de l'URL : page:param1:param2
  const [page, param1, param2] = currentPage.split(':');

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      
      case 'calendar':
        return <CalendarPage onNavigate={setCurrentPage} />;
      
      case 'advice':
        // MODIF ICI : On passe param2 comme "returnTo"
        return <AdvicePage onNavigate={setCurrentPage} initialCategoryId={param1} returnTo={param2} />;
      
      case 'profile':
        return <ProfilePage onNavigate={setCurrentPage} />;
      
      case 'add-session':
        return <AddSessionPage onNavigate={setCurrentPage} initialDate={param1} returnTo={param2} />;
      
      case 'edit-session':
        return <EditSessionPage sessionId={param1} onNavigate={setCurrentPage} returnTo={param2} />;
      
      case 'add-competition':
        return <AddCompetitionPage onNavigate={setCurrentPage} initialDate={param1} returnTo={param2} />;
      
      case 'edit-competition':
        return <EditCompetitionPage competitionId={param1} onNavigate={setCurrentPage} returnTo={param2} />;
        
      default:
        return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  const showBottomNav = ['dashboard', 'calendar', 'advice', 'profile'].includes(page);

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen text-gray-900 dark:text-white font-sans transition-colors duration-200">
      <main className={showBottomNav ? "pb-20" : ""}>
        {renderPage()}
      </main>
      {showBottomNav && (
        <BottomNav currentPage={page} onNavigate={setCurrentPage} />
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