import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { X, Bell, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NotificationsSheet = ({ isOpen, onClose, userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && userId) {
            fetchNotifications();
            markAllAsRead(); // Optional: Mark as read when opened? Or user manual?
            // Usually simpler to mark as read when seen.
        }
    }, [isOpen, userId]);

    const fetchNotifications = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(20);

        if (data) setNotifications(data);
        setLoading(false);
    };

    const markAllAsRead = async () => {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', userId)
            .eq('is_read', false);
    };

    const deleteNotification = async (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        await supabase.from('notifications').delete().eq('id', id);
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 3000,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', justifyContent: 'flex-end'
        }} onClick={onClose}>
            <div
                onClick={e => e.stopPropagation()}
                className="slide-in-right"
                style={{
                    width: '85%', maxWidth: '350px', height: '100%',
                    background: 'white',
                    padding: '20px',
                    display: 'flex', flexDirection: 'column',
                    boxShadow: '-4px 0 20px rgba(0,0,0,0.1)'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Bell fill="var(--primary)" color="var(--primary)" size={24} />
                        Notifications
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none' }}><X /></button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {loading ? (
                        <p style={{ textAlign: 'center', color: '#888' }}>Loading...</p>
                    ) : notifications.length === 0 ? (
                        <div style={{ textAlign: 'center', paddingTop: '50px', opacity: 0.5 }}>
                            <Bell size={48} color="#ccc" style={{ marginBottom: '10px' }} />
                            <p>No notifications yet</p>
                        </div>
                    ) : (
                        notifications.map(n => (
                            <div key={n.id} style={{
                                padding: '16px', borderRadius: '16px',
                                background: n.is_read ? '#fff' : '#fff5f5',
                                border: '1px solid #f0f0f0',
                                marginBottom: '10px',
                                position: 'relative'
                            }}>
                                <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: '700', color: n.is_read ? '#333' : 'var(--primary)' }}>
                                    {n.title}
                                </h4>
                                <p style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#666', lineHeight: '1.4' }}>
                                    {n.message}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#999' }}>
                                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                                    </span>
                                    <button
                                        onClick={() => deleteNotification(n.id)}
                                        style={{ fontSize: '0.75rem', color: '#aaa', background: 'none', border: 'none' }}
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <style>{`
                .slide-in-right { animation: slideInRight 0.3s ease-out; }
                @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
            `}</style>
        </div>
    );
};

export default NotificationsSheet;
