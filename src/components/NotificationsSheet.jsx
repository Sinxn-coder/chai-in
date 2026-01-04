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
            markAllAsRead();
        }
    }, [isOpen, userId]);

    const fetchNotifications = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            // Fix: simplified OR syntax or just fetching global + personal in a cleaner way
            .or(`user_id.eq.${userId},user_id.is.null`)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) console.error("Notif error:", error);

        if (data) setNotifications(data);
        setLoading(false);
    };

    const markAllAsRead = async () => {
        if (!userId) return;
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
            position: 'absolute',
            top: '60px',
            right: '20px',
            zIndex: 3000,
            width: '320px',
            maxHeight: '400px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            border: '1px solid #eee',
            display: 'flex', flexDirection: 'column',
            animation: 'fadeInDown 0.2s ease-out'
        }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bell size={18} fill="var(--primary)" color="var(--primary)" />
                    Notifications
                </h3>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                    <X size={16} color="#999" />
                </button>
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
                            <span style={{ fontSize: '0.75rem', color: '#999' }}>
                                {n.created_at ? formatDistanceToNow(new Date(n.created_at), { addSuffix: true }) : 'just now'}
                            </span>
                        </div>
                    ))
                )}
            </div>
            <style>{`
                @keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default NotificationsSheet;
