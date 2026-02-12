import React from 'react';

export default function App() {
  return (
    <>
      <header>
        <div className="app-bar-brand">
          <div className="appIcon">🍵</div>
          <h1>
            BytSpot
            <span className="tag">LIVE</span>
          </h1>
        </div>
        <h2>Admin Panel</h2>
      </header>

      <nav className="sidebar">
        <ul className="nav-list">
          <li className="nav-item active">
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </li>
          <li className="nav-item">
            <span className="nav-icon">🔍</span>
            <span>Explore</span>
          </li>
          <li className="nav-item">
            <span className="nav-icon">⭐</span>
            <span>Favorites</span>
          </li>
          <li className="nav-item">
            <span className="nav-icon">📊</span>
            <span>Leaderboard</span>
          </li>
          <li className="nav-item">
            <span className="nav-icon">👤</span>
            <span>Profile</span>
          </li>
          <li className="nav-item">
            <span className="nav-icon">⚙️</span>
            <span>Settings</span>
          </li>
        </ul>
      </nav>

      <main>
        <div className="content-placeholder">
          Welcome to the BytSpot Dashboard. Content will appear here as the platform expands.
        </div>
      </main>
    </>
  );
}
