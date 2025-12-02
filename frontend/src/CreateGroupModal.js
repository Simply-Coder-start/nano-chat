import React, { useState } from 'react';
import { IconClose, IconCheck } from './Icons';
import './CreateGroupModal.css';

function CreateGroupModal({ contacts, onClose, onCreate }) {
    const [groupName, setGroupName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [error, setError] = useState('');

    const toggleMember = (contactId) => {
        setSelectedMembers(prev =>
            prev.includes(contactId)
                ? prev.filter(id => id !== contactId)
                : [...prev, contactId]
        );
    };

    const handleCreate = () => {
        if (!groupName.trim()) {
            setError('Please enter a group name');
            return;
        }
        if (selectedMembers.length === 0) {
            setError('Please select at least one member');
            return;
        }

        const selectedContacts = contacts.filter(c => selectedMembers.includes(c.id));
        onCreate({
            name: groupName,
            members: selectedContacts,
            isGroup: true
        });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content create-group-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create New Group</h2>
                    <button className="close-btn" onClick={onClose}>
                        <IconClose className="icon-sm" />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="input-group">
                        <label>Group Name</label>
                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Enter group name"
                            autoFocus
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="members-section">
                        <h3>Select Members ({selectedMembers.length} selected)</h3>
                        <div className="members-list">
                            {contacts.filter(c => c.id !== 1).map(contact => (
                                <div
                                    key={contact.id}
                                    className={`member-item ${selectedMembers.includes(contact.id) ? 'selected' : ''}`}
                                    onClick={() => toggleMember(contact.id)}
                                >
                                    <img
                                        src={contact.avatar || `https://ui-avatars.com/api/?name=${contact.name}&background=random`}
                                        alt={contact.name}
                                        className="member-avatar"
                                    />
                                    <div className="member-info">
                                        <span className="member-name">{contact.name}</span>
                                        <span className="member-status">{contact.status}</span>
                                    </div>
                                    {selectedMembers.includes(contact.id) && (
                                        <IconCheck className="check-icon" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleCreate}>
                        Create Group
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateGroupModal;
