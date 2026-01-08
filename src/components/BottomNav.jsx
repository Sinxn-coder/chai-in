import React from 'react';
import { Home, Map, Plus, Users, Crown, Compass } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const BottomNav = ({ lang = 'en' }) => {
  const location = useLocation();

  const navItems = [
    { to: '/home', icon: Home, label: 'Home' },
    { to: '/explore', icon: Compass, label: 'Explore' },
    { to: '', icon: null, label: 'spacer1' },
    { to: '', icon: null, label: 'spacer2' },
    { to: '/map', icon: Map, label: 'Map' },
    { to: '/club-leaderboard', icon: Users, label: 'Club' },
  ];

  const isActivePath = (item) =>
    location.pathname.includes(`/${lang}${item.to}`) ||
    (item.to === '/home' &&
      (location.pathname === `/${lang}` ||
        location.pathname === `/${lang}/`));

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70, // Reduced height for small screens
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    >
      {/* NAV BAR SHAPE */}
      <svg
        width="100%"
        height="120" // Reduced height
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

      {/* FLOATING PLUS BUTTON (WITH GAP) */}
      <div
        style={{
          position: 'absolute',
          top: -40, // Adjusted for smaller nav
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'auto',
        }}
      >
        <NavLink to={`/${lang}/add-spot`}>
          <motion.div
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            style={{
              width: 60, // Reduced size for small screens
              height: 60,
              borderRadius: '50%',
              background: '#EF2A39',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow:
                '0 16px 32px rgba(239,42,57,0.45), inset 0 2px 6px rgba(255,255,255,0.35)',
              border: '3px solid rgba(255,255,255,0.4)',
            }}
          >
            <Plus size={24} color="#fff" strokeWidth={3} />
          </motion.div>
        </NavLink>
      </div>

      {/* NAV ITEMS */}
      <div
        style={{
          position: 'absolute',
          bottom: 18, // Adjusted bottom position
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '0 20px', // Reduced padding for small screens
          pointerEvents: 'auto',
        }}
      >
        {navItems.map((item, idx) => {
          const active = isActivePath(item);
          // For 6 items: Home(0), Explore(1), spacer1(2), Map(3), spacer2(4), Club(5)
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
                    gap: 4, // Reduced gap
                    color: 'white',
                    textDecoration: 'none',
                    opacity: active ? 1 : 0.7,
                    fontSize: '0.7rem', // Smaller font for small screens
                    fontWeight: 800,
                    // Adjust margins for smaller screens
                    ...(item.to === '/home' && { marginLeft: '5px' }),
                    ...(item.to === '/map' && { marginRight: '25px' }),
                    ...(item.to === '/community' && { marginLeft: '25px' }),
                    ...(item.to === '/leaderboard' && { marginRight: '5px' }),
                  }}
                >
                  <item.icon
                    size={20} // Smaller icons for small screens
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
    </div>
  );
};

export default BottomNav;
