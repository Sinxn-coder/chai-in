import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import TopBar from '../components/TopBar';
import SpotCard from '../components/SpotCard';
import { Search, Loader } from 'lucide-react';

const Home = ({ lang }) => {
    const [spots, setSpots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSpots();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => console.log("Location access granted"),
                (error) => console.error("Location access denied")
            );
        }
    }, []);

    const fetchSpots = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('spots')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching spots:', error);
        } else {
            setSpots(data || []);
        }
        setLoading(false);
    };

    const filteredSpots = spots.filter(spot =>
        spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (spot.tags && spot.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    return (
        <div style={{ paddingBottom: '90px' }}> {/* Space for bottom nav */}
            <TopBar />

            {/* Search Bar */}
            <div style={{ padding: '0 var(--space-md) var(--space-md)' }}>
                <div className="glass-card" style={{
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'white'
                }}>
                    <Search size={20} color="var(--primary)" />
                    <input
                        type="text"
                        placeholder={lang === 'en' ? "Search for biriyani, cafes..." : "ബിരിയാണി, കഫേ, തിരയുക..."}
                        value={searchTerm}
                        onChange={(e) => {
                            const val = e.target.value;
                            setSearchTerm(val);
                            if (val === '#admin') {
                                const pwd = prompt("Enter Admin Password:");
                                if (pwd === 'Sinu@12345') {
                                    window.location.href = `/${lang}/admin`;
                                } else if (pwd !== null) {
                                    alert("Wrong Password!");
                                }
                            }
                        }}
                        style={{
                            border: 'none',
                            outline: 'none',
                            width: '100%',
                            fontSize: '1rem',
                            color: 'var(--text-main)',
                            background: 'transparent'
                        }}
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="hide-scrollbar" style={{
                display: 'flex',
                gap: '10px',
                padding: '0 var(--space-md) var(--space-md)',
                overflowX: 'auto',
                whiteSpace: 'nowrap'
            }}>
                {['All', 'Near Me', 'Popular', 'Veg', 'Halal'].map((filter, i) => (
                    <button key={i} style={{
                        padding: '8px 18px',
                        borderRadius: 'var(--radius-full)',
                        background: i === 0 ? 'var(--primary)' : 'rgba(255,255,255,0.8)',
                        color: i === 0 ? 'white' : 'var(--text-muted)',
                        border: i === 0 ? 'none' : '1px solid rgba(0,0,0,0.05)',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        {filter}
                    </button>
                ))}
            </div>

            {/* Feed */}
            <div className="container" style={{ padding: '0 var(--space-md)' }}>
                <h2 style={{
                    marginBottom: 'var(--space-md)',
                    fontSize: '1.4rem',
                    fontWeight: '800',
                    color: 'var(--text-main)'
                }}>
                    {lang === 'en' ? 'Fresh Drops 🔥' : 'പുതിയ സ്പോട്ടുകൾ 🔥'}
                </h2>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                        <Loader className="animate-spin" size={32} color="var(--primary)" />
                    </div>
                ) : filteredSpots.length > 0 ? (
                    filteredSpots.map(spot => (
                        // Adapt real data to SpotCard props
                        <SpotCard key={spot.id} spot={{
                            name: spot.name,
                            rating: 4.5, // Placeholder if no reviews table join yet
                            reviews_count: 0,
                            image: spot.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
                            distance: 1.2,
                            price_level: spot.price || 2,
                            tags: spot.category ? [spot.category] : ['Food']
                        }} />
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                        <p>No spots found. Be the first to add one!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
