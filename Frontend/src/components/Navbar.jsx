import React from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useNavigate } from 'react-router';

const Navbar = ({ onToggleSidebar, sidebarOpen }) => {
    const { handleLogout } = useAuth();
    const navigate = useNavigate();

    const onLogout = async () => {
        await handleLogout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar__left">
                {/* Hamburger for mobile */}
                {onToggleSidebar && (
                    <button
                        className="hamburger-btn"
                        onClick={onToggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {sidebarOpen
                                ? <path d="M18 6L6 18M6 6l12 12"/>
                                : <path d="M3 12h18M3 6h18M3 18h18"/>
                            }
                        </svg>
                    </button>
                )}
                <div className="navbar__logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 20h20L12 2z" fill="url(#grad)" stroke="none"/>
                        <path d="M13 8l-4 6h3v4l4-6h-3v-4z" fill="yellow"/>
                        <defs>
                            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#63b3ed', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#9f7aea', stopOpacity: 1 }} />
                            </linearGradient>
                        </defs>
                    </svg>
                    <span>InterviewIQ</span>
                </div>
            </div>
            <div className="navbar__actions">
                <button className="logout-btn" onClick={onLogout}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
