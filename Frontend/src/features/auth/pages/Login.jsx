import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            await handleLogin({ email, password })
            navigate('/')
        } catch (err) {
            setError("Invalid email or password. Please try again.")
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
                        <h1>Welcome back</h1>
                        <p>Sign in to continue your interview prep</p>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
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
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <button className="button primary-button" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Don't have an account? <Link to="/register">Create one</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}

export default Login