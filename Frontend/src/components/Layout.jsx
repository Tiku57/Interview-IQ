import React, { useState, useRef, useCallback, useEffect } from 'react';
import Navbar from './Navbar';
import './layout.scss';
import { useInterview } from '../features/auth/../interview/hooks/useInterview';
import { useNavigate } from 'react-router';

const MIN_SIDEBAR = 180;
const MAX_SIDEBAR = 480;
const DEFAULT_SIDEBAR = 280;

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR);
    const [isResizing, setIsResizing] = useState(false);
    const { reports } = useInterview();
    const navigate = useNavigate();
    const resizeRef = useRef(null);

    const startResize = useCallback((e) => {
        e.preventDefault();
        setIsResizing(true);
    }, []);

    useEffect(() => {
        const onMouseMove = (e) => {
            if (!isResizing) return;
            const newWidth = e.clientX;
            if (newWidth >= MIN_SIDEBAR && newWidth <= MAX_SIDEBAR) {
                setSidebarWidth(newWidth);
            }
        };
        const onMouseUp = () => setIsResizing(false);

        if (isResizing) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [isResizing]);

    return (
        <div className="app-layout" style={{ userSelect: isResizing ? 'none' : 'auto' }}>
            <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
            <div className="app-body">
                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
                )}

                {/* Left sidebar */}
                <aside
                    className={`sidebar ${sidebarOpen ? 'open' : ''}`}
                    style={{ width: sidebarWidth }}
                >
                    <div className="sidebar__new-chat">
                        <button className="new-chat-pill" onClick={() => { navigate('/'); setSidebarOpen(false); }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            New Chat
                        </button>
                    </div>
                    <div className="sidebar__header">
                        <h3>Recent Plans</h3>
                    </div>
                    <ul className="history-list">
                        {reports?.map(report => (
                            <li key={report._id} onClick={() => { navigate(`/interview/${report._id}`); setSidebarOpen(false); }}>
                                <span>{report.title || 'Untitled'}</span>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Resize Handle */}
                <div
                    ref={resizeRef}
                    className={`resize-handle ${isResizing ? 'resize-handle--active' : ''}`}
                    onMouseDown={startResize}
                    title="Drag to resize"
                />

                {/* Main content */}
                <main className="main-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
