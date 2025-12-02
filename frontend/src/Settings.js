import React, { useState, useRef } from 'react';
import {
    IconClose,
    IconUser,
    IconPalette,
    IconBell,
    IconGlobe,
    IconLock,
    IconCopy,
    IconEye,
    IconTextSize,
    IconFont,
    IconMessage,
    IconBroom,
    IconKey
} from './Icons';
import { useToast } from './Toast';
import './Settings.css';

function Settings({ user, theme, onUpdateUser, onToggleTheme, onClose }) {
    // Profile State
    const [username, setUsername] = useState(user?.username || 'User');
    const [bio, setBio] = useState(user?.bio || 'Hey there! I am using Secure Chat.');
    const [avatar, setAvatar] = useState(user?.avatar || 'https://via.placeholder.com/150');

    // Chat Settings State
    const [fontSize, setFontSize] = useState('medium');
    const [language, setLanguage] = useState('en');
    const [accentColor, setAccentColor] = useState('#a8d8ea');
    const [fontStyle, setFontStyle] = useState('sans-serif');

    // Preferences State
    const [notifications, setNotifications] = useState(true);
    const [bubbleStyle, setBubbleStyle] = useState('classic');

    // Security State
    const [showSecretKey, setShowSecretKey] = useState(false);
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const secretKey = process.env.REACT_APP_ENCRYPTION_KEY || "secure-chat-demo-secret-key"; // In real app, this comes from props/context

    const fileInputRef = useRef(null);
    const { addToast } = useToast();

    // Handlers
    const handleAvatarClick = () => fileInputRef.current.click();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
                onUpdateUser({ ...user, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = () => {
        onUpdateUser({ ...user, username, bio, avatar });
        addToast('Profile updated successfully!', 'success');
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            addToast('Passwords do not match!', 'error');
            return;
        }
        if (newPassword.length < 6) {
            addToast('Password must be at least 6 characters!', 'error');
            return;
        }

        try {
            const baseUrl = 'https://nano-chat-xl61.onrender.com';
            const response = await fetch(`${baseUrl}/api/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: user.username,
                    currentPassword,
                    newPassword
                })
            });

            const data = await response.json();
            if (data.success) {
                addToast('Password changed successfully!', 'success');
                setShowPasswordChange(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                addToast(data.error || 'Failed to change password', 'error');
            }
        } catch (error) {
            addToast('Network error. Please try again.', 'error');
        }
    };

    const copySecretKey = () => {
        navigator.clipboard.writeText(secretKey);
        addToast('Secret Key copied to clipboard!', 'success');
    };

    const handleCleanChat = () => {
        if (window.confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
            console.log('Chat cleared');
            // Implement actual clear logic here
            addToast('Chat history cleared!', 'success');
        }
    };

    return (
        <div className={`settings-overlay ${theme}`}>
            <div className="settings-modal">
                {/* Header */}
                <div className="settings-header">
                    <h2>Settings</h2>
                    <button className="close-button" onClick={onClose}>
                        <IconClose className="icon-md" />
                    </button>
                </div>

                <div className="settings-content">
                    {/* 1. Profile Section */}
                    <section className="settings-section">
                        <div className="section-header">
                            <IconUser className="section-icon" />
                            <h3>Profile</h3>
                        </div>
                        <div className="profile-container">
                            <div className="avatar-edit" onClick={handleAvatarClick}>
                                <img src={avatar} alt="Profile" />
                                <div className="avatar-overlay">
                                    <span>Edit</span>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="profile-fields">
                                <div className="input-group">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        onBlur={handleSaveProfile}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Bio</label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        onBlur={handleSaveProfile}
                                        rows="2"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. Chat Settings */}
                    <section className="settings-section">
                        <div className="section-header">
                            <IconPalette className="section-icon" />
                            <h3>Chat Settings</h3>
                        </div>
                        <div className="settings-grid">
                            <div className="setting-item">
                                <div className="setting-label">
                                    <IconTextSize className="item-icon" />
                                    <span>Font Size</span>
                                </div>
                                <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
                                    <option value="small">Small</option>
                                    <option value="medium">Medium</option>
                                    <option value="large">Large</option>
                                </select>
                            </div>
                            <div className="setting-item">
                                <div className="setting-label">
                                    <IconGlobe className="item-icon" />
                                    <span>Language</span>
                                </div>
                                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                </select>
                            </div>
                            <div className="setting-item">
                                <div className="setting-label">
                                    <IconPalette className="item-icon" />
                                    <span>Accent Color</span>
                                </div>
                                <input
                                    type="color"
                                    value={accentColor}
                                    onChange={(e) => setAccentColor(e.target.value)}
                                    className="color-picker"
                                />
                            </div>
                            <div className="setting-item">
                                <div className="setting-label">
                                    <IconFont className="item-icon" />
                                    <span>Font Style</span>
                                </div>
                                <select value={fontStyle} onChange={(e) => setFontStyle(e.target.value)}>
                                    <option value="sans-serif">Sans Serif</option>
                                    <option value="serif">Serif</option>
                                    <option value="monospace">Monospace</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* 3. Preferences */}
                    <section className="settings-section">
                        <div className="section-header">
                            <IconBell className="section-icon" />
                            <h3>Preferences</h3>
                        </div>
                        <div className="settings-list">
                            <div className="setting-row">
                                <div className="setting-info">
                                    <span className="row-title">Notifications</span>
                                    <span className="row-desc">Enable push notifications</span>
                                </div>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={notifications}
                                        onChange={() => setNotifications(!notifications)}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            <div className="setting-row">
                                <div className="setting-info">
                                    <span className="row-title">Chat Bubble Style</span>
                                </div>
                                <select
                                    className="minimal-select"
                                    value={bubbleStyle}
                                    onChange={(e) => setBubbleStyle(e.target.value)}
                                >
                                    <option value="classic">Classic</option>
                                    <option value="modern">Modern</option>
                                    <option value="minimal">Minimal</option>
                                </select>
                            </div>
                            <div className="setting-row danger-zone" onClick={handleCleanChat}>
                                <div className="setting-info">
                                    <span className="row-title danger">Clean All Chat</span>
                                    <span className="row-desc">Delete all message history</span>
                                </div>
                                <IconBroom className="icon-sm danger" />
                            </div>
                        </div>
                    </section>

                    {/* 4. Security */}
                    <section className="settings-section">
                        <div className="section-header">
                            <IconLock className="section-icon" />
                            <h3>Security</h3>
                        </div>
                        <div className="security-card">
                            <div className="security-header">
                                <span className="security-label">Secret Key</span>
                                <div className="security-actions">
                                    <button className="icon-action" onClick={() => setShowSecretKey(!showSecretKey)}>
                                        <IconEye className="icon-sm" />
                                    </button>
                                    <button className="icon-action" onClick={copySecretKey}>
                                        <IconCopy className="icon-sm" />
                                    </button>
                                </div>
                            </div>
                            <div className={`secret-key-display ${showSecretKey ? 'visible' : 'masked'}`}>
                                {secretKey}
                            </div>
                        </div>

                        {/* Password Change */}
                        <div className="security-card" style={{ marginTop: '15px' }}>
                            <div className="security-header">
                                <span className="security-label">Change Password</span>
                                <button
                                    className="icon-action"
                                    onClick={() => setShowPasswordChange(!showPasswordChange)}
                                    style={{ background: showPasswordChange ? 'rgba(168, 216, 234, 0.2)' : 'none' }}
                                >
                                    <IconKey className="icon-sm" />
                                </button>
                            </div>
                            {showPasswordChange && (
                                <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div className="input-group">
                                        <label>Current Password</label>
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>New Password</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                    <button
                                        onClick={handlePasswordChange}
                                        style={{
                                            padding: '10px 20px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                        }}
                                    >
                                        Change Password
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* 5. Secret Key Instructions */}
                    <section className="settings-section instructions-section">
                        <div className="section-header">
                            <IconKey className="section-icon" />
                            <h3>Secret Key Instructions</h3>
                        </div>
                        <div className="instructions-content">
                            <p><strong>What is the Secret Key?</strong> A unique private ID used to find or add you without sharing personal info.</p>
                            <p><strong>Keep it private:</strong> Only share this with people you trust to start a secure conversation.</p>
                            <div className="quick-steps">
                                <span>How to add a user:</span>
                                <ol>
                                    <li>Go to 'Add Contact'</li>
                                    <li>Enter their Secret Key</li>
                                    <li>Start chatting securely</li>
                                </ol>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Settings;
