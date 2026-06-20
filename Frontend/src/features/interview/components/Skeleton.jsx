import React from 'react';
import '../style/skeleton.scss';

export const Skeleton = ({ className, ...props }) => {
    return (
        <div className={`skeleton ${className || ''}`} {...props} />
    );
};

export const InterviewSkeleton = () => {
    return (
        <div className='interview-page'>
            <div className='interview-layout'>
                {/* Nav Skeleton */}
                <nav className='interview-nav'>
                    <div className="nav-content">
                        <Skeleton className="skeleton-text skeleton-nav-title" />
                        <Skeleton className="skeleton-btn" />
                        <Skeleton className="skeleton-btn" />
                        <Skeleton className="skeleton-btn" />
                    </div>
                </nav>

                <div className='interview-divider' />

                {/* Content Skeleton */}
                <main className='interview-content'>
                    <section>
                        <div className='content-header'>
                            <Skeleton className="skeleton-title" />
                            <Skeleton className="skeleton-badge" />
                        </div>
                        <div className='q-list'>
                            <Skeleton className="skeleton-card" />
                            <Skeleton className="skeleton-card" />
                            <Skeleton className="skeleton-card" />
                        </div>
                    </section>
                </main>

                <div className='interview-divider' />

                {/* Sidebar Skeleton */}
                <aside className='interview-sidebar'>
                    <div className='match-score'>
                        <Skeleton className="skeleton-text skeleton-score-label" />
                        <div className="match-score__ring score--mid" style={{ border: '4px solid #e5e7eb' }}>
                            <Skeleton className="skeleton-circle" />
                        </div>
                    </div>
                    <div className='sidebar-divider' />
                    <div className='skill-gaps'>
                        <Skeleton className="skeleton-text skeleton-score-label" />
                        <div className='skill-gaps__list'>
                            <Skeleton className="skeleton-tag" />
                            <Skeleton className="skeleton-tag" />
                            <Skeleton className="skeleton-tag" />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};
