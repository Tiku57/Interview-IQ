import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import "../auth.form.scss"

const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { loading, handleRegister } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            await handleRegister({ username, email, password })
            navigate("/")
        } catch (err) {
            setError("Registration failed. Please try again.")
        }
    }

    return (
        <div className="auth-page">
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar__logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>InterviewIQ</span>
                </div>
            </nav>

            {/* Form area */}
            <main className="auth-main">
                <div className="auth-glow auth-glow--left" />
                <div className="auth-glow auth-glow--right" />

                <div className="form-container">
                    <div className="form-header">
                        <h1>Create account</h1>
                        <p>Start your AI-powered interview preparation</p>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input
                                onChange={(e) => setUsername(e.target.value)}
                                type="text" id="username" name="username"
                                placeholder="Choose a username"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                type="email" id="email" name="email"
                                placeholder="Enter your email address"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                type="password" id="password" name="password"
                                placeholder="Create a password"
                                required
                            />
                        </div>
                        <button className="button primary-button" disabled={loading}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}

export default Register