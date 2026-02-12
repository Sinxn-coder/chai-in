import React, { useState } from 'react';
import { Home, Search, Star, Trophy, User, Settings } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'explore', name: 'Explore', icon: Search },
    { id: 'favorites', name: 'Favorites', icon: Star },
    { id: 'leaderboard', name: 'Leaderboard', icon: Trophy },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const getActiveTabName = () => {
    const activeItem = navItems.find(item => item.id === activeTab);
    return activeItem ? activeItem.name : 'Home';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <div className="content-placeholder">Welcome to the BytSpot Dashboard. Content will appear here as the platform expands.</div>;
      case 'explore':
        return <div className="content-placeholder">Explore new food spots and discover amazing places in your area.</div>;
      case 'favorites':
        return <div className="content-placeholder">Your favorite saved spots will appear here.</div>;
      case 'leaderboard':
        return <div className="content-placeholder">Top contributors and popular spots leaderboard.</div>;
      case 'profile':
        return <div className="content-placeholder">Manage your profile and personal settings.</div>;
      case 'settings':
        return <div className="content-placeholder">Configure your application preferences.</div>;
      default:
        return <div className="content-placeholder">Welcome to the BytSpot Dashboard.</div>;
    }
  };

  return (
    <>
      <header>
        <div className="app-bar-brand">
          <div className="appIcon">🍵</div>
          <h1>BytSpot</h1>
        </div>
        <h2>{getActiveTabName()}</h2>
      </header>

      <nav className="sidebar">
        <ul className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <div className="nav-icon">
                  <Icon size={24} />
                </div>
                <span className="nav-text">{item.name}</span>
              </li>
            );
          })}
        </ul>
      </nav>

      <main>
        {renderContent()}
      </main>
    </>
  );
}
