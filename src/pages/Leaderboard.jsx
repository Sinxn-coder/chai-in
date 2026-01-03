import React, { useEffect, useState } from 'react';
import { Trophy, Crown, User } from 'lucide-react';
import LoadingAnimation from '../components/LoadingAnimation';
import { supabase } from '../lib/supabaseClient';

import Community from './Community';

const Leaderboard = ({ lang }) => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('rankings'); // 'rankings' or 'club'

    useEffect(() => {
        if (activeTab === 'rankings') {
            fetchLeaderboard();
        }
    }, [activeTab]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        // ... (fetch logic same as before, no changes needed to logic itself, just re-declaring it inside if needed or keep it)
        // Fetch all spots to show more users on leaderboard
        const { data: spots } = await supabase.from('spots').select('created_by');

        // Fetch all reviews
        const { data: reviews } = await supabase.from('reviews').select('user_id');

        // Aggregate by user
        const stats = {};

        if (spots) {
            spots.forEach(spot => {
                const uid = spot.created_by;
                if (!uid) return;
                if (!stats[uid]) stats[uid] = { count: 0, xp: 0, reviews: 0 };
                stats[uid].count += 1;
                stats[uid].xp += 100; // 100 XP per spot
            });
        }

        if (reviews) {
            reviews.forEach(review => {
                const uid = review.user_id;
                if (!uid) return;
                if (!stats[uid]) stats[uid] = { count: 0, xp: 0, reviews: 0 };
                stats[uid].reviews += 1;
                stats[uid].xp += 10; // 10 XP per review
            });
        }

        // Get all unique user IDs
        const userIds = Object.keys(stats);

        // Fetch user preferences for names and avatars
        const { data: userPrefs } = await supabase
            .from('user_preferences')
            .select('user_id, username, display_name, avatar_url')
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
                    ? (prefs?.username || prefs?.display_name || user.user_metadata?.full_name || "You")
                    : (prefs?.username || prefs?.display_name || `User ${uid.slice(0, 6)}`),
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
                padding: '2rem 1rem 3rem', // Extra padding for tabs
                color: 'white',
                borderBottomLeftRadius: '30px',
                borderBottomRightRadius: '30px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-lg)',
                position: 'relative'
            }}>
                <Crown size={48} style={{ marginBottom: '10px' }} />
                <h1 style={{ fontWeight: '800', fontSize: '1.8rem' }}>Top Foodies</h1>

                {/* Tab Switcher */}
                <div style={{
                    position: 'absolute',
                    bottom: '-24px', left: '50%', transform: 'translateX(-50%)',
                    background: 'white',
                    padding: '6px',
                    borderRadius: '30px',
                    display: 'flex',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    width: '200px'
                }}>
                    <button
                        onClick={() => setActiveTab('rankings')}
                        style={{
                            flex: 1, padding: '8px', borderRadius: '24px', border: 'none',
                            background: activeTab === 'rankings' ? 'var(--primary)' : 'transparent',
                            color: activeTab === 'rankings' ? 'white' : '#666',
                            fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s'
                        }}
                    >
                        Rankings
                    </button>
                    <button
                        onClick={() => setActiveTab('club')}
                        style={{
                            flex: 1, padding: '8px', borderRadius: '24px', border: 'none',
                            background: activeTab === 'club' ? 'var(--primary)' : 'transparent',
                            color: activeTab === 'club' ? 'white' : '#666',
                            fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s'
                        }}
                    >
                        Club
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div style={{ marginTop: '40px' }}>
                {activeTab === 'rankings' ? (
                    <div className="container">
                        {loading ? (
                            <LoadingAnimation />
                        ) : leaders.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', background: 'white', borderRadius: '20px', margin: '0 16px' }}>
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
                                    border: index === 0 ? '2px solid var(--secondary)' : 'none',
                                    margin: '0 16px 12px'
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
                ) : (
                    // Show Community Feed
                    <Community />
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
