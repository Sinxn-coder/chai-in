import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ type = 'card' }) => {
    if (type === 'card') {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="skeleton-card"
                style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '16px',
                    boxShadow: 'var(--shadow-sm)',
                    height: '280px'
                }}
            >
                <div style={{
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                    borderRadius: '12px',
                    height: '140px',
                    marginBottom: '12px'
                }} />
                <div style={{
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                    borderRadius: '8px',
                    height: '20px',
                    width: '80%',
                    marginBottom: '8px'
                }} />
                <div style={{
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                    borderRadius: '6px',
                    height: '16px',
                    width: '60%',
                    marginBottom: '8px'
                }} />
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '12px'
                }}>
                    <div style={{
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                        borderRadius: '12px',
                        height: '24px',
                        width: '60px'
                    }} />
                    <div style={{
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                        borderRadius: '12px',
                        height: '24px',
                        width: '40px'
                    }} />
                </div>
            </motion.div>
        );
    }

    if (type === 'list') {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="skeleton-list"
                style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                }}
            >
                <div style={{
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                    borderRadius: '8px',
                    height: '60px',
                    width: '60px',
                    flexShrink: 0
                }} />
                <div style={{ flex: 1 }}>
                    <div style={{
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                        borderRadius: '6px',
                        height: '18px',
                        width: '70%',
                        marginBottom: '8px'
                    }} />
                    <div style={{
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                        borderRadius: '6px',
                        height: '14px',
                        width: '50%'
                    }} />
                </div>
            </motion.div>
        );
    }

    return null;
};

// Add shimmer animation to global styles
const style = document.createElement('style');
style.textContent = `
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
`;
if (!document.head.querySelector('style[data-skeleton]')) {
    style.setAttribute('data-skeleton', 'true');
    document.head.appendChild(style);
}

export default SkeletonLoader;
