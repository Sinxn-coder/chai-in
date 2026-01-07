import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

const Login = () => {
    const { signInWithGoogle, user, loading } = useAuth();
    const navigate = useNavigate();
    const [loginLoading, setLoginLoading] = useState(false);

    useEffect(() => {
        if (user) {
            console.log('User logged in, redirecting to home:', user);
            navigate('/en/home');
        }
    }, [user, navigate]);

    const handleLogin = async () => {
        setLoginLoading(true);
        try {
            console.log('Starting Google sign in...');
            await signInWithGoogle();
            console.log('Google sign in initiated');
        } catch (error) {
            console.error('Login error:', error);
            setLoginLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'var(--bg-white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-white)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'center'
        }}>

            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                style={{ marginBottom: '40px' }}
            >
                <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
                    <img
                        src="./chai_logo.png"
                        alt="Chai-in Logo"
                        style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                        onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Chai-in&background=EF2A39&color=fff&rounded=true' }}
                    />
                </div>
                <h1 style={{ marginTop: '20px', fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '-1px' }}>Chai-in</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '600' }}>Discover Kerala's Best Eats</p>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ width: '100%', maxWidth: '350px' }}
            >
                <button
                    onClick={handleLogin}
                    disabled={loginLoading}
                    style={{
                        width: '100%',
                        padding: '18px',
                        borderRadius: '24px',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        fontSize: '1.1rem',
                        fontWeight: '800',
                        boxShadow: 'var(--shadow-lg)',
                        cursor: loginLoading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px'
                    }}
                >
                    {loginLoading ? 'Connecting...' : (
                        <>
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" alt="Google" />
                            Sign in with Google
                        </>
                    )}
                </button>

                <p style={{ marginTop: '24px', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    By continuing, you agree to discover the most delicious spots in Kerala.
                </p>
            </motion.div>

            {/* Decor Circles */}
            <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(239, 42, 57, 0.05)', zIndex: -1 }} />
            <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(239, 42, 57, 0.05)', zIndex: -1 }} />
        </div>
    );
};

export default Login;
