import React from 'react';
import { Home, Map, Plus, Users, Crown, Compass } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const BottomNav = ({ lang = 'en' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide BottomNav when ClubLeaderboard is open or on Add Spot page
  const isClubLeaderboardPage = location.pathname.includes('/club-leaderboard');
  const isAddSpotPage = location.pathname.includes('/add-spot');
  
  const navItems = [
    { to: '/home', icon: Home, label: 'Home' },
    { to: '/explore', icon: Compass, label: 'Explore' },
    { to: '', icon: null, label: 'spacer1' },
    { to: '', icon: null, label: 'spacer2' },
    { to: '', icon: null, label: 'spacer3' },
    { to: '/map', icon: Map, label: 'Map' },
    { to: '/club-leaderboard', icon: Users, label: 'Club' },
  ];

  const isActivePath = (item) =>
    location.pathname.includes(`/${lang}${item.to}`) ||
    (item.to === '/home' &&
      (location.pathname === `/${lang}` ||
        location.pathname === `/${lang}/`));

  // Don't show BottomNav on Club Leaderboard page or Add Spot page
  if (isClubLeaderboardPage || isAddSpotPage) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.4, 0, 0.2, 1]
      }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        zIndex: 9999, // Highest z-index to stay on top
        pointerEvents: 'none',
      }}
    >
      {/* NAV BAR SHAPE */}
      <svg
        width="100%"
        height="120"
        viewBox="0 0 400 120"
        preserveAspectRatio="none"
        style={{ display: 'block', pointerEvents: 'auto' }}
      >
        <path
          d="
            M0 40
            Q0 0 40 0
            H135
            C155 0 165 12 172 26
            C182 50 218 50 228 26
            C235 12 245 0 265 0
            H360
            Q400 0 400 40
            V120
            H0
            Z
          "
          fill="#EF2A39"
        />
      </svg>

      {/* FLOATING PLUS BUTTON (DIRECT NAVIGATION) */}
      <div
        style={{
          position: 'absolute',
          top: -40,
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'auto',
        }}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate(`/${lang}/add-spot`)}
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: '#EF2A39',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow:
              '0 16px 32px rgba(239,42,57,0.45), inset 0 2px 6px rgba(255,255,255,0.35)',
            border: '3px solid rgba(255,255,255,0.4)',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <Plus size={24} color="#fff" strokeWidth={3} />
        </motion.button>
      </div>

      {/* NAV ITEMS */}
      <div
        style={{
          position: 'absolute',
          bottom: 18,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '0 20px',
          pointerEvents: 'auto',
        }}
      >
        {navItems.map((item, idx) => {
          const active = isActivePath(item);
          const col = idx + 1;

          return (
            <div key={item.to} style={{ gridColumn: col }}>
              {item.icon ? (
                <NavLink
                  to={`/${lang}${item.to}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    color: 'white',
                    textDecoration: 'none',
                    opacity: active ? 1 : 0.7,
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    ...(item.to === '/home' && { marginLeft: '5px' }),
                    ...(item.to === '/map' && { marginRight: '25px' }),
                    ...(item.to === '/community' && { marginLeft: '25px' }),
                    ...(item.to === '/leaderboard' && { marginRight: '5px' }),
                  }}
                >
                  <item.icon
                    size={20}
                    strokeWidth={active ? 2.6 : 2}
                    color="white"
                  />
                  <span>{item.label}</span>
                </NavLink>
              ) : (
                <div style={{ width: '20px' }}></div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BottomNav;
