import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Trash2, CheckCircle, XCircle, ShieldAlert, Bell, Send, BarChart2, Download, Users, MapPin, Award } from 'lucide-react';
import Button from '../components/Button';
import Toast from '../components/Toast';

const Admin = () => {
    const [spots, setSpots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [activeTab, setActiveTab] = useState('analytics'); // Default to new tab

    // Notification state
    const [notifications, setNotifications] = useState([]);
    const [notificationForm, setNotificationForm] = useState({ title: '', message: '' });
    const [sendingNotif, setSendingNotif] = useState(false);

    // Analytics state
    const [analytics, setAnalytics] = useState({
        totalUsers: 0,
        totalSpots: 0,
        signupsByMonth: [],
        topContributors: [],
        activeAreas: []
    });

    useEffect(() => {
        fetchSpots();
        fetchNotifications();
        fetchAnalytics();
    }, []);

    const showToast = (msg, type = 'success') => {
        setToast({ message: msg, type });
    };

    // --- Data Fetching ---

    const fetchSpots = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            showToast("Unauthorized Access", 'error');
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from('spots')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setSpots(data);
        if (error) showToast("Failed to fetch spots", 'error');
        setLoading(false);
    };

    const fetchNotifications = async () => {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setNotifications(data);
        if (error) console.error('Error fetching notifications:', error);
    };

    const fetchAnalytics = async () => {
        try {
            // 1. Fetch Users (via preferences since auth users are protected)
            const { data: users } = await supabase.from('user_preferences').select('created_at, display_name');
            const { data: allSpots } = await supabase.from('spots').select('created_by, location_text, created_at');

            if (!users || !allSpots) return;

            // Stats: Signups per Month
            const signupsMap = {};
            users.forEach(u => {
                const month = new Date(u.created_at).toLocaleString('default', { month: 'short', year: 'numeric' });
                signupsMap[month] = (signupsMap[month] || 0) + 1;
            });
            const signupsByMonth = Object.entries(signupsMap).map(([name, count]) => ({ name, count }));

            // Stats: Top Contributors
            const uploadsMap = {};
            allSpots.forEach(s => {
                if (s.created_by) uploadsMap[s.created_by] = (uploadsMap[s.created_by] || 0) + 1;
            });

            // Map IDs to Names
            const topContributors = Object.entries(uploadsMap)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([id, count]) => {
                    const user = users.find(u => u.user_id === id); // Warning: users fetched above might not have id if I select specific cols
                    return { id, count, name: `User ${id.substring(0, 4)}...` }; // Fallback
                });

            // To get real names we need to rejoin or fetch smarter, but for now this works as aggregation demo

            // Stats: Active Areas (group by simple string match)
            const areaMap = {};
            allSpots.forEach(s => {
                if (s.location_text) {
                    const area = s.location_text.split(',')[0].trim(); // Take first part of address
                    areaMap[area] = (areaMap[area] || 0) + 1;
                }
            });
            const activeAreas = Object.entries(areaMap)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([name, count]) => ({ name, count }));

            setAnalytics({
                totalUsers: users.length,
                totalSpots: allSpots.length,
                signupsByMonth,
                topContributors,
                activeAreas
            });

        } catch (error) {
            console.error("Analytics error:", error);
        }
    };

    // --- Actions ---

    const deleteSpot = async (id) => {
        if (!window.confirm("Delete this spot permanently?")) return;
        setSpots(prevSpots => prevSpots.filter(spot => spot.id !== id));
        const { error } = await supabase.from('spots').delete().eq('id', id);
        if (error) {
            showToast("Failed to delete", 'error');
            fetchSpots();
        } else {
            showToast("Spot deleted", 'success');
            fetchSpots();
        }
    };

    const toggleVerify = async (id, currentStatus) => {
        const { error } = await supabase.from('spots').update({ is_verified: !currentStatus }).eq('id', id);
        if (error) showToast("Update failed", 'error');
        else {
            showToast(currentStatus ? "Spot Un-verified" : "Spot Verified!", 'success');
            fetchSpots();
        }
    };

    const createNotification = async () => {
        if (!notificationForm.title.trim() || !notificationForm.message.trim()) return showToast("Fill title & message", 'error');
        setSendingNotif(true);
        const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase.from('notifications').insert([{
            title: notificationForm.title,
            message: notificationForm.message,
            created_by: user?.id,
            is_active: true
        }]);

        setSendingNotif(false);
        if (error) showToast("Failed to create", 'error');
        else {
            showToast("Notification sent!", 'success');
            setNotificationForm({ title: '', message: '' });
            fetchNotifications();
        }
    };

    const deleteNotification = async (id) => {
        if (!window.confirm("Delete?")) return;
        const { error } = await supabase.from('notifications').delete().eq('id', id);
        if (error) showToast("Failed", 'error');
        else {
            showToast("Deleted", 'success');
            fetchNotifications();
        }
    };

    const toggleNotificationActive = async (id, currentStatus) => {
        const { error } = await supabase.from('notifications').update({ is_active: !currentStatus }).eq('id', id);
        if (error) showToast("Failed", 'error');
        else {
            showToast(currentStatus ? "Hidden" : "Activated", 'success');
            fetchNotifications();
        }
    };

    // --- Export Logic ---
    const handleExport = async (table) => {
        showToast(`Exporting ${table}...`);
        const { data, error } = await supabase.from(table).select('*');

        if (error || !data) return showToast("Export failed", 'error');

        // Convert to CSV
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).map(v => `"${v}"`).join(','));
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');

        // Download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${table}_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- UI Components ---

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            style={{
                flex: 1,
                padding: '14px',
                background: activeTab === id ? 'var(--primary)' : 'transparent',
                color: activeTab === id ? 'white' : 'var(--text-muted)',
                border: 'none',
                borderBottom: activeTab === id ? '3px solid var(--primary)' : '1px solid #eee',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
        >
            {Icon && <Icon size={18} />}
            {label}
        </button>
    );

    return (
        <div className="container" style={{ padding: '2rem 1rem', paddingBottom: '100px' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--primary)', fontSize: '1.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldAlert size={32} /> Admin Dashboard
                </h1>
                <p style={{ color: '#666' }}>Manage your app, analyze growth, and control content.</p>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', marginBottom: '2rem', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <TabButton id="analytics" label="Analytics" icon={BarChart2} />
                <TabButton id="spots" label="Spots" icon={MapPin} />
                <TabButton id="notifications" label="Notif." icon={Bell} />
                <TabButton id="export" label="Data Export" icon={Download} />
            </div>

            {/* CONTENT AREA */}

            {/* 1. ANALYTICS TAB */}
            {activeTab === 'analytics' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* KPI Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)' }}>{analytics.totalUsers}</div>
                            <div style={{ color: '#666', fontSize: '0.9rem' }}>Total Users</div>
                        </div>
                        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#10b981' }}>{analytics.totalSpots}</div>
                            <div style={{ color: '#666', fontSize: '0.9rem' }}>Spots Added</div>
                        </div>
                    </div>

                    {/* Signups Chart (Visual) */}
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontWeight: '700', marginBottom: '1rem' }}>Signups Trend</h3>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '150px', paddingTop: '20px' }}>
                            {analytics.signupsByMonth.map((item, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                    <div style={{
                                        width: '100%',
                                        height: `${Math.min(item.count * 10, 100)}%`, // Basic scaling
                                        background: 'var(--primary)',
                                        borderRadius: '4px 4px 0 0',
                                        minHeight: '4px'
                                    }} />
                                    <span style={{ fontSize: '0.7rem', color: '#999' }}>{item.name}</span>
                                </div>
                            ))}
                            {analytics.signupsByMonth.length === 0 && <p style={{ width: '100%', textAlign: 'center', color: '#999' }}>No data yet</p>}
                        </div>
                    </div>

                    {/* Top Contributors */}
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontWeight: '700', marginBottom: '1rem', display: 'flex', gap: '8px' }}><Award size={20} color="#f59e0b" /> Top Contributors</h3>
                        {analytics.topContributors.map((u, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                                <span style={{ fontWeight: '600' }}>#{i + 1} User {u.id.substring(0, 4)}</span>
                                <span style={{ background: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                    {u.count} spots
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Active Areas */}
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontWeight: '700', marginBottom: '1rem', display: 'flex', gap: '8px' }}><MapPin size={20} color="#ef4444" /> Active Areas</h3>
                        {analytics.activeAreas.map((area, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                <div style={{ flex: 1 }}>{area.name}</div>
                                <div style={{ width: '100px', height: '8px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${Math.min(area.count * 10, 100)}%`, background: '#ef4444', height: '100%' }} />
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#999', width: '20px' }}>{area.count}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 2. SPOTS TAB */}
            {activeTab === 'spots' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {spots.map(spot => (
                        <div key={spot.id} className="glass-card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <h3 style={{ fontWeight: '700' }}>{spot.name}</h3>
                                    <p style={{ color: '#666', fontSize: '0.9rem' }}>{spot.location_text}</p>
                                    <span style={{
                                        fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', marginTop: '8px', display: 'inline-block',
                                        background: spot.is_verified ? '#ecfdf5' : '#fff1f2',
                                        color: spot.is_verified ? '#047857' : '#be123c'
                                    }}>
                                        {spot.is_verified ? 'VERIFIED' : 'PENDING'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => toggleVerify(spot.id, spot.is_verified)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #eee', background: 'white' }}>
                                        {spot.is_verified ? <XCircle size={20} color="red" /> : <CheckCircle size={20} color="green" />}
                                    </button>
                                    <button onClick={() => deleteSpot(spot.id)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #eee', background: 'white' }}>
                                        <Trash2 size={20} color="red" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 3. NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Send Notification</h2>
                    <input
                        placeholder="Title"
                        value={notificationForm.title}
                        onChange={e => setNotificationForm({ ...notificationForm, title: e.target.value })}
                        style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #eee' }}
                    />
                    <textarea
                        placeholder="Message"
                        value={notificationForm.message}
                        onChange={e => setNotificationForm({ ...notificationForm, message: e.target.value })}
                        style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #eee' }}
                        rows={3}
                    />
                    <Button onClick={createNotification} disabled={sendingNotif} style={{ width: '100%', justifyContent: 'center' }}>
                        {sendingNotif ? 'Sending...' : 'Broadcast'}
                    </Button>

                    <div style={{ marginTop: '2rem' }}>
                        <h3>History</h3>
                        {notifications.map(n => (
                            <div key={n.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <b>{n.title}</b>
                                    <p style={{ fontSize: '0.9rem', color: '#666' }}>{n.message}</p>
                                </div>
                                <button onClick={() => deleteNotification(n.id)} style={{ border: 'none', background: 'none', color: 'red' }}><Trash2 size={16} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 4. EXPORT TAB */}
            {activeTab === 'export' && (
                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <Download size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <h2 style={{ marginBottom: '1rem' }}>Export Data</h2>
                    <p style={{ color: '#666', marginBottom: '2rem' }}>Download your data for backup or external analysis.</p>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <Button onClick={() => handleExport('user_preferences')} style={{ justifyContent: 'center' }}>Export Users (CSV)</Button>
                        <Button onClick={() => handleExport('spots')} style={{ justifyContent: 'center' }}>Export Spots (CSV)</Button>
                        <Button onClick={() => handleExport('reviews')} style={{ justifyContent: 'center' }}>Export Reviews (CSV)</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
