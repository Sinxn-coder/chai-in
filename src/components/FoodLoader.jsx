import React from 'react';
import { motion } from 'framer-motion';
import { Pizza, Coffee, Sandwich, Utensils } from 'lucide-react';

const FoodLoader = ({ message = "Tasting the flavors..." }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            gap: '20px'
        }}>
            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        border: '4px dashed var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Pizza size={40} color="var(--primary)" />
                </motion.div>

                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.7, 0.3]
                    }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    style={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        background: 'white',
                        padding: '4px',
                        borderRadius: '50%',
                        boxShadow: 'var(--shadow-sm)'
                    }}
                >
                    <Coffee size={16} color="var(--primary)" />
                </motion.div>
            </div>

            <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{
                    fontWeight: '800',
                    color: 'var(--text-main)',
                    fontSize: '1rem',
                    margin: 0
                }}
            >
                {message}
            </motion.p>
        </div>
    );
};

export default FoodLoader;
