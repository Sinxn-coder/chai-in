import React, { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="animate-fade-in" style={{
            position: 'fixed',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: type === 'success' ? '#2e7d32' : '#c62828',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 2000,
            minWidth: '300px',
            justifyContent: 'center'
        }}>
            {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <span style={{ fontWeight: 600 }}>{message}</span>
        </div>
    );
};

export default Toast;
