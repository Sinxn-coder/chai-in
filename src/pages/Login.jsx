import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { Coffee, MapPin, Star, Heart } from 'lucide-react';

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
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>

            {/* Animated Background Elements */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(239, 42, 57, 0.05)', zIndex: 0 }}
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(239, 42, 57, 0.05)', zIndex: 0 }}
            />

            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                style={{ marginBottom: '40px', zIndex: 1 }}
            >
                {/* Animated Chai-in Icon */}
                <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    style={{ 
                        position: 'relative', 
                        width: '120px', 
                        height: '120px', 
                        margin: '0 auto',
                        background: 'white',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-lg)',
                        marginBottom: '24px',
                        border: '3px solid var(--secondary)'
                    }}
                >
                    <motion.img
                        src="./chai_icon.png"
                        alt="Chai-in Logo"
                        style={{ 
                            width: '80px', 
                            height: '80px',
                            objectFit: 'contain'
                        }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        onError={(e) => { 
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div style="font-size: 48px; color: var(--primary);">☕</div>';
                        }}
                    />
                </motion.div>
                <motion.h1 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    style={{ 
                        marginTop: '20px', 
                        fontSize: '2.5rem', 
                        fontWeight: '900', 
                        color: 'var(--primary)', 
                        letterSpacing: '-1px',
                        marginBottom: '8px'
                    }}
                >Chai-in</motion.h1>
                <p style={{ 
                    color: 'var(--text-muted)', 
                    fontSize: '1.1rem', 
                    fontWeight: '600'
                }}>Discover Kerala's Best Eats</p>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ width: '100%', maxWidth: '350px', zIndex: 1 }}
            >
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.02 }}
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
                        gap: '12px',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {loginLoading ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                            <motion.img
                                src="./chai_icon.png"
                                alt="Loading"
                                style={{ width: '24px', height: '24px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
                                onError={(e) => { 
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<div style="font-size: 24px; color: white;">☕</div>';
                                }}
                            />
                        </motion.div>
                    ) : (
                        <>
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" alt="Google" />
                            Sign in with Google
                        </>
                    )}
                </motion.button>

                <div style={{ 
                    marginTop: '32px', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '24px',
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem'
                }}>
                    <motion.div 
                        whileHover={{ scale: 1.1 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <MapPin size={16} color="var(--primary)" />
                        <span>Discover</span>
                    </motion.div>
                    <motion.div 
                        whileHover={{ scale: 1.1 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Star size={16} color="var(--primary)" />
                        <span>Rate</span>
                    </motion.div>
                    <motion.div 
                        whileHover={{ scale: 1.1 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Heart size={16} color="var(--primary)" />
                        <span>Share</span>
                    </motion.div>
                </div>
                
                <p style={{ 
                    marginTop: '24px', 
                    color: 'var(--text-muted)', 
                    fontSize: '0.9rem', 
                    lineHeight: '1.5'
                }}>
                    Join thousands of foodies exploring Kerala's hidden gems
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
