import React, { useState, useRef, useEffect } from 'react';
import ContactItem from './ContactItem';
import { IconSearch, IconPlus, IconUsers } from './Icons';
import './Sidebar.css';

function Sidebar({ contacts, selectedContactId, onSelectContact, onAddContact, onAddFromContacts, isOpen }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showGroupMenu, setShowGroupMenu] = useState(false);
    const groupMenuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (groupMenuRef.current && !groupMenuRef.current.contains(event.target)) {
                setShowGroupMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

            <div className="group-btn-container" ref={groupMenuRef}>
                <button
                    className="add-contact-btn create-group-btn"
                    onClick={() => setShowGroupMenu(!showGroupMenu)}
                >
                    <IconUsers className="icon-sm" /> <span>Create Group</span>
                </button>

                {showGroupMenu && (
                    <div className="group-menu">
                        <button onClick={() => { onAddContact(); setShowGroupMenu(false); }}>
                            Add contact
                        </button>
                        <button onClick={() => { onAddFromContacts(); setShowGroupMenu(false); }}>
                            Add member from existing contacts
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Sidebar;
