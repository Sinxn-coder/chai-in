import React from 'react';
import { ArrowLeft, Lock, Mail } from 'lucide-react';

const AdminLoginPage = ({ onBack, onLogin }) => {
    const handleGoogleSignIn = () => {
        console.log('Google Sign-in clicked');
        // Simulate navigation to Google auth or show a message
        if (onLogin) {
            onLogin();
        }
    };

    return (
        <div className="admin-login-container">
            <button className="back-btn" onClick={onBack}>
                <ArrowLeft size={24} />
            </button>

            <div className="login-card">
                <div className="lock-icon">
                    <Lock size={40} />
                </div>

                <h2>Admin Access</h2>
                <p>Authorized personnel only. Please sign in to continue to the dashboard.</p>

                <button className="google-signin-btn" onClick={handleGoogleSignIn}>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                    <span>Sign in with Google</span>
                </button>

                <div className="divider">
                    <span>or stay as user</span>
                </div>

                <button className="guest-btn" onClick={onBack}>
                    Explore App
                </button>
            </div>

            <div className="login-footer">
                <p>&copy; 2026 BytSpot Admin Panel v1.0</p>
            </div>
        </div>
    );
};

export default AdminLoginPage;
