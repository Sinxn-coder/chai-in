import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ size = 40, showText = true, color = "var(--primary)" }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <motion.img
                src="./chai_icon.png"
                alt="Chai-in Logo"
                style={{ 
                    width: size, 
                    height: size,
                    objectFit: 'contain'
                }}
                animate={{ 
                    opacity: [0.9, 1, 0.9]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                onError={(e) => { 
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                        <svg width=${size} height=${size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 12C10 9.79086 11.7909 8 14 8H26C28.2091 8 30 9.79086 30 12V22C30 27.5228 25.5228 32 20 32C14.4772 32 10 27.5228 10 22V12Z" fill=${color} stroke="white" strokeWidth="2" />
                            <path d="M30 14H32C34.2091 14 36 15.7909 36 18V20C36 22.2091 34.2091 24 32 24H30" stroke=${color} strokeWidth="3" strokeLinecap="round" />
                            <path d="M18 4V6" stroke=${color} strokeWidth="2" strokeLinecap="round" />
                            <path d="M22 3V5" stroke=${color} strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    `;
                }}
            />

            {showText && (
                <h1 
                    style={{
                        fontSize: `${size * 0.6}px`,
                        fontWeight: '800',
                        color: color,
                        margin: 0,
                        lineHeight: 1,
                        letterSpacing: '-1px'
                    }}
                >
                    Chai.in
                </h1>
            )}
        </div>
    );
};

export default Logo;
