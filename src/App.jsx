import React from 'react';
import { Home, Search, Star, Trophy, User, Settings } from 'lucide-react';

export default function App() {
  return (
    <>
      <header>
        <div className="app-bar-brand">
          <div className="appIcon">🍵</div>
          <h1>BytSpot</h1>
        </div>
        <h2>Admin Panel</h2>
      </header>

      <nav className="sidebar">
        <ul className="nav-list">
          <li className="nav-item active">
            <div className="nav-icon">
              <Home size={24} />
            </div>
            <span className="nav-text">Home</span>
          </li>
          <li className="nav-item">
            <div className="nav-icon">
              <Search size={24} />
            </div>
            <span className="nav-text">Explore</span>
          </li>
          <li className="nav-item">
            <div className="nav-icon">
              <Star size={24} />
            </div>
            <span className="nav-text">Favorites</span>
          </li>
          <li className="nav-item">
            <div className="nav-icon">
              <Trophy size={24} />
            </div>
            <span className="nav-text">Leaderboard</span>
          </li>
          <li className="nav-item">
            <div className="nav-icon">
              <User size={24} />
            </div>
            <span className="nav-text">Profile</span>
          </li>
          <li className="nav-item">
            <div className="nav-icon">
              <Settings size={24} />
            </div>
            <span className="nav-text">Settings</span>
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
