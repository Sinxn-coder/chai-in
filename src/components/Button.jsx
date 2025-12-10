import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
    const baseStyle = {
        padding: '12px 24px',
        borderRadius: 'var(--radius-full)',
        fontWeight: '600',
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
        boxShadow: 'var(--shadow-sm)'
    };

    const variants = {
        primary: {
            background: 'var(--primary)',
            color: '#fff',
        },
        secondary: {
            background: 'var(--secondary)',
            color: 'var(--text-main)',
        },
        outline: {
            background: 'transparent',
            border: '2px solid var(--primary)',
            color: 'var(--primary)',
        }
    };

    const style = { ...baseStyle, ...variants[variant] };

    return (
        <button
            onClick={onClick}
            style={style}
            className={className}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
