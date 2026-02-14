import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database, 
  HelpCircle, 
  ChevronRight,
  Moon,
  Sun,
  Volume2,
  Wifi,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Check
} from 'lucide-react';
import './SettingsPage.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    desktop: true
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    dataSharing: true,
    analytics: false,
    cookies: true
  });
  const [appearance, setAppearance] = useState({
    theme: 'light',
    language: 'en',
    fontSize: 'medium',
    compactMode: false
  });

  const [savedSettings, setSavedSettings] = useState(false);

  const handleSaveSettings = () => {
    // Simulate saving settings
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2000);
  };

  const handleResetSettings = () => {
    // Reset to defaults
    setNotifications({
      email: true,
      push: false,
      sms: true,
      desktop: true
    });
    setPrivacy({
      profileVisibility: 'public',
      dataSharing: true,
      analytics: false,
      cookies: true
    });
    setAppearance({
      theme: 'light',
      language: 'en',
      fontSize: 'medium',
      compactMode: false
    });
  };

  const settingsTabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'advanced', label: 'Advanced', icon: Database },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
  ];

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="settings-container">
        {/* Settings Navigation */}
        <div className="settings-nav">
          <div className="nav-tabs">
            {settingsTabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                  <ChevronRight size={16} className="chevron" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Profile Settings</h2>
                <p>Update your personal information and account details</p>
              </div>

              <div className="settings-grid">
                <div className="setting-item">
                  <label>Full Name</label>
                  <input type="text" defaultValue="Admin User" className="setting-input" />
                </div>

                <div className="setting-item">
                  <label>Email Address</label>
                  <input type="email" defaultValue="admin@example.com" className="setting-input" />
                </div>

                <div className="setting-item">
                  <label>Username</label>
                  <input type="text" defaultValue="admin" className="setting-input" />
                </div>

                <div className="setting-item">
                  <label>Phone Number</label>
                  <input type="tel" defaultValue="+1 234 567 8900" className="setting-input" />
                </div>

                <div className="setting-item full-width">
                  <label>Bio</label>
                  <textarea 
                    className="setting-textarea" 
                    rows={4}
                    defaultValue="Passionate about creating amazing user experiences and managing review systems efficiently."
                  />
                </div>

                <div className="setting-item full-width">
                  <label>Change Password</label>
                  <div className="password-input-group">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      defaultValue="password123"
                      className="setting-input"
                    />
                    <button 
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Notification Preferences</h2>
                <p>Choose how you want to be notified about updates</p>
              </div>

              <div className="settings-list">
                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <Mail size={18} />
                      <span>Email Notifications</span>
                    </div>
                    <p>Receive updates and alerts via email</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.email}
                      onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <Bell size={18} />
                      <span>Push Notifications</span>
                    </div>
                    <p>Get instant push notifications on your device</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.push}
                      onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <Volume2 size={18} />
                      <span>SMS Notifications</span>
                    </div>
                    <p>Receive text messages for important updates</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.sms}
                      onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <Wifi size={18} />
                      <span>Desktop Notifications</span>
                    </div>
                    <p>Show browser notifications when active</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.desktop}
                      onChange={(e) => setNotifications({...notifications, desktop: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Privacy & Security</h2>
                <p>Control your privacy settings and security preferences</p>
              </div>

              <div className="settings-list">
                <div className="setting-select">
                  <div className="select-info">
                    <div className="select-header">
                      <Eye size={18} />
                      <span>Profile Visibility</span>
                    </div>
                    <p>Control who can see your profile</p>
                  </div>
                  <select 
                    value={privacy.profileVisibility}
                    onChange={(e) => setPrivacy({...privacy, profileVisibility: e.target.value})}
                    className="setting-select-input"
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <Database size={18} />
                      <span>Data Sharing</span>
                    </div>
                    <p>Share anonymous usage data to improve the service</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={privacy.dataSharing}
                      onChange={(e) => setPrivacy({...privacy, dataSharing: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <Shield size={18} />
                      <span>Analytics Tracking</span>
                    </div>
                    <p>Allow analytics tracking for personalized experience</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={privacy.analytics}
                      onChange={(e) => setPrivacy({...privacy, analytics: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <Lock size={18} />
                      <span>Cookie Consent</span>
                    </div>
                    <p>Allow cookies for enhanced functionality</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={privacy.cookies}
                      onChange={(e) => setPrivacy({...privacy, cookies: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Appearance</h2>
                <p>Customize the look and feel of your interface</p>
              </div>

              <div className="settings-grid">
                <div className="setting-item">
                  <label>Theme</label>
                  <div className="theme-selector">
                    <button 
                      className={`theme-option ${appearance.theme === 'light' ? 'active' : ''}`}
                      onClick={() => setAppearance({...appearance, theme: 'light'})}
                    >
                      <Sun size={18} />
                      <span>Light</span>
                    </button>
                    <button 
                      className={`theme-option ${appearance.theme === 'dark' ? 'active' : ''}`}
                      onClick={() => setAppearance({...appearance, theme: 'dark'})}
                    >
                      <Moon size={18} />
                      <span>Dark</span>
                    </button>
                    <button 
                      className={`theme-option ${appearance.theme === 'auto' ? 'active' : ''}`}
                      onClick={() => setAppearance({...appearance, theme: 'auto'})}
                    >
                      <Palette size={18} />
                      <span>Auto</span>
                    </button>
                  </div>
                </div>

                <div className="setting-item">
                  <label>Language</label>
                  <select 
                    value={appearance.language}
                    onChange={(e) => setAppearance({...appearance, language: e.target.value})}
                    className="setting-input"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="zh">Chinese</option>
                    <option value="ja">Japanese</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Font Size</label>
                  <select 
                    value={appearance.fontSize}
                    onChange={(e) => setAppearance({...appearance, fontSize: e.target.value})}
                    className="setting-input"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="extra-large">Extra Large</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Interface Mode</label>
                  <div className="mode-selector">
                    <button 
                      className={`mode-option ${!appearance.compactMode ? 'active' : ''}`}
                      onClick={() => setAppearance({...appearance, compactMode: false})}
                    >
                      <span>Comfortable</span>
                    </button>
                    <button 
                      className={`mode-option ${appearance.compactMode ? 'active' : ''}`}
                      onClick={() => setAppearance({...appearance, compactMode: true})}
                    >
                      <span>Compact</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Settings */}
          {activeTab === 'advanced' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Advanced Settings</h2>
                <p>Advanced configuration options for power users</p>
              </div>

              <div className="settings-list">
                <div className="setting-item">
                  <label>API Rate Limit</label>
                  <input type="number" defaultValue="1000" className="setting-input" />
                  <small>Requests per hour</small>
                </div>

                <div className="setting-item">
                  <label>Cache Duration</label>
                  <input type="number" defaultValue="3600" className="setting-input" />
                  <small>Seconds</small>
                </div>

                <div className="setting-item">
                  <label>Session Timeout</label>
                  <input type="number" defaultValue="30" className="setting-input" />
                  <small>Minutes</small>
                </div>

                <div className="setting-item">
                  <label>Debug Mode</label>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Help & Support */}
          {activeTab === 'help' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Help & Support</h2>
                <p>Get help and find answers to common questions</p>
              </div>

              <div className="help-cards">
                <div className="help-card">
                  <HelpCircle size={24} />
                  <h3>Documentation</h3>
                  <p>Browse our comprehensive documentation to learn about all features</p>
                  <button className="help-btn">View Docs</button>
                </div>

                <div className="help-card">
                  <Mail size={24} />
                  <h3>Contact Support</h3>
                  <p>Get in touch with our support team for assistance</p>
                  <button className="help-btn">Contact Us</button>
                </div>

                <div className="help-card">
                  <Globe size={24} />
                  <h3>Community Forum</h3>
                  <p>Join our community to discuss with other users</p>
                  <button className="help-btn">Visit Forum</button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="settings-actions">
            <button 
              className={`save-btn ${savedSettings ? 'saved' : ''}`}
              onClick={handleSaveSettings}
            >
              {savedSettings ? <Check size={18} /> : <Save size={18} />}
              {savedSettings ? 'Settings Saved!' : 'Save Changes'}
            </button>
            
            <button className="reset-btn" onClick={handleResetSettings}>
              <RotateCcw size={18} />
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
