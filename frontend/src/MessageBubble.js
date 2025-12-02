import React from 'react';
import { IconReply, IconReact, IconForward, IconDelete } from './Icons';
import './MessageBubble.css';

function MessageBubble({ message, isOwnMessage, senderName, avatar }) {
    const [showMenu, setShowMenu] = React.useState(false);
    const [menuPosition, setMenuPosition] = React.useState({});
    const bubbleRef = React.useRef(null);
    const longPressTimer = React.useRef(null);

    const handleContextMenu = (e) => {
        e.preventDefault();
        openMenu();
    };

    const openMenu = () => {
        if (!bubbleRef.current) return;
        const rect = bubbleRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceAbove = rect.top;
        const spaceBelow = viewportHeight - rect.bottom;
        const menuHeight = 50; // Approx height

        let pos = {};

        // Horizontal clamping
        let left = rect.left;
        if (isOwnMessage) {
            left = rect.right - 150; // Align right edge approx
        }
        // Clamp to screen edges
        left = Math.max(10, Math.min(left, window.innerWidth - 160));
        pos.left = `${left}px`;

        // Vertical placement (prefer top, flip to bottom if not enough space)
        if (spaceAbove > menuHeight + 10) {
            pos.top = `${rect.top - menuHeight - 5}px`;
        } else {
            pos.top = `${rect.bottom + 5}px`;
        }

        setMenuPosition(pos);
        setShowMenu(true);
    };

    const handleTouchStart = () => {
        longPressTimer.current = setTimeout(() => {
            openMenu();
        }, 500); // 500ms long press
    };

    const handleTouchEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
    };

    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (e) => {
            if (showMenu && bubbleRef.current && !bubbleRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showMenu]);

    return (
        <div
            className={`message-wrapper ${isOwnMessage ? 'sent' : 'received'}`}
            onMouseEnter={openMenu}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onContextMenu={handleContextMenu}
        >
            <img
                src={avatar || 'https://via.placeholder.com/32'}
                alt={senderName}
                className="message-avatar"
                title={senderName}
            />

            <div className="message-content-group" ref={bubbleRef}>
                {showMenu && (
                    <div className="message-actions fixed-menu" style={menuPosition}>
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
                )}

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
