import React from 'react';
import { Star, MapPin, Heart } from 'lucide-react';

const SpotCard = ({ spot }) => {
    const { name, rating, reviews_count, image, distance, tags, price_level } = spot;

    return (
        <div style={{
            background: 'var(--bg-white)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: 'var(--space-md)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'pointer'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
        >
            {/* Image Area */}
            <div style={{ position: 'relative', height: '180px' }}>
                <img
                    src={image}
                    alt={name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(255,255,255,0.9)',
                    borderRadius: '50%',
                    padding: '6px',
                    display: 'flex'
                }}>
                    <Heart size={18} color="var(--danger)" />
                </button>
                <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    background: 'var(--bg-white)',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    <Star size={12} fill="var(--secondary)" color="var(--secondary)" />
                    {rating} ({reviews_count})
                </div>
            </div>

            {/* Info Area */}
            <div style={{ padding: 'var(--space-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{name}</h3>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {'₹'.repeat(price_level)}
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
                    <MapPin size={14} />
                    <span>{distance} km away</span>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {tags.map((tag, i) => (
                        <span key={i} style={{
                            background: 'var(--bg-cream)',
                            border: '1px solid #eee',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)'
                        }}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SpotCard;
