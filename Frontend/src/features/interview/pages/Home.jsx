import React, { useState, useRef } from 'react';
import "../style/home.scss";
import { useInterview } from '../hooks/useInterview.js';
import { useNavigate } from 'react-router';

const Home = () => {
    const { loading, generateReport } = useInterview();
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const [selectedFileName, setSelectedFileName] = useState("");
    const resumeInputRef = useRef();
    const navigate = useNavigate();

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0];
        if (!resumeFile && !selfDescription.trim()) {
            alert("Please provide either a Resume or a Quick Self-Description.");
            return;
        }
        const data = await generateReport({ jobDescription, selfDescription, resumeFile });
        if (data) {
            navigate(`/interview/${data._id}`);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setSelectedFileName(e.target.files[0].name);
        } else {
            setSelectedFileName("");
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

    return (
        <div className='home-page-gemini'>
            <div className="welcome-header">
                <h2>Hello, <span className="gradient-text">I'm InterviewIQ</span></h2>
                <p>How can I help you prepare for your next big opportunity?</p>
            </div>

            <div className="prompt-container">
                <div className="prompt-card">
                    <div className="prompt-fields">
                        <div className="field-group">
                            <label>Target Job Description <span className="req">*</span></label>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the job description here..."
                            />
                        </div>
                        
                        <div className="split-fields">
                            <div className="field-group">
                                <label>Upload Resume</label>
                                <label className="file-upload-box">
                                    <input ref={resumeInputRef} onChange={handleFileChange} type='file' accept='.pdf' hidden />
                                    <span>{selectedFileName ? selectedFileName : "Click to select a PDF"}</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                                </label>
                            </div>

                            <div className="or-divider">OR</div>

                            <div className="field-group">
                                <label>Quick Self-Description</label>
                                <textarea
                                    value={selfDescription}
                                    onChange={(e) => setSelfDescription(e.target.value)}
                                    placeholder="I have 3 years of experience in..."
                                    className="short-textarea"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="prompt-actions">
                        <button className="submit-prompt-btn" onClick={handleGenerateReport} disabled={!jobDescription.trim() || (!selectedFileName && !selfDescription.trim())}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;