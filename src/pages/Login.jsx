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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', zIndex: 0 }}
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', zIndex: 0 }}
            />

            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                style={{ marginBottom: '40px', zIndex: 1 }}
            >
                {/* Custom Chai-in Icon */}
                <div style={{ 
                    position: 'relative', 
                    width: '120px', 
                    height: '120px', 
                    margin: '0 auto',
                    background: 'white',
                    borderRadius: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    marginBottom: '24px'
                }}>
                    <Coffee size={60} color="#EF2A39" strokeWidth={2} />
                </div>
                <h1 style={{ 
                    marginTop: '20px', 
                    fontSize: '3rem', 
                    fontWeight: '900', 
                    color: 'white', 
                    letterSpacing: '-2px',
                    textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    marginBottom: '8px'
                }}>Chai-in</h1>
                <p style={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    fontSize: '1.2rem', 
                    fontWeight: '600',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
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
                        padding: '20px',
                        borderRadius: '24px',
                        background: 'white',
                        color: '#764ba2',
                        border: 'none',
                        fontSize: '1.2rem',
                        fontWeight: '800',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
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
                            <Coffee size={24} color="#764ba2" />
                        </motion.div>
                    ) : (
                        <>
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="24" alt="Google" />
                            Sign in with Google
                        </>
                    )}
                </motion.button>

                <div style={{ 
                    marginTop: '32px', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '24px',
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '0.9rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={16} />
                        <span>Discover</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Star size={16} />
                        <span>Rate</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Heart size={16} />
                        <span>Share</span>
                    </div>
                </div>
                
                <p style={{ 
                    marginTop: '24px', 
                    color: 'rgba(255,255,255,0.7)', 
                    fontSize: '0.85rem', 
                    lineHeight: '1.5',
                    fontStyle: 'italic'
                }}>
                    Join thousands of foodies exploring Kerala's hidden gems
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
