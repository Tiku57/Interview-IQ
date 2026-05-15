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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
