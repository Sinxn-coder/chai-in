import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, Sparkles, LayoutDashboard, Database, Activity, AlertCircle } from 'lucide-react';
import { supabase } from './supabase';

const ADMIN_EMAIL = 'bytspot.in@gmail.com';

const AdminLoginPage = ({ onLogin }) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if we just returned from a sign-in attempt
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                if (session.user.email === ADMIN_EMAIL) {
                    onLogin();
                } else {
                    setError('Access Denied: You do not have administrative privileges.');
                    await supabase.auth.signOut();
                }
            }
        };
        checkUser();
    }, [onLogin]);

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            setError(null);

            // Dynamically use the current origin to prevent lowercase/uppercase mismatches
            const redirectTo = `${window.location.origin}/chai-in/`;

            console.log('Initiating Google Sign-in, redirecting to:', redirectTo);

            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectTo,
                    queryParams: {
                        prompt: 'select_account'
                    }
                }
            });
            if (error) throw error;
        } catch (err) {
            console.error('Sign-in error:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="split-login-container">
            {/* LEFT SECTION: Visual Hero */}
            <div className="login-visual-panel">
                <div className="panel-overlay"></div>
                <div className="panel-content">
                    <div className="brand-header">
                        <div className="brand-icon-glass">
                            <span className="emoji">🍵</span>
                        </div>
                        <div className="brand-text">
                            <h1>BytSpot</h1>
                            <span className="sub">Executive Console</span>
                        </div>
                    </div>

                    <div className="hero-message">
                        <h2>Command the <br /><span>Ecosystem.</span></h2>
                        <p>The centralized hub for moderating content, analyzing growth, and controlling the BytSpot network from a single executive interface.</p>
                    </div>

                    <div className="feature-grid">
                        <div className="feature-item">
                            <LayoutDashboard size={20} />
                            <span>Real-time Analytics</span>
                        </div>
                        <div className="feature-item">
                            <Database size={20} />
                            <span>Global Database</span>
                        </div>
                        <div className="feature-item">
                            <Activity size={20} />
                            <span>Live Monitoring</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SECTION: Auth Form */}
            <div className="login-form-panel">
                <div className="form-inner">
                    <div className="form-head">
                        <div className="shield-box">
                            <ShieldCheck size={32} />
                        </div>
                        <h2>Admin Portal</h2>
                        <p>Identity verification required for command access.</p>
                    </div>

                    {error && (
                        <div className="login-error-alert">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="auth-actions">
                        <button
                            className={`ultra-google-btn ${loading ? 'loading' : ''}`}
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                        >
                            <div className="btn-left">
                                <div className="g-icon-wrapper">
                                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                                </div>
                                <span>{loading ? 'Authenticating...' : 'Continue with Google'}</span>
                            </div>
                            <div className="btn-right">
                                <ArrowRight size={20} />
                            </div>
                        </button>
                    </div>

                    <div className="portal-notice">
                        <Sparkles size={14} className="sparkle-icon" />
                        <span>Encrypted Terminal v2.5.0 Professional</span>
                    </div>
                </div>

                <div className="form-footer">
                    <p>© 2026 BytSpot Global • Authorized Personnel Only</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
