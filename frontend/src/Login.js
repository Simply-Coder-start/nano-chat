import React, { useState, useEffect } from 'react';
import './Login.css';

function Login({ onLogin, onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved credentials on mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      const baseUrl = 'https://nano-chat-xl61.onrender.com';
      const endpoint = isRegistering ? `${baseUrl}/api/register` : `${baseUrl}/api/login`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Save credentials if remember me is checked
        if (rememberMe) {
          localStorage.setItem('rememberedUsername', username);
          localStorage.setItem('rememberedPassword', password);
        } else {
          localStorage.removeItem('rememberedUsername');
          localStorage.removeItem('rememberedPassword');
        }

        if (isRegistering) {
          onRegister(data.user);
        } else {
          onLogin(data.user);
        }
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    const baseUrl = 'https://nano-chat-xl61.onrender.com';
    window.location.href = `${baseUrl}/api/auth/google`;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">
          {isRegistering ? 'Join Secure Chat' : 'Welcome Back'}
        </h2>
        <p className="login-subtitle">
          {isRegistering ? 'Create your secure account' : 'Enter your credentials to access'}
        </p>

        <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
          <div className="input-group">
            <label className="input-label">Username</label>
            <input
              type="text"
              className="login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="off"
              name="username_field_no_autofill"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="new-password"
              name="password_field_no_autofill"
            />
          </div>

          {!isRegistering && (
            <div className="remember-me-container">
              <label className="remember-me-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="remember-me-checkbox"
                />
                <span>Remember me</span>
              </label>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            {isRegistering ? 'Create Account' : 'Sign In'}
          </button>

          {!isRegistering && (
            <>
              <div className="divider">
                <span>OR</span>
              </div>
              <button type="button" className="google-login-button" onClick={handleGoogleLogin}>
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                  <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.184L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9.003 18z" fill="#34A853" />
                  <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                  <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
            </>
          )}
        </form>

        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="toggle-button"
        >
          {isRegistering
            ? 'Already have an account? Sign In'
            : "Don't have an account? Create one"}
        </button>

        <div className="demo-note">
          <strong>Secure Note:</strong> End-to-end encryption enabled.
          <br />
          Your privacy is our priority.
        </div>
      </div>
    </div>
  );
}

export default Login;