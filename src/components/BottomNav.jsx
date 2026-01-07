import React from 'react';
import { Home, Map, Plus, Users, Crown } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const BottomNav = ({ lang = 'en' }) => {
  const location = useLocation();

  const navItems = [
    { to: '/home', icon: Home, label: 'Home' },
    { to: '/map', icon: Map, label: 'Map' },
    { to: '/community', icon: Users, label: 'Club' },
    { to: '/leaderboard', icon: Crown, label: 'Top' },
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
        height: 80, // ⬅️ more breathing room
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    >
      {/* NAV BAR SHAPE */}
      <svg
        width="100%"
        height="140"
        viewBox="0 0 400 140"
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
            V140
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
          top: -44, // ⬅️ creates visible space
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
              width: 76,
              height: 76,
              borderRadius: '50%',
              background: '#EF2A39',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow:
                '0 16px 32px rgba(239,42,57,0.45), inset 0 2px 6px rgba(255,255,255,0.35)',
              border: '4px solid rgba(255,255,255,0.4)',
            }}
          >
            <Plus size={32} color="#fff" strokeWidth={3} />
          </motion.div>
        </NavLink>
      </div>

      {/* NAV ITEMS */}
      <div
        style={{
          position: 'absolute',
          bottom: 22,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '0 40px',
          pointerEvents: 'auto',
        }}
      >
        {navItems.map((item, idx) => {
          const active = isActivePath(item);
          const isLeft = idx < 2;
          const col = isLeft ? idx + 1 : idx + 3;

          return (
            <div key={item.to} style={{ gridColumn: col }}>
              <NavLink
                to={`/${lang}${item.to}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  color: 'white',
                  textDecoration: 'none',
                  opacity: active ? 1 : 0.7,
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  ...(item.to === '/home' && { marginLeft: '10px' }),
                  ...(item.to === '/map' && { marginRight: '40px' }),
                  ...(item.to === '/community' && { marginLeft: '40px' }),
                  ...(item.to === '/leaderboard' && { marginRight: '10px' }),
                }}
              >
                <item.icon
                  size={26}
                  strokeWidth={active ? 2.6 : 2}
                  color="white"
                />
                <span>{item.label}</span>
              </NavLink>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
