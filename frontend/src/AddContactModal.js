import React, { useState } from 'react';
import './AddContactModal.css';

function AddContactModal({ onClose, onAdd }) {
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Name is required');
            return;
        }

        onAdd({
            id: Date.now(),
            name: name.trim(),
            note: note.trim(),
            avatar: `https://ui-avatars.com/api/?name=${name}&background=random`,
            status: 'offline',
            lastMessage: '',
            lastMessageTime: null
        });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">Add New Contact</h3>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Contact Name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError('');
                            }}
                            autoFocus
                        />
                        {error && <span style={{ color: '#e74c3c', fontSize: '12px' }}>{error}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Note (Optional)</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Short note about this person"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Add Contact</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddContactModal;
