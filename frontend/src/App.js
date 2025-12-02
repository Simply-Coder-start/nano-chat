import React, { useState } from 'react';
import Login from './Login';
import Chat from './Chat';
import Settings from './Settings';
import LandingPage from './LandingPage';
import { ToastProvider } from './Toast';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'chat', or 'settings'
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('chat');
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setCurrentView('chat');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
  };

  React.useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  if (currentView === 'landing') {
    return <LandingPage onGetStarted={() => setCurrentView('login')} />;
  }

  return (
    <ToastProvider>
      <div className={`App ${theme}`}>
        {!user || currentView === 'login' ? (
          <Login onLogin={handleLogin} onRegister={handleRegister} />
        ) : (
          <>
            {currentView === 'chat' && (
              <Chat
                user={user}
                onLogout={handleLogout}
                onOpenSettings={() => setCurrentView('settings')}
                theme={theme}
              />
            )}
            {currentView === 'settings' && (
              <Settings
                user={user}
                theme={theme}
                onUpdateUser={handleUpdateUser}
                onToggleTheme={toggleTheme}
                onClose={() => setCurrentView('chat')}
              />
            )}
          </>
        )}
      </div>
    </ToastProvider>
  );
}

export default App;