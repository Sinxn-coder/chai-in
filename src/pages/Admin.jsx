import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';
import Button from '../components/Button';

const Admin = () => {
    const [spots, setSpots] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSpots();
    }, []);

    const fetchSpots = async () => {
        const { data } = await supabase.from('spots').select('*').order('created_at', { ascending: false });
        if (data) setSpots(data);
        setLoading(false);
    };

    const deleteSpot = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        await supabase.from('spots').delete().eq('id', id);
        fetchSpots();
    };

    const toggleVerify = async (id, currentStatus) => {
        await supabase.from('spots').update({ is_verified: !currentStatus }).eq('id', id);
        fetchSpots();
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ color: 'var(--primary)', marginBottom: '2rem' }}>Admin Dashboard</h1>

            {loading ? <p>Loading...</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {spots.map(spot => (
                        <div key={spot.id} style={{
                            background: 'white',
                            padding: '1rem',
                            borderRadius: '8px',
                            border: '1px solid #eee',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h3 style={{ fontWeight: '700' }}>{spot.name}</h3>
                                <p style={{ fontSize: '0.8rem', color: '#666' }}>{spot.location_text}</p>
                                <span style={{
                                    fontSize: '0.7rem',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    background: spot.is_verified ? '#e6fffa' : '#fff5f5',
                                    color: spot.is_verified ? 'green' : 'red',
                                    marginTop: '4px',
                                    display: 'inline-block'
                                }}>
                                    {spot.is_verified ? 'Verified' : 'Pending'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => toggleVerify(spot.id, spot.is_verified)} style={{ color: 'green' }}>
                                    {spot.is_verified ? <XCircle /> : <CheckCircle />}
                                </button>
                                <button onClick={() => deleteSpot(spot.id)} style={{ color: 'red' }}>
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Admin;
