import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Sparkles, MapPin, Star, Users, TrendingUp, ArrowRight, Heart, Navigation } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleDiscover = () => {
        navigate('/login');
    };

    const features = [
        {
            icon: <MapPin size={24} />,
            title: "Discover Spots",
            description: "Find amazing food spots near you",
            color: "#ef4444"
        },
        {
            icon: <Star size={24} />,
            title: "Share Reviews",
            description: "Help others with your experiences",
            color: "#f59e0b"
        },
        {
            icon: <Users size={24} />,
            title: "Join Community",
            description: "Connect with food lovers",
            color: "#10b981"
        },
        {
            icon: <TrendingUp size={24} />,
            title: "Track Visits",
            description: "Keep a record of your food journey",
            color: "#8b5cf6"
        }
    ];

    const stats = [
        { number: "500+", label: "Food Spots" },
        { number: "10K+", label: "Happy Users" },
        { number: "50K+", label: "Reviews" },
        { number: "100+", label: "Daily Visits" }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Background Elements */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none'
            }}>
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ 
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            scale: 0
                        }}
                        animate={{
                            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                            y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                            scale: [0, 1, 0],
                            rotate: [0, 360]
                        }}
                        transition={{
                            duration: 10 + Math.random() * 10,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{
                            position: 'absolute',
                            width: 20 + Math.random() * 30,
                            height: 20 + Math.random() * 30,
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '50%',
                            border: '2px solid rgba(255, 255, 255, 0.2)'
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '40px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{
                        textAlign: 'center',
                        marginBottom: '60px',
                        marginTop: '60px'
                    }}
                >
                    {/* Logo Animation */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        style={{
                            width: '120px',
                            height: '120px',
                            background: 'white',
                            borderRadius: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 30px',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Coffee size={60} color="#f59e0b" strokeWidth={2.5} />
                        </motion.div>
                        
                        {/* Sparkle Effects */}
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.7,
                                    ease: "easeInOut"
                                }}
                                style={{
                                    position: 'absolute',
                                    top: 20 + i * 30,
                                    right: 20 + i * 10
                                }}
                            >
                                <Sparkles size={16} color="#fbbf24" />
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        style={{
                            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                            fontWeight: '900',
                            margin: '0 0 20px 0',
                            background: 'linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #f59e0b 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
                            lineHeight: '1.1'
                        }}
                    >
                        Chai.in
                    </motion.h1>

                    {/* Tagline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        style={{
                            fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                            fontWeight: '600',
                            color: '#7c2d12',
                            margin: '0 0 40px 0',
                            maxWidth: '600px',
                            lineHeight: '1.4'
                        }}
                    >
                        Discover the best food spots in Kerala 🌶️
                        <br />
                        Share your experiences with the community
                    </motion.p>

                    {/* Discover Button */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDiscover}
                        style={{
                            background: 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '18px 48px',
                            borderRadius: '50px',
                            fontSize: '1.2rem',
                            fontWeight: '800',
                            cursor: 'pointer',
                            boxShadow: '0 10px 30px rgba(220, 38, 38, 0.3)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            Discover Now
                        </motion.span>
                        <ArrowRight size={24} />
                        
                        {/* Button Shine Effect */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '200%' }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                transform: 'skewX(-20deg)'
                            }}
                        />
                    </motion.button>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '30px',
                        width: '100%',
                        maxWidth: '800px',
                        marginBottom: '60px'
                    }}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.05 }}
                            style={{
                                background: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)',
                                padding: '30px 20px',
                                borderRadius: '20px',
                                textAlign: 'center',
                                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.3)'
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                                style={{
                                    fontSize: '2.5rem',
                                    fontWeight: '900',
                                    color: '#dc2626',
                                    marginBottom: '10px'
                                }}
                            >
                                {stat.number}
                            </motion.div>
                            <div style={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                color: '#7c2d12'
                            }}>
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Features Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.6 }}
                    style={{
                        width: '100%',
                        maxWidth: '1000px',
                        marginBottom: '60px'
                    }}
                >
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.8 }}
                        style={{
                            fontSize: '2.5rem',
                            fontWeight: '900',
                            textAlign: 'center',
                            marginBottom: '50px',
                            color: '#7c2d12'
                        }}
                    >
                        Why Choose Chai.in?
                    </motion.h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '30px'
                    }}>
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 2 + index * 0.1 }}
                                whileHover={{ y: -10, scale: 1.05 }}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(10px)',
                                    padding: '30px',
                                    borderRadius: '20px',
                                    textAlign: 'center',
                                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    cursor: 'pointer'
                                }}
                            >
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        background: feature.color,
                                        borderRadius: '15px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 20px',
                                        color: 'white'
                                    }}
                                >
                                    {feature.icon}
                                </motion.div>
                                <h3 style={{
                                    fontSize: '1.3rem',
                                    fontWeight: '800',
                                    margin: '0 0 15px 0',
                                    color: '#1f2937'
                                }}>
                                    {feature.title}
                                </h3>
                                <p style={{
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    color: '#6b7280',
                                    margin: 0,
                                    lineHeight: '1.5'
                                }}>
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Footer CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 2.4 }}
                    style={{
                        textAlign: 'center',
                        marginTop: '40px'
                    }}
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDiscover}
                        style={{
                            background: 'white',
                            color: '#dc2626',
                            border: '2px solid #dc2626',
                            padding: '16px 40px',
                            borderRadius: '50px',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            boxShadow: '0 5px 20px rgba(220, 38, 38, 0.2)'
                        }}
                    >
                        Start Your Food Journey 🚀
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};

export default LandingPage;
