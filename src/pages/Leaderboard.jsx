import React, { useEffect, useState } from 'react';
import { Trophy, Crown, User, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
    const navigate = useNavigate();
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
        
        // Listen for profile updates to refresh leaderboard names
        const handleProfileUpdate = () => {
            fetchLeaderboard();
        };
        window.addEventListener('userProfileUpdated', handleProfileUpdate);
        
        // Set up real-time subscription for user_preferences changes
        const subscription = supabase
            .channel('user_preferences_changes_leaderboard')
            .on('postgres_changes', 
                { 
                    event: 'UPDATE', 
                    schema: 'public', 
                    table: 'user_preferences' 
                }, 
                (payload) => {
                    // When any user updates their profile, refresh leaderboard
                    fetchLeaderboard();
                }
            )
            .subscribe();
        
        return () => {
            window.removeEventListener('userProfileUpdated', handleProfileUpdate);
            supabase.removeChannel(subscription);
        };
    }, []);

    const fetchLeaderboard = async () => {
        setLoading(true);
        const { data: spots } = await supabase.from('spots').select('created_by');
        const { data: reviews } = await supabase.from('reviews').select('user_id');

        const stats = {};
        spots?.forEach(s => {
            const uid = s.created_by;
            if (uid) {
                if (!stats[uid]) stats[uid] = { spots: 0, reviews: 0, xp: 0 };
                stats[uid].spots += 1;
                stats[uid].xp += 100;
            }
        });
        reviews?.forEach(r => {
            const uid = r.user_id;
            if (uid) {
                if (!stats[uid]) stats[uid] = { spots: 0, reviews: 0, xp: 0 };
                stats[uid].reviews += 1;
                stats[uid].xp += 10;
            }
        });

        const userIds = Object.keys(stats);
        const { data: userPrefs } = await supabase.from('user_preferences').select('user_id, username, display_name, avatar_url').in('user_id', userIds);
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        const prefsMap = {};
        userPrefs?.forEach(p => prefsMap[p.user_id] = p);

        // Filter out admin users by checking usernames and display names
        const adminUserIds = new Set();
        Object.values(prefsMap).forEach(prefs => {
            const adminPatterns = ['admin', 'sinxn', 'moderator'];
            const username = (prefs.username || '').toLowerCase();
            const displayName = (prefs.display_name || '').toLowerCase();
            
            if (adminPatterns.some(pattern => 
                username.includes(pattern) || displayName.includes(pattern)
            )) {
                adminUserIds.add(prefs.user_id);
            }
        });

        const sorted = userIds
            .filter(uid => !adminUserIds.has(uid)) // Exclude admin users
            .map(uid => {
                const prefs = prefsMap[uid];
                return {
                    id: uid,
                    name: prefs?.display_name || prefs?.username || currentUser?.user_metadata?.full_name || 'Foodie',
                    avatar: prefs?.avatar_url,
                    isMe: currentUser && uid === currentUser.id,
                    ...stats[uid]
                };
            })
            .sort((a, b) => b.xp - a.xp);

        setLeaders(sorted);
        setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--secondary)', paddingBottom: '120px' }}>
            <div style={{ height: '180px', background: 'var(--primary)', borderBottomLeftRadius: '40px', borderBottomRightRadius: '40px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <button onClick={() => navigate(-1)} style={{ position: 'absolute', left: '20px', top: '30px', background: 'rgba(255,255,255,0.2)', border: 'none', padding: '10px', borderRadius: '15px', color: 'white' }}>
                    <ChevronLeft size={24} />
                </button>
                <Crown size={48} color="white" style={{ marginBottom: '8px' }} />
                <h1 style={{ color: 'white', fontWeight: '900', fontSize: '1.6rem', margin: 0 }}>Top Foodies</h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: '600' }}>Kerala's most active explorers</p>
            </div>

            <div className="container" style={{ padding: '0 20px', marginTop: '-30px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Trophy size={40} color="var(--primary)" /></motion.div></div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {leaders.map((u, i) => (
                            <motion.div
                                key={u.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                style={{ background: 'white', padding: '16px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)', border: u.isMe ? '2px solid var(--primary)' : 'none' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '28px', fontWeight: '900', color: i < 3 ? 'var(--primary)' : 'var(--text-muted)', fontSize: '1.1rem' }}>
                                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                                    </div>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--secondary)', overflow: 'hidden' }}>
                                        {u.avatar ? <img src={u.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={24} color="var(--text-muted)" /></div>}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '800', fontSize: '1rem', color: u.isMe ? 'var(--primary)' : 'var(--text-main)' }}>{u.name} {u.isMe && '(You!)'}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>{u.spots} Spots shared</div>
                                    </div>
                                </div>
                                <div style={{ background: 'var(--secondary)', padding: '8px 16px', borderRadius: '14px', fontWeight: '900', color: 'var(--primary)', fontSize: '0.9rem' }}>
                                    {u.xp} XP
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
