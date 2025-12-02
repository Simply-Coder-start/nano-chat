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

  // Google Sign-In handler
  const handleGoogleSignIn = async (response) => {
    try {
      // Decode the JWT token from Google
      const credential = response.credential;
      const payload = JSON.parse(atob(credential.split('.')[1]));

      const googleUser = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        googleId: payload.sub
      };

      // Try to login first with email as username
      const baseUrl = 'https://nano-chat-xl61.onrender.com';
      let loginResponse = await fetch(`${baseUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: googleUser.email,
          password: 'google-oauth-' + googleUser.googleId
        })
      });

      let data = await loginResponse.json();

      // If login fails, register the user
      if (!data.success) {
        const registerResponse = await fetch(`${baseUrl}/api/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: googleUser.email,
            password: 'google-oauth-' + googleUser.googleId
          })
        });
        data = await registerResponse.json();
      }

      if (data.success) {
        // Add Google profile info to user object
        const userWithGoogle = {
          ...data.user,
          avatar: googleUser.picture,
          email: googleUser.email
        };
        onLogin(userWithGoogle);
      } else {
        setError('Failed to sign in with Google');
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      setError('Google Sign-In failed. Please try again.');
    }
  };

  // Initialize Google Sign-In
  useEffect(() => {
    if (window.google && !isRegistering) {
      window.google.accounts.id.initialize({
        client_id: '1076520454182-86c18m2h240tiocaesh45u1gfqic1hps.apps.googleusercontent.com',
        callback: handleGoogleSignIn
      });

      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        {
          theme: 'filled_blue',
          size: 'large',
          width: 350,
          text: 'continue_with'
        }
      );
    }
  }, [isRegistering]);

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
              <div id="googleSignInButton" style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}></div>
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