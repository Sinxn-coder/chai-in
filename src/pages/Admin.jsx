import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Trash2, CheckCircle, XCircle, ShieldAlert, Bell, Send, BarChart2, Download, Users, MapPin, Award } from 'lucide-react';
import Button from '../components/Button';
import Toast from '../components/Toast';

const Admin = () => {
    const [spots, setSpots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [activeTab, setActiveTab] = useState('analytics');
    const [isAuthorized, setIsAuthorized] = useState(false);
    const navigate = useNavigate();

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
    const [range, setRange] = useState(30);

    useEffect(() => {
        // Session-based Password Prompt
        const pin = prompt("Admin Access Restricted. Enter PIN:");
        if (pin !== "Sinu@1234") {
            alert("Unauthorized!");
            navigate("/");
            return;
        }
        setIsAuthorized(true);

        fetchSpots();
        fetchNotifications();
        fetchAnalytics();

        // Handle deep-linking via hash
        const handleHash = () => {
            const hash = window.location.hash.replace('#', '');
            if (['analytics', 'spots', 'community', 'reviews', 'notifications', 'moderation'].includes(hash)) {
                setActiveTab(hash);
            }
        };
        handleHash();
        window.addEventListener('hashchange', handleHash);
        return () => window.removeEventListener('hashchange', handleHash);
    }, [range]);

    const showToast = (msg, type = 'success') => {
        setToast({ message: msg, type });
    };

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

    const deleteSpot = async (id) => {
        if (!confirm("Permanently delete this spot?")) return;
        const { error } = await supabase.from('spots').delete().eq('id', id);
        if (error) {
            console.error(error);
            showToast("Failed to delete: " + error.message, 'error');
        } else {
            showToast("Spot deleted", 'success');
            setSpots(spots.filter(s => s.id !== id));
        }
    };

    const toggleVerify = async (id, currentStatus) => {
        const { error } = await supabase.from('spots').update({ is_verified: !currentStatus }).eq('id', id);
        if (error) showToast("Failed to update", 'error');
        else {
            setSpots(spots.map(s => s.id === id ? { ...s, is_verified: !currentStatus } : s));
        }
    };

    const fetchNotifications = async () => {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setNotifications(data);
    };

    const createNotification = async () => {
        if (!notificationForm.title || !notificationForm.message) return;
        setSendingNotif(true);
        const { error } = await supabase.from('notifications').insert([{
            title: notificationForm.title,
            message: notificationForm.message,
            is_active: true
        }]);

        if (error) showToast("Failed to send", 'error');
        else {
            showToast("Notification Sent!", 'success');
            setNotificationForm({ title: '', message: '' });
            fetchNotifications();
        }
        setSendingNotif(false);
    };

    const deleteNotification = async (id) => {
        const { error } = await supabase.from('notifications').delete().eq('id', id);
        if (!error) {
            setNotifications(notifications.filter(n => n.id !== id));
            showToast("Notification deleted");
        }
    };

    const toggleNotificationActive = async (id, current) => {
        await supabase.from('notifications').update({ is_active: !current }).eq('id', id);
        fetchNotifications();
    };

    const fetchAnalytics = async () => {
        try {
            const { data: users } = await supabase.from('user_preferences').select('created_at, display_name, username, user_id'); // Added username
            const { data: allSpots } = await supabase.from('spots').select('created_by, location_text, created_at');

            if (!users || !allSpots) return;

            // Stats: Signups per Day/Month within Range
            const now = new Date();
            const cutoff = new Date();
            cutoff.setDate(now.getDate() - range);

            const filteredSignups = users.filter(u => new Date(u.created_at) >= cutoff);

            const signupsMap = {};
            filteredSignups.forEach(u => {
                const date = new Date(u.created_at).toLocaleDateString('default', { month: 'short', day: 'numeric' });
                signupsMap[date] = (signupsMap[date] || 0) + 1;
            });
            const signupsByMonth = Object.entries(signupsMap).map(([name, count]) => ({ name, count }));

            setAnalytics({
                totalUsers: users.length,
                totalSpots: allSpots.length,
                signupsByMonth,
                topContributors,
                activeAreas
            });

        } catch (e) {
            console.error(e);
        }
    };

    // --- RENDER HELPERS ---
    if (!isAuthorized) return null; // Or unauthorized view
    // Using Sub-components logic inline for simpler state access in one file or simple components below
    // I'll render them directly here to avoid scope issues or define outside

    return (
        <div style={{ padding: '20px 20px 100px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '1.8rem' }}>Admin Dashboard</h1>
            </div>

            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px' }} className="hide-scrollbar">
                {['analytics', 'spots', 'community', 'reviews', 'notifications', 'moderation'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '10px 20px', borderRadius: '30px', border: 'none',
                            background: activeTab === tab ? 'var(--primary)' : 'white',
                            color: activeTab === tab ? 'white' : '#555',
                            fontWeight: '700', textTransform: 'capitalize', whiteSpace: 'nowrap',
                            boxShadow: activeTab === tab ? '0 4px 12px rgba(226, 55, 68, 0.3)' : '0 2px 8px rgba(0,0,0,0.05)'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {loading && <p>Loading data...</p>}

            {!loading && activeTab === 'analytics' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ color: '#888', margin: 0 }}>Total Users</p>
                            <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{analytics.totalUsers}</h2>
                        </div>
                        <Users size={40} color="var(--primary)" />
                    </div>
                    <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ color: '#888', margin: 0 }}>Total Spots</p>
                            <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{analytics.totalSpots}</h2>
                        </div>
                        <MapPin size={40} color="orange" />
                    </div>

                    <div className="glass-card" style={{ padding: '20px', gridColumn: '1 / -1' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Growth Analytics</h3>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {[30, 60, 90].map(r => (
                                    <button
                                        key={r}
                                        onClick={() => setRange(r)}
                                        style={{
                                            padding: '6px 12px', borderRadius: '8px', border: '1px solid #ddd',
                                            background: range === r ? 'var(--primary)' : 'white',
                                            color: range === r ? 'white' : '#666',
                                            fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer'
                                        }}
                                    >
                                        {r} Days
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ width: '100%', height: '250px', position: 'relative' }}>
                            {analytics.signupsByMonth.length > 0 && (
                                <AnalyticsGraph data={analytics.signupsByMonth} />
                            )}
                        </div>
                        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#888', marginTop: '1rem' }}>User Signups over time</p>
                    </div>

                    <div className="glass-card" style={{ padding: '20px' }}>
                        <h3>Top Contributors</h3>
                        {analytics.topContributors.map((u, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontWeight: 'bold', width: '20px' }}>{i + 1}</span>
                                    <span>{u.name}</span>
                                </div>
                                <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{u.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!loading && activeTab === 'spots' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {spots.map(spot => (
                        <div key={spot.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <img src={spot.images?.[0] || 'https://via.placeholder.com/100'} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                                <div>
                                    <h4 style={{ margin: 0, fontWeight: '700' }}>{spot.name}</h4>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>{spot.location_text}</p>
                                    {spot.is_verified && <span style={{ fontSize: '0.7rem', color: 'green', fontWeight: 'bold' }}>Verified</span>}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => toggleVerify(spot.id, spot.is_verified)} style={{ padding: '8px', background: '#e8f5e9', color: '#2e7d32', borderRadius: '8px', border: 'none' }}>
                                    <CheckCircle size={18} />
                                </button>
                                <button onClick={() => deleteSpot(spot.id)} style={{ padding: '8px', background: '#ffebee', color: '#c62828', borderRadius: '8px', border: 'none' }}>
                                    <XCircle size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && activeTab === 'notifications' && (
                <div>
                    <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
                        <h3>Create Notification</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input
                                type="text"
                                placeholder="Notification Title"
                                value={notificationForm.title}
                                onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                            />
                            <textarea
                                placeholder="Message Body"
                                value={notificationForm.message}
                                onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '80px' }}
                            />
                            <Button onClick={createNotification} disabled={sendingNotif}>
                                {sendingNotif ? 'Sending...' : 'Send to All Users'} <Send size={16} style={{ marginLeft: '8px' }} />
                            </Button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {notifications.map(n => (
                            <div key={n.id} className="glass-card" style={{ padding: '15px', position: 'relative' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <h4 style={{ margin: 0 }}>{n.title}</h4>
                                    <span style={{ fontSize: '0.8rem', color: n.is_active ? 'green' : 'red', fontWeight: 'bold' }}>
                                        {n.is_active ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                </div>
                                <p style={{ margin: 0, color: '#555' }}>{n.message}</p>
                                <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                                    <button onClick={() => toggleNotificationActive(n.id, n.is_active)} style={{ fontSize: '0.8rem', padding: '4px 8px' }}>
                                        Toggle Active
                                    </button>
                                    <button onClick={() => deleteNotification(n.id)} style={{ fontSize: '0.8rem', padding: '4px 8px', color: 'red' }}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!loading && activeTab === 'community' && <CommunityManager />}
            {!loading && activeTab === 'reviews' && <ReviewManager />}
            {!loading && activeTab === 'moderation' && <ModerationManager showToast={showToast} />}

        </div>
    );
};

const CommunityManager = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const { data } = await supabase.from('community_posts').select('*').order('created_at', { ascending: false });
        setPosts(data || []);
        setLoading(false);
    };

    const deletePost = async (id) => {
        if (!confirm("Delete this post?")) return;
        const { error } = await supabase.from('community_posts').delete().eq('id', id);
        if (error) {
            console.error(error);
            alert("Failed to delete post: " + error.message);
        } else setPosts(posts.filter(p => p.id !== id));
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
            {posts.map(post => (
                <div key={post.id} className="glass-card" style={{ padding: '10px', overflow: 'hidden' }}>
                    <img src={post.image_url} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                    <p style={{ fontSize: '0.8rem', margin: '8px 0', height: '40px', overflow: 'hidden' }}>{post.caption}</p>
                    <button onClick={() => deletePost(post.id)} style={{ width: '100%', padding: '6px', background: '#ffebee', color: 'red', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        <Trash2 size={16} /> Delete
                    </button>
                </div>
            ))}
        </div>
    );
};

const ReviewManager = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => { fetchReviews(); }, []);

    const fetchReviews = async () => {
        const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false }).limit(50);
        setReviews(data || []);
    };

    const deleteReview = async (id) => {
        if (!confirm("Delete review?")) return;
        const { error } = await supabase.from('reviews').delete().eq('id', id);
        if (error) {
            console.error(error);
            alert("Failed to delete review: " + error.message);
        } else setReviews(reviews.filter(r => r.id !== id));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {reviews.map(r => (
                <div key={r.id} className="glass-card" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ display: 'flex', gap: '4px' }}>{[...Array(r.rating)].map((_, i) => <span key={i}>⭐</span>)}</div>
                        <p style={{ marginTop: '5px', marginBottom: '0', fontSize: '0.9rem' }}>{r.comment}</p>
                    </div>
                    <button onClick={() => deleteReview(r.id)} style={{ background: '#ffebee', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px', color: 'red' }}>
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
        </div>
    );
};

const AnalyticsGraph = ({ data }) => {
    const max = Math.max(...data.map(d => d.count), 5);
    const height = 200;
    const width = 800;
    const padding = 30;

    const points = data.map((d, i) => {
        const x = padding + (i * (width - padding * 2) / (data.length - 1 || 1));
        const y = height - padding - (d.count * (height - padding * 2) / max);
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%' }}>
            {/* Grid lines */}
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#eee" />
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#eee" />

            {/* Axis Labels */}
            <text x={padding - 10} y={padding} textAnchor="end" fontSize="10" fill="#999">{max}</text>
            <text x={padding - 10} y={height - padding} textAnchor="end" fontSize="10" fill="#999">0</text>

            <polyline
                fill="none"
                stroke="var(--primary)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
            {data.map((d, i) => {
                const x = padding + (i * (width - padding * 2) / (data.length - 1 || 1));
                const y = height - padding - (d.count * (height - padding * 2) / max);
                return (
                    <g key={i}>
                        <circle cx={x} cy={y} r="4" fill="white" stroke="var(--primary)" strokeWidth="2" />
                        <text x={x} y={height - 5} textAnchor="middle" fontSize="10" fill="#999">{d.name}</text>
                        <text x={x} y={y - 10} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--primary)">{d.count}</text>
                    </g>
                );
            })}
        </svg>
    );
};

const ModerationManager = ({ showToast }) => {
    const [edits, setEdits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchEdits(); }, []);

    const fetchEdits = async () => {
        const { data } = await supabase.from('spot_edits').select('*, spots(name)').eq('status', 'pending');
        setEdits(data || []);
        setLoading(false);
    };

    const handleModeration = async (editId, status, spotId, newData) => {
        try {
            if (status === 'approved') {
                // Apply the changes to the main spot table
                const { error: spotError } = await supabase.from('spots').update({
                    name: newData.name,
                    category: newData.category,
                    price_level: newData.price,
                    description: newData.description,
                    location_text: newData.location_text,
                    latitude: newData.latitude,
                    longitude: newData.longitude,
                    images: newData.images
                }).eq('id', spotId);
                if (spotError) throw spotError;
            }

            // Update the edit record status
            const { error: editError } = await supabase.from('spot_edits').update({ status }).eq('id', editId);
            if (editError) throw editError;

            showToast(`Edit ${status}`, 'success');
            setEdits(edits.filter(e => e.id !== editId));
        } catch (err) {
            console.error(err);
            showToast("Moderation failed", 'error');
        }
    };

    if (loading) return <div>Loading pendings...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {edits.length === 0 ? <p>No pending edits to review.</p> : edits.map(edit => (
                <div key={edit.id} className="glass-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <h4 style={{ margin: 0 }}>Edit Suggestion for: {edit.spots?.name}</h4>
                        <span style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(edit.created_at).toLocaleDateString()}</span>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '15px', color: '#475569' }}>
                        <strong>Suggested Name:</strong> {edit.data.name}<br />
                        <strong>Suggested Category:</strong> {edit.data.category}<br />
                        <strong>New Desc:</strong> {edit.data.description?.substring(0, 100)}...
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleModeration(edit.id, 'approved', edit.spot_id, edit.data)} style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
                            Approve & Apply
                        </button>
                        <button onClick={() => handleModeration(edit.id, 'rejected')} style={{ flex: 1, padding: '10px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
                            Reject
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Admin;
