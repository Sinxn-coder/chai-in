import React, { useState, useEffect, useRef } from 'react';
import { Bell, X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import './NotificationBell.css';

const NotificationBell = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    useEffect(() => {
        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        if (!user) return;

        // Fetch all active notifications
        const { data: allNotifications, error: notifError } = await supabase
            .from('notifications')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(10);

        if (notifError) {
            console.error('Error fetching notifications:', notifError);
            return;
        }

        // Fetch user's read status for these notifications
        const { data: userNotifs, error: userError } = await supabase
            .from('user_notifications')
            .select('notification_id, is_read')
            .eq('user_id', user.id);

        if (userError) {
            console.error('Error fetching user notifications:', userError);
        }

        // Merge notifications with read status
        const readMap = {};
        userNotifs?.forEach(un => {
            readMap[un.notification_id] = un.is_read;
        });

        const mergedNotifications = allNotifications.map(notif => ({
            ...notif,
            isRead: readMap[notif.id] || false
        }));

        setNotifications(mergedNotifications);
        setUnreadCount(mergedNotifications.filter(n => !n.isRead).length);
    };

    const markAsRead = async (notificationId) => {
        if (!user) return;

        // Check if user_notification record exists
        const { data: existing } = await supabase
            .from('user_notifications')
            .select('id')
            .eq('user_id', user.id)
            .eq('notification_id', notificationId)
            .single();

        if (existing) {
            // Update existing record
            await supabase
                .from('user_notifications')
                .update({ is_read: true, read_at: new Date().toISOString() })
                .eq('id', existing.id);
        } else {
            // Insert new record
            await supabase
                .from('user_notifications')
                .insert([{
                    user_id: user.id,
                    notification_id: notificationId,
                    is_read: true,
                    read_at: new Date().toISOString()
                }]);
        }

        // Update local state
        setNotifications(prev => prev.map(n =>
            n.id === notificationId ? { ...n, isRead: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const markAllAsRead = async () => {
        if (!user || notifications.length === 0) return;

        const unreadNotifs = notifications.filter(n => !n.isRead);

        for (const notif of unreadNotifs) {
            await markAsRead(notif.id);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    if (!user) return null;

    return (
        <div className="notification-bell-container" ref={dropdownRef}>
            <button
                className="notification-bell-button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Notifications"
            >
                <Bell size={22} />
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                className="mark-all-read"
                                onClick={markAllAsRead}
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="no-notifications">
                                <Bell size={48} style={{ opacity: 0.3 }} />
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div
                                    key={notif.id}
                                    className={`notification-item ${notif.isRead ? 'read' : 'unread'}`}
                                    onClick={() => !notif.isRead && markAsRead(notif.id)}
                                >
                                    <div className="notification-content">
                                        <h4>{notif.title}</h4>
                                        <p>{notif.message}</p>
                                        <span className="notification-time">{formatTime(notif.created_at)}</span>
                                    </div>
                                    {!notif.isRead && <div className="unread-dot"></div>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
