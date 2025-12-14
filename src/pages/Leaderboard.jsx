import React, { useEffect, useState } from 'react';
import { Trophy, Crown, User } from 'lucide-react';
import LoadingAnimation from '../components/LoadingAnimation';
import { supabase } from '../lib/supabaseClient';

const Leaderboard = ({ lang }) => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        setLoading(true);
        // Fetch all spots to show more users on leaderboard
        const { data: spots, error } = await supabase
            .from('spots')
            .select('created_by');

        if (error) {
            console.error(error);
            setLoading(false);
            return;
        }

        // Aggregate by user
        const stats = {};
        spots.forEach(spot => {
            const uid = spot.created_by;
            if (!uid) return;
            if (!stats[uid]) stats[uid] = { count: 0, xp: 0 };
            stats[uid].count += 1;
            stats[uid].xp += 100; // 100 XP per spot
        });

        // Get all unique user IDs
        const userIds = Object.keys(stats);

        // Fetch user preferences for names and avatars
        const { data: userPrefs } = await supabase
            .from('user_preferences')
            .select('user_id, display_name, avatar_url')
            .in('user_id', userIds);

        // Create a map of user preferences
        const prefsMap = {};
        if (userPrefs) {
            userPrefs.forEach(pref => {
                prefsMap[pref.user_id] = pref;
            });
        }

        // Get current user to show their name
        const { data: { user } } = await supabase.auth.getUser();

        // Convert to array with user names
        const sortedLeaders = userIds.map(uid => {
            const prefs = prefsMap[uid];
            const isMe = user && uid === user.id;

            return {
                id: uid,
                name: isMe
                    ? (prefs?.display_name || user.user_metadata?.full_name || "You")
                    : (prefs?.display_name || `User ${uid.slice(0, 6)}`),
                avatar: prefs?.avatar_url || null,
                isMe: isMe,
                ...stats[uid]
            };
        }).sort((a, b) => b.xp - a.xp);

        setLeaders(sortedLeaders);
        setLoading(false);
    };

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
                <p style={{ opacity: 0.9 }}>Based on Verified Spots</p>
            </div>

            <div className="container" style={{ marginTop: '-30px' }}>
                {loading ? (
                    <LoadingAnimation />
                ) : leaders.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', background: 'white', borderRadius: '20px' }}>
                        <p>No leaders yet. Be the first to add a spot!</p>
                    </div>
                ) : (
                    leaders.map((u, index) => (
                        <div key={u.id} style={{
                            background: u.isMe ? '#FFF9C4' : 'white',
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
                                    <User size={20} color="#666" />
                                </div>

                                <div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>
                                        {u.name} {u.isMe && '(You)'}
                                    </h3>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.count} Spots</span>
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
                    ))
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
