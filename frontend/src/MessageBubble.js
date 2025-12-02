import React from 'react';
import { IconReply, IconReact, IconForward, IconDelete } from './Icons';
import './MessageBubble.css';

function MessageBubble({ message, isOwnMessage, senderName, avatar }) {
    return (
        <div className={`message-wrapper ${isOwnMessage ? 'sent' : 'received'}`}>
            <img
                src={avatar || 'https://via.placeholder.com/32'}
                alt={senderName}
                className="message-avatar"
                title={senderName}
            />

            <div className="message-content-group">
                <div className="message-actions">
                    <button className="action-btn" title="Reply">
                        <IconReply className="icon-xs" />
                    </button>
                    <button className="action-btn" title="React">
                        <IconReact className="icon-xs" />
                    </button>
                    <button className="action-btn" title="Forward">
                        <IconForward className="icon-xs" />
                    </button>
                    <button className="action-btn" title="Delete">
                        <IconDelete className="icon-xs" />
                    </button>
                </div>

                <div className="message-bubble">
                    {message.decryptedText}
                    {!message.isDecrypted && (
                        <span style={{ fontSize: '12px', opacity: 0.7, display: 'block' }}>
                            🔒 Decryption failed
                        </span>
                    )}
                </div>

                <span className="message-timestamp">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </div>
    );
}

export default MessageBubble;
