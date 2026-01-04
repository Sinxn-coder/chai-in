import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, Mail, Phone, Instagram, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ContactAdmin = ({ lang }) => {
    const navigate = useNavigate();
    const [copied, setCopied] = useState('');

    const contactMethods = [
        {
            icon: Phone,
            label: "WhatsApp",
            value: "+91 9846170136",
            link: "https://wa.me/919846170136",
            color: "#25D366",
            action: "Chat on WhatsApp"
        },
        {
            icon: Instagram,
            label: "Instagram",
            value: "@sinn.a.an",
            link: "https://instagram.com/sinn.a.an",
            color: "#E4405F",
            action: "Follow on Instagram"
        },
        {
            icon: Mail,
            label: "Email",
            value: "msinankavala786@gmail.com",
            link: "mailto:msinankavala786@gmail.com",
            color: "#EA4335",
            action: "Send Email"
        }
    ];

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(''), 2000);
    };

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
                <MessageCircle size={48} color="white" style={{ marginBottom: '8px' }} />
                <h1 style={{ color: 'white', fontWeight: '900', fontSize: '1.6rem', margin: 0 }}>Contact Admin</h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: '600' }}>We're here to help!</p>
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
                        marginBottom: '24px',
                        boxShadow: 'var(--shadow-md)',
                        textAlign: 'center'
                    }}
                >
                    <h2 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '12px' }}>
                        Get in Touch
                    </h2>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                        Have questions, suggestions, or need help? Reach out to our admin team through any of the channels below.
                        We typically respond within 24 hours!
                    </p>
                </motion.div>

                {/* Contact Methods */}
                {contactMethods.map((method, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                            background: 'white',
                            padding: '20px',
                            borderRadius: '24px',
                            marginBottom: '16px',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                            <div style={{
                                background: `${method.color}15`,
                                padding: '12px',
                                borderRadius: '16px'
                            }}>
                                <method.icon size={24} color={method.color} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                    {method.label}
                                </div>
                                <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>
                                    {method.value}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <a
                                href={method.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    flex: 1,
                                    background: method.color,
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px',
                                    borderRadius: '14px',
                                    fontWeight: '800',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                <Send size={16} />
                                {method.action}
                            </a>
                            <button
                                onClick={() => copyToClipboard(method.value, method.label)}
                                style={{
                                    background: 'var(--secondary)',
                                    color: 'var(--text-main)',
                                    border: 'none',
                                    padding: '12px 16px',
                                    borderRadius: '14px',
                                    fontWeight: '700',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer'
                                }}
                            >
                                {copied === method.label ? '✓ Copied!' : 'Copy'}
                            </button>
                        </div>
                    </motion.div>
                ))}

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{
                        background: 'rgba(239, 42, 57, 0.05)',
                        padding: '20px',
                        borderRadius: '20px',
                        marginTop: '24px',
                        border: '2px dashed var(--primary)'
                    }}
                >
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>
                        💡 Quick Tips
                    </h3>
                    <ul style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
                        <li>For spot verification status, message us on WhatsApp</li>
                        <li>Report inappropriate content via email</li>
                        <li>Follow us on Instagram for updates and food stories</li>
                        <li>Business inquiries? Email is the best way to reach us</li>
                    </ul>
                </motion.div>
            </div>
        </div>
    );
};

export default ContactAdmin;
