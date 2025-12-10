import React from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';

const Leaderboard = ({ lang }) => {
    const users = [
        { id: 1, name: "Arun Kumar", xp: 5400, avatar: null },
        { id: 2, name: "Sneha Reddi", xp: 4200, avatar: null },
        { id: 3, name: "Foodie Jin", xp: 3800, avatar: null },
        { id: 4, name: "Rahul K", xp: 3100, avatar: null },
        { id: 5, name: "Meera V", xp: 2900, avatar: null },
    ];

    return (
        <div style={{ paddingBottom: '90px' }}>
            <div style={{
                background: 'linear-gradient(135deg, var(--secondary) 0%, #FF9F1C 100%)',
                padding: '2rem 1rem',
                color: 'white',
                borderBottomLeftRadius: '30px',
                borderBottomRightRadius: '30px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-lg)'
            }}>
                <Crown size={48} style={{ marginBottom: '10px' }} />
                <h1 style={{ fontWeight: '800', fontSize: '1.8rem' }}>Top Foodies</h1>
                <p style={{ opacity: 0.9 }}>This Month's Leaderboard</p>
            </div>

            <div className="container" style={{ marginTop: '-30px' }}>
                {users.map((u, index) => (
                    <div key={u.id} style={{
                        background: 'white',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: 'var(--shadow-sm)',
                        transform: index === 0 ? 'scale(1.02)' : 'none',
                        border: index === 0 ? '2px solid var(--secondary)' : 'none'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span style={{
                                fontWeight: '800',
                                fontSize: '1.2rem',
                                color: index < 3 ? 'var(--primary)' : 'var(--text-muted)',
                                width: '24px'
                            }}>
                                #{index + 1}
                            </span>

                            <div style={{
                                width: '40px', height: '40px',
                                borderRadius: '50%',
                                background: '#eee',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {u.name.charAt(0)}
                            </div>

                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>{u.name}</h3>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Food Hunter</span>
                            </div>
                        </div>

                        <div style={{
                            background: 'var(--bg-cream)',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontWeight: '700',
                            color: 'var(--primary-dark)',
                            fontSize: '0.9rem'
                        }}>
                            {u.xp} XP
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
