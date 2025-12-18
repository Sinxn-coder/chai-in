import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { Utensils, Coffee, MapPin } from 'lucide-react';
import Logo from '../components/Logo';

const Login = () => {
    const { signInWithGoogle, user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [referrer, setReferrer] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        if (ref) {
            setReferrer(ref);
            localStorage.setItem('chai_referrer', ref);
        }
    }, []);

    useEffect(() => {
        if (user) {
            handlePostLoginReward();
            navigate('/en/home');
        }
    }, [user, navigate]);

    const handlePostLoginReward = async () => {
        const refId = referrer || localStorage.getItem('chai_referrer');
        if (!refId || !user) return;

        try {
            // Check if this user already has a referrer to avoid double rewards
            const { data: profile } = await supabase.from('user_preferences').select('referred_by').eq('user_id', user.id).single();

            if (profile && !profile.referred_by && refId !== user.id) {
                // Award points to the referrer
                await supabase.rpc('reward_referrer', { referrer_id: refId });
                // Record who referred this user
                await supabase.from('user_preferences').update({ referred_by: refId }).eq('user_id', user.id);
                localStorage.removeItem('chai_referrer');
            }
        } catch (err) {
            console.error("Referral reward error:", err);
        }
    };

    const handleLogin = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden'
        }}>

            {/* Background Decor */}
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', background: 'var(--secondary)', borderRadius: '50%', opacity: 0.1, filter: 'blur(50px)' }} />
            <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '300px', height: '300px', background: 'var(--primary)', borderRadius: '50%', opacity: 0.1, filter: 'blur(50px)' }} />

            {/* Hero Icon */}
            <div style={{
                width: '120px', height: '120px',
                background: 'white',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'var(--shadow-float)',
                marginBottom: '2rem',
                zIndex: 2,
                animation: 'float 3s ease-in-out infinite'
            }}>
                <Utensils size={48} color="var(--primary)" />
            </div>

            {/* Logo Area */}
            <div className="glass-card" style={{
                padding: '2.5rem',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <div style={{ marginBottom: '1rem' }}>
                    <Logo size={60} />
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                    Discover the best food spots in town. <br /> Join the community.
                </p>

                <Button
                    onClick={handleLogin}
                    disabled={loading}
                    style={{
                        width: '100%',
                        justifyContent: 'center',
                        background: 'var(--text-main)',
                        color: 'white',
                        padding: '16px',
                        fontSize: '1.1rem'
                    }}
                >
                    {loading ? 'Connecting...' : 'Continue with Google'}
                </Button>

                <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#999' }}>
                    By continuing, you verify that you are a food lover.
                </p>
            </div>

            {/* Floating Icons */}
            <Coffee size={32} color="var(--secondary)" style={{ position: 'absolute', top: '20%', left: '10%', opacity: 0.5, transform: 'rotate(-20deg)' }} />
            <MapPin size={32} color="var(--accent)" style={{ position: 'absolute', bottom: '20%', right: '10%', opacity: 0.5, transform: 'rotate(15deg)' }} />

            <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
        </div>
    );
};

export default Login;
