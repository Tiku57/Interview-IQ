import React, { useState, useRef } from 'react';
import "../style/home.scss";
import { useInterview } from '../hooks/useInterview.js';
import { useNavigate } from 'react-router';

const Home = () => {
    const { loading, generateReport } = useInterview();
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();

    const handleGenerateReport = async () => {
        if (!selectedFile && !selfDescription.trim()) {
            alert("Please provide either a Resume or a Quick Self-Description.");
            return;
        }
        const data = await generateReport({ jobDescription, selfDescription, resumeFile: selectedFile });
        if (data) {
            navigate(`/interview/${data._id}`);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    if (loading) {
        return (
            <main className='loading-screen'>
                <div className="loader-container">
                    <div className="gemini-loader"></div>
                    <p>Generating your interview strategy...</p>
                </div>
            </main>
        );
    }

    const canSubmit = jobDescription.trim() && (selectedFile || selfDescription.trim());

    return (
        <div className='home-page-gemini'>
            <div className="welcome-header">
                <h2>Hello, <span className="gradient-text">I'm InterviewIQ</span></h2>
                <p>How can I help you prepare for your next big opportunity?</p>
            </div>

            <div className="prompt-container">
                <div className="prompt-card">
                    <div className="prompt-fields">

                        {/* ── Job Description ── */}
                        <div className="field-group">
                            <div className="field-label">
                                Target Job Description <span className="req">*</span>
                            </div>
                            <textarea
                                className="main-textarea"
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the job description here..."
                            />
                        </div>

                        <div className="section-divider" />

                        {/* ── Upload Resume | OR | Self-Description ── */}
                        <div className="split-fields">

                            {/* Upload Resume */}
                            <div className="split-col">
                                <div className="field-label">Upload Resume</div>
                                <div className="field-inner">
                                    <label className={`file-upload-box ${selectedFile ? 'has-file' : ''}`}>
                                        <input
                                            onChange={handleFileChange}
                                            type='file'
                                            accept='.pdf'
                                            hidden
                                        />
                                        <div className="file-upload-text">
                                            <span>
                                                {selectedFile ? selectedFile.name : "Click to select a PDF"}
                                            </span>
                                            {!selectedFile && <small>Supported: PDF only</small>}
                                        </div>
                                        <div className="file-upload-icon">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                                            </svg>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* OR divider */}
                            <div className="or-divider">OR</div>

                            {/* Quick Self-Description */}
                            <div className="split-col">
                                <div className="field-label">Quick Self-Description</div>
                                <div className="field-inner">
                                    <textarea
                                        className="short-textarea"
                                        value={selfDescription}
                                        onChange={(e) => setSelfDescription(e.target.value)}
                                        placeholder="I have 3 years of experience in..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Submit ── */}
                    <div className="prompt-actions">
                        {!canSubmit && (
                            <span className="char-hint">Fill in the job description and resume or self-description</span>
                        )}
                        <button
                            className="submit-prompt-btn"
                            onClick={handleGenerateReport}
                            disabled={!canSubmit}
                            title="Generate Interview Plan"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <line x1="22" y1="2" x2="11" y2="13"/>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;