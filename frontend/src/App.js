import React, { useState } from 'react';
import Login from './Login';
import Chat from './Chat';
import Settings from './Settings';
import LandingPage from './LandingPage';
import { ToastProvider } from './Toast';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'chat', or 'settings'

  const [themeMode, setThemeMode] = useState(localStorage.getItem('themeMode') || 'system');
  const [wallpaper, setWallpaper] = useState(localStorage.getItem('chatWallpaper') || null);

  // Derived theme for display (light/dark)
  const [displayTheme, setDisplayTheme] = useState('light');

  React.useEffect(() => {
    const handleSystemThemeChange = (e) => {
      if (themeMode === 'system') {
        setDisplayTheme(e.matches ? 'dark' : 'light');
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Initial check
    const updateTheme = () => {
      if (themeMode === 'system') {
        setDisplayTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setDisplayTheme(themeMode);
      }
    };

    updateTheme();

    if (themeMode === 'system') {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    }

    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [themeMode]);

  React.useEffect(() => {
    document.body.setAttribute('data-theme', displayTheme);
  }, [displayTheme]);

  const handleThemeChange = (mode) => {
    setThemeMode(mode);
    localStorage.setItem('themeMode', mode);
  };

  const handleWallpaperChange = (newWallpaper) => {
    setWallpaper(newWallpaper);
    if (newWallpaper) {
      localStorage.setItem('chatWallpaper', newWallpaper);
    } else {
      localStorage.removeItem('chatWallpaper');
    }
  };

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

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  if (currentView === 'landing') {
    return <LandingPage onGetStarted={() => setCurrentView('login')} />;
  }

  return (
    <ToastProvider>
      <div className={`App ${displayTheme}`}>
        {!user || currentView === 'login' ? (
          <Login onLogin={handleLogin} onRegister={handleRegister} />
        ) : (
          <>
            {currentView === 'chat' && (
              <Chat
                user={user}
                onLogout={handleLogout}
                onOpenSettings={() => setCurrentView('settings')}
                theme={displayTheme}
                wallpaper={wallpaper}
              />
            )}
            {currentView === 'settings' && (
              <Settings
                user={user}
                theme={displayTheme}
                currentThemeMode={themeMode}
                wallpaper={wallpaper}
                onUpdateUser={handleUpdateUser}
                onUpdateTheme={handleThemeChange}
                onUpdateWallpaper={handleWallpaperChange}
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