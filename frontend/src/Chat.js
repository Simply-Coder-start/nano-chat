import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { encryptMessage, decryptMessage } from './encryption';
import Sidebar from './Sidebar';
import MessageBubble from './MessageBubble';
import AddContactModal from './AddContactModal';
import {
    IconSettings, IconLogout, IconAttachment, IconMenu,
    IconSend, IconEmoji, IconDocument, IconImage, IconAudio, IconVideo, IconPlus,
    IconDotsVertical, IconHistory, IconTrash, IconClose
} from './Icons';
import './Settings.css'; // Reusing variables
import './Chat.css'; // Restored chat styles
import './Sidebar.css';
import './MessageBubble.css';

import { useFileUpload } from './useFileUpload';

function Chat({ user, onLogout, onOpenSettings, theme }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [contacts, setContacts] = useState([
        { id: 1, name: 'Global Chat', avatar: null, status: 'online', lastMessage: 'Welcome to Secure Chat', lastMessageTime: new Date() }
    ]);
    const [selectedContact, setSelectedContact] = useState(contacts[0]);
    const [showAddContact, setShowAddContact] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showFileMenu, setShowFileMenu] = useState(false);

    // New State for Options Menu
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false); // Kept for potential future use or if we want to view before clearing
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const messagesEndRef = useRef(null);
    const optionsMenuRef = useRef(null);
    const fileInputRef = useRef(null);

    const { uploadFile, uploading, progress, error } = useFileUpload();

    useEffect(() => {
        const newSocket = io('http://localhost:3002');
        setSocket(newSocket);

        newSocket.emit('getMessageHistory');

        newSocket.on('messageHistory', (messageHistory) => {
            const decryptedMessages = messageHistory.map(msg => {
                try {
                    const decryptedText = decryptMessage(msg.encryptedMessage);
                    return { ...msg, decryptedText, isDecrypted: true };
                } catch (error) {
                    return { ...msg, decryptedText: '[Unable to decrypt message]', isDecrypted: false };
                }
            });
            setMessages(decryptedMessages);
        });

        newSocket.on('newEncryptedMessage', (encryptedMessageData) => {
            try {
                const decryptedText = decryptMessage(encryptedMessageData.encryptedMessage);
                setMessages(prev => [...prev, { ...encryptedMessageData, decryptedText, isDecrypted: true }]);

                // Update last message for Global Chat (simulated)
                setContacts(prev => prev.map(c =>
                    c.id === 1 ? { ...c, lastMessage: decryptedText, lastMessageTime: new Date() } : c
                ));
            } catch (error) {
                setMessages(prev => [...prev, { ...encryptedMessageData, decryptedText: '[Unable to decrypt message]', isDecrypted: false }]);
            }
        });

        // Handle chat deletion (cleared messages)
        newSocket.on('chatDeleted', () => {
            setMessages([]);
            setShowClearConfirm(false);
            setShowDeleteConfirm(false);
        });

        return () => newSocket.close();
    }, [user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Close options menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
                setShowOptionsMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const sendMessage = (e) => {
        e?.preventDefault();
        if (!newMessage.trim() || !socket) return;

        try {
            const encryptedMessage = encryptMessage(newMessage.trim());
            socket.emit('encryptedMessage', {
                username: user.username,
                encryptedMessage
            });
            setNewMessage('');
        } catch (error) {
            console.error('Failed to encrypt message:', error);
            alert('Failed to send message. Encryption error.');
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const { url, filename } = await uploadFile(file);
            // Send message with file link
            const fileMessage = `File: [${filename}](${url})`;

            const encryptedMessage = encryptMessage(fileMessage);
            socket.emit('encryptedMessage', {
                username: user.username,
                encryptedMessage
            });
            setShowFileMenu(false);
        } catch (err) {
            alert('Upload failed: ' + err.message);
        } finally {
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    const handleAddContact = (newContact) => {
        setContacts(prev => [...prev, newContact]);
    };

    const handleClearChat = () => {
        if (socket) {
            socket.emit('deleteChat'); // Clears messages on server
            // Contact remains in 'contacts' state
        }
    };

    const handleDeleteChat = () => {
        if (socket) {
            socket.emit('deleteChat'); // Clears messages on server
            // Remove contact from local state
            if (selectedContact) {
                setContacts(prev => prev.filter(c => c.id !== selectedContact.id));
                setSelectedContact(null); // Deselect
            }
        }
    };

    // Limit messages for main view (e.g., last 50)
    const displayedMessages = messages.slice(-50);

    return (
        <div className={`chat-layout ${theme}`}>
            {/* Sidebar */}
            <Sidebar
                contacts={contacts}
                selectedContactId={selectedContact?.id}
                onSelectContact={(contact) => {
                    setSelectedContact(contact);
                    setIsSidebarOpen(false);
                }}
                onAddContact={() => setShowAddContact(true)}
                isOpen={isSidebarOpen}
            />

            {/* Main Chat Area */}
            <div className="main-chat-area">
                {/* Header */}
                <div className="chat-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button
                            className="hamburger-btn"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <IconMenu className="icon-md" />
                        </button>
                        {selectedContact ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ position: 'relative' }}>
                                    <img
                                        src={selectedContact.avatar || 'https://via.placeholder.com/40'}
                                        alt={selectedContact.name}
                                        style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                                    />
                                    <span className={`dot ${selectedContact.status}`} style={{ position: 'absolute', bottom: '2px', right: '0', border: '2px solid white' }}></span>
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '600' }}>{selectedContact.name}</h3>
                                    <span style={{ fontSize: '12px', opacity: 0.6 }}>{selectedContact.status === 'online' ? 'Active now' : selectedContact.status}</span>
                                </div>
                            </div>
                        ) : (
                            <div style={{ padding: '10px', fontStyle: 'italic', opacity: 0.6 }}>Select a chat</div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {/* Options Menu */}
                        {selectedContact && (
                            <div style={{ position: 'relative' }} ref={optionsMenuRef}>
                                <button
                                    onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                                    className="icon-btn"
                                    title="Options"
                                >
                                    <IconDotsVertical className="icon-sm" />
                                </button>

                                {showOptionsMenu && (
                                    <div className="options-menu">
                                        <button onClick={() => { setShowClearConfirm(true); setShowOptionsMenu(false); }}>
                                            <IconHistory className="icon-xs" /> Clear Old Messages
                                        </button>
                                        <button onClick={() => { setShowDeleteConfirm(true); setShowOptionsMenu(false); }} className="danger">
                                            <IconTrash className="icon-xs" /> Delete Entire Chat
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <button onClick={onOpenSettings} className="icon-btn" title="Settings">
                            <IconSettings className="icon-sm" />
                        </button>
                        <button onClick={onLogout} className="icon-btn" title="Logout">
                            <IconLogout className="icon-sm" />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="messages-container">
                    {selectedContact ? (
                        <>
                            {displayedMessages.map((msg, index) => (
                                <MessageBubble
                                    key={index}
                                    message={msg}
                                    isOwnMessage={msg.username === user.username}
                                    senderName={msg.username}
                                    avatar={`https://ui-avatars.com/api/?name=${msg.username}&background=random`}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5 }}>
                            Select a contact to start chatting
                        </div>
                    )}
                </div>

                {/* Input Area */}
                {selectedContact && (
                    <div className="chat-input-area">
                        {/* File Sharing Menu */}
                        {showFileMenu && (
                            <div className="file-menu">
                                <button className="icon-btn" title="Document" onClick={triggerFileUpload}><IconDocument className="icon-md" /></button>
                                <button className="icon-btn" title="Image" onClick={triggerFileUpload}><IconImage className="icon-md" /></button>
                                <button className="icon-btn" title="Audio" onClick={triggerFileUpload}><IconAudio className="icon-md" /></button>
                                <button className="icon-btn" title="Video" onClick={triggerFileUpload}><IconVideo className="icon-md" /></button>
                            </div>
                        )}

                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileSelect}
                        />

                        {uploading && (
                            <div className="upload-progress-bar" style={{
                                position: 'absolute',
                                top: '-4px',
                                left: 0,
                                height: '4px',
                                width: `${progress}%`,
                                backgroundColor: 'var(--accent-color)',
                                transition: 'width 0.2s'
                            }}></div>
                        )}

                        <form onSubmit={sendMessage} className="chat-input-form">
                            <button
                                type="button"
                                className="icon-btn"
                                onClick={() => setShowFileMenu(!showFileMenu)}
                                style={{ background: showFileMenu ? 'rgba(0,0,0,0.05)' : 'transparent' }}
                            >
                                <IconPlus className="icon-md" />
                            </button>

                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder={uploading ? `Uploading... ${progress}%` : "Type a message..."}
                                disabled={uploading}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    border: 'none',
                                    background: 'transparent',
                                    fontSize: '15px',
                                    outline: 'none',
                                    color: 'inherit'
                                }}
                            />

                            <button type="button" className="icon-btn">
                                <IconEmoji className="icon-md" />
                            </button>

                            <button
                                type="submit"
                                disabled={!newMessage.trim() || uploading}
                                style={{
                                    padding: '10px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: 'var(--accent-color)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    opacity: newMessage.trim() && !uploading ? 1 : 0.6,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '40px',
                                    height: '40px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <IconSend className="icon-sm" style={{ marginLeft: '2px' }} />
                            </button>
                        </form>
                    </div>
                )}

                {showAddContact && (
                    <AddContactModal
                        onClose={() => setShowAddContact(false)}
                        onAdd={handleAddContact}
                    />
                )}

                {/* Clear Confirmation Modal */}
                {showClearConfirm && (
                    <div className="modal-overlay" onClick={() => setShowClearConfirm(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '350px', textAlign: 'center' }}>
                            <h3 className="modal-title" style={{ marginBottom: '10px' }}>Clear Old Messages?</h3>
                            <p style={{ marginBottom: '20px', opacity: 0.8 }}>Are you sure you want to clear old messages?</p>
                            <div className="modal-actions" style={{ justifyContent: 'center' }}>
                                <button className="btn btn-secondary" onClick={() => setShowClearConfirm(false)}>Cancel</button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleClearChat}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '350px', textAlign: 'center' }}>
                            <h3 className="modal-title" style={{ color: '#e74c3c', marginBottom: '10px' }}>Delete Entire Chat?</h3>
                            <p style={{ marginBottom: '20px', opacity: 0.8 }}>Are you sure you want to delete the whole chat?</p>
                            <div className="modal-actions" style={{ justifyContent: 'center' }}>
                                <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleDeleteChat}
                                    style={{ backgroundColor: '#e74c3c', boxShadow: '0 4px 12px rgba(231, 76, 60, 0.4)' }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default Chat;