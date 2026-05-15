import React, { useState } from 'react';
import Navbar from './Navbar';
import './layout.scss';
import { useInterview } from '../features/auth/../interview/hooks/useInterview';
import { useNavigate } from 'react-router';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { reports } = useInterview();
    const navigate = useNavigate();

    return (
        <div className="app-layout">
            <Navbar />
            <div className="app-body">
                <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                    <div className="sidebar__new-chat">
                        <button className="new-chat-pill" onClick={() => navigate('/')}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            New Chat
                        </button>
                    </div>
                    <div className="sidebar__header">
                        <h3>Recent Plans</h3>
                    </div>
                    <ul className="history-list">
                        {reports?.map(report => (
                            <li key={report._id} onClick={() => navigate(`/interview/${report._id}`)}>
                                <span>{report.title || 'Untitled'}</span>
                            </li>
                        ))}
                    </ul>
                </aside>
                <main className="main-content">
                    <button className="toggle-sidebar" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
                    </button>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
