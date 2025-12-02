import React, { useState } from 'react';
import ContactItem from './ContactItem';
import { IconSearch, IconPlus, IconUsers } from './Icons';
import './Sidebar.css';

function Sidebar({ contacts, selectedContactId, onSelectContact, onAddContact, isOpen }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contact.lastMessage && contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div className="search-container">
                    <span className="search-icon">
                        <IconSearch className="icon-xs" />
                    </span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search contacts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="contact-list">
                {filteredContacts.length > 0 ? (
                    filteredContacts.map(contact => (
                        <ContactItem
                            key={contact.id}
                            contact={contact}
                            isActive={contact.id === selectedContactId}
                            onClick={() => onSelectContact(contact)}
                            onContextMenu={(e) => console.log('Context menu for', contact.name)}
                        />
                    ))
                ) : (
                    <div style={{ padding: '20px', textAlign: 'center', opacity: 0.5, fontSize: '14px' }}>
                        {searchQuery ? 'No contacts found' : 'No contacts yet'}
                    </div>
                )}
            </div>

            <button className="add-contact-btn" onClick={onAddContact}>
                <IconPlus className="icon-sm" /> <span>Add Contact</span>
            </button>

            <button className="add-contact-btn create-group-btn" onClick={() => onAddContact('group')}>
                <IconUsers className="icon-sm" /> <span>Create Group</span>
            </button>
        </div>
    );
}

export default Sidebar;
