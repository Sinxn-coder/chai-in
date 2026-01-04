import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, UserCheck, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PrivacyPolicy = ({ lang }) => {
    const navigate = useNavigate();

    const sections = [
        {
            icon: Shield,
            title: "Information We Collect",
            content: "We collect information you provide directly to us, including your name, email address, profile information, and content you post on Chai.in. We also collect usage data to improve our services."
        },
        {
            icon: Lock,
            title: "How We Use Your Information",
            content: "Your information is used to provide and improve our services, personalize your experience, communicate with you, and ensure the security of our platform. We never sell your personal data to third parties."
        },
        {
            icon: Eye,
            title: "Information Sharing",
            content: "We only share your information with your consent, to comply with legal obligations, or to protect our rights. Your posts and reviews are visible to other users as part of the community experience."
        },
        {
            icon: UserCheck,
            title: "Your Rights",
            content: "You have the right to access, update, or delete your personal information at any time. You can manage your privacy settings in your account preferences."
        },
        {
            icon: FileText,
            title: "Data Security",
            content: "We implement industry-standard security measures to protect your data. All sensitive information is encrypted, and we regularly update our security practices to ensure your safety."
        }
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--secondary)', paddingBottom: '120px' }}>
            {/* Header */}
            <div style={{
                height: '180px',
                background: 'linear-gradient(135deg, var(--primary) 0%, #FF6B6B 100%)',
                borderBottomLeftRadius: '40px',
                borderBottomRightRadius: '40px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
            }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        position: 'absolute',
                        left: '20px',
                        top: '30px',
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '15px',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                >
                    <ArrowLeft size={24} />
                </button>
                <Shield size={48} color="white" style={{ marginBottom: '8px' }} />
                <h1 style={{ color: 'white', fontWeight: '900', fontSize: '1.6rem', margin: 0 }}>Privacy Policy</h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: '600' }}>Your privacy matters to us</p>
            </div>

            {/* Content */}
            <div style={{ padding: '30px 20px', maxWidth: '600px', margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: 'white',
                        padding: '24px',
                        borderRadius: '24px',
                        marginBottom: '20px',
                        boxShadow: 'var(--shadow-md)'
                    }}
                >
                    <h2 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '12px' }}>
                        Welcome to Chai.in
                    </h2>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                        At Chai.in, we are committed to protecting your privacy and ensuring the security of your personal information.
                        This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform to discover
                        and share Kerala's best food spots.
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '12px', fontStyle: 'italic' }}>
                        Last updated: January 2026
                    </p>
                </motion.div>

                {sections.map((section, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                            background: 'white',
                            padding: '20px',
                            borderRadius: '24px',
                            marginBottom: '16px',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <div style={{
                                background: 'rgba(239, 42, 57, 0.1)',
                                padding: '12px',
                                borderRadius: '16px',
                                flexShrink: 0
                            }}>
                                <section.icon size={24} color="var(--primary)" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
                                    {section.title}
                                </h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                                    {section.content}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Contact Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    style={{
                        background: 'linear-gradient(135deg, var(--primary) 0%, #FF6B6B 100%)',
                        padding: '24px',
                        borderRadius: '24px',
                        marginTop: '24px',
                        textAlign: 'center'
                    }}
                >
                    <h3 style={{ color: 'white', fontWeight: '900', fontSize: '1.1rem', marginBottom: '8px' }}>
                        Questions About Privacy?
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', marginBottom: '16px' }}>
                        If you have any questions or concerns about our privacy practices, please don't hesitate to contact us.
                    </p>
                    <button
                        onClick={() => navigate(`/${lang}/contact-admin`)}
                        style={{
                            background: 'white',
                            color: 'var(--primary)',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '16px',
                            fontWeight: '800',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                    >
                        Contact Admin
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
