import React from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useNavigate } from 'react-router';

const Navbar = () => {
    const { handleLogout } = useAuth();
    const navigate = useNavigate();

    const onLogout = async () => {
        await handleLogout();
        navigate('/login');
    };
    
    return (
        <nav className="navbar">
            <div className="navbar__logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>InterviewIQ</span>
            </div>
            <div className="navbar__actions">
                <button className="logout-btn" onClick={onLogout}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
