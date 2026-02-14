import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Settings, 
  Bell, 
  Menu, 
  X, 
  Smartphone,
  Monitor,
  AlertCircle,
  Info
} from 'lucide-react';
import './MobilePage.css';

const MobilePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const mobileMenuItems = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'about', name: 'About', icon: Info },
    { id: 'support', name: 'Support', icon: AlertCircle },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <div className="mobile-content">
            <div className="mobile-welcome">
              <Smartphone className="mobile-icon" />
              <h2>Mobile View</h2>
              <p>This application is optimized for desktop viewing.</p>
              <div className="mobile-features">
                <div className="feature-card">
                  <Monitor className="feature-icon" />
                  <h3>Desktop Experience</h3>
                  <p>Full dashboard functionality available on desktop</p>
                </div>
                <div className="feature-card">
                  <Smartphone className="feature-icon" />
                  <h3>Mobile Limited</h3>
                  <p>Basic information and support only</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="mobile-content">
            <div className="mobile-section">
              <Info className="section-icon" />
              <h2>About This App</h2>
              <p>FoodSpot Platform is a comprehensive food discovery and management system designed primarily for desktop users.</p>
              <div className="info-grid">
                <div className="info-item">
                  <h4>Platform</h4>
                  <p>Food Discovery & Management</p>
                </div>
                <div className="info-item">
                  <h4>Best Experience</h4>
                  <p>Desktop Browser</p>
                </div>
                <div className="info-item">
                  <h4>Mobile Support</h4>
                  <p>Limited Features</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'support':
        return (
          <div className="mobile-content">
            <div className="mobile-section">
              <AlertCircle className="section-icon" />
              <h2>Support</h2>
              <p>Need help? Contact our support team.</p>
              <div className="support-options">
                <div className="support-card">
                  <h4>Email Support</h4>
                  <p>support@foodspot.com</p>
                </div>
                <div className="support-card">
                  <h4>Help Center</h4>
                  <p>Visit our FAQ section</p>
                </div>
                <div className="support-card">
                  <h4>Live Chat</h4>
                  <p>Available 9AM-6PM EST</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="mobile-content">
            <div className="mobile-section">
              <Settings className="section-icon" />
              <h2>Mobile Settings</h2>
              <p>Basic mobile preferences</p>
              <div className="mobile-settings">
                <div className="setting-item">
                  <label>Notifications</label>
                  <div className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </div>
                </div>
                <div className="setting-item">
                  <label>Dark Mode</label>
                  <div className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </div>
                </div>
                <div className="setting-item">
                  <label>Auto-refresh</label>
                  <div className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="mobile-content">
            <div className="mobile-welcome">
              <Smartphone className="mobile-icon" />
              <h2>Mobile View</h2>
              <p>Select an option from the menu to get started.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="mobile-page">
      {/* Red App Bar */}
      <div className="mobile-app-bar">
        <div className="app-bar-left">
          <button className="menu-btn" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="app-title">FoodSpot</h1>
        </div>
        <div className="app-bar-right">
          <button className="notification-btn">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay" onClick={toggleMenu}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="menu-header">
              <h3>Menu</h3>
              <button className="close-menu-btn" onClick={toggleMenu}>
                <X size={20} />
              </button>
            </div>
            <ul className="menu-list">
              {mobileMenuItems.map((item) => (
                <li
                  key={item.id}
                  className={`menu-item ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => handleMenuClick(item.id)}
                >
                  <item.icon size={18} className="menu-icon" />
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Mobile Content */}
      <div className="mobile-container">
        {renderContent()}
      </div>

      {/* Mobile Footer */}
      <div className="mobile-footer">
        <p>© 2024 FoodSpot Platform</p>
        <p>Desktop Recommended</p>
      </div>
    </div>
  );
};

export default MobilePage;
