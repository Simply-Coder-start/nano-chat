import React from 'react';

function ContactItem({ contact, isActive, onClick, onContextMenu }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'online': return '#2ecc71';
            case 'offline': return '#95a5a6';
            case 'invisible': return '#f1c40f';
            default: return '#95a5a6';
        }
    };

    return (
        <div
            className={`contact-item ${isActive ? 'active' : ''}`}
            onClick={onClick}
            onContextMenu={(e) => {
                e.preventDefault();
                onContextMenu && onContextMenu(e, contact);
            }}
        >
            <div className="contact-avatar-wrapper">
                <img
                    src={contact.avatar || 'https://via.placeholder.com/48'}
                    alt={contact.name}
                    className="contact-avatar"
                />
                <span
                    className="contact-status-dot"
                    style={{ backgroundColor: getStatusColor(contact.status) }}
                />
            </div>

            <div className="contact-info">
                <div className="contact-header">
                    <span className="contact-name">{contact.name}</span>
                    {contact.lastMessageTime && (
                        <span className="contact-time">
                            {new Date(contact.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                </div>
                <span className="contact-preview">
                    {contact.lastMessage || 'No messages yet'}
                </span>
            </div>
        </div>
    );
}

export default ContactItem;
