import React from 'react';
import { Home, Map, Plus, Flame, Crown } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const BottomNav = ({ lang = 'en' }) => {
  const location = useLocation();

  const navItems = [
    { to: '/home', icon: Home, label: 'Home' },
    { to: '/map', icon: Map, label: 'Map' },
    { to: '/community', icon: Flame, label: 'Club' },
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
        height: 110,
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    >
      {/* NAV BAR SHAPE */}
      <svg
        width="100%"
        height="110"
        viewBox="0 0 400 110"
        preserveAspectRatio="none"
        style={{ display: 'block', pointerEvents: 'auto' }}
      >
        <path
          d="
            M0 30
            Q0 0 30 0
            H140
            C155 0 165 10 170 20
            C180 45 220 45 230 20
            C235 10 245 0 260 0
            H370
            Q400 0 400 30
            V110
            H0
            Z
          "
          fill="#EF2A39"
        />
      </svg>

      {/* FLOATING PLUS BUTTON */}
      <div
        style={{
          position: 'absolute',
          top: -28,
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
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: '#EF2A39',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow:
                '0 12px 28px rgba(239,42,57,0.45), inset 0 2px 6px rgba(255,255,255,0.35)',
              border: '4px solid rgba(255,255,255,0.35)',
            }}
          >
            <Plus size={30} color="#fff" strokeWidth={3} />
          </motion.div>
        </NavLink>
      </div>

      {/* NAV ITEMS */}
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          left: 0,
          right: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          alignItems: 'center',
          padding: '0 26px',
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
