import React, { useState } from 'react';
import { Shield, Server, Lock, Users, Bell, HelpCircle, ChevronRight, AlertTriangle, Activity, Mail, FileText, RefreshCw, Save, Check } from 'lucide-react';
import './SettingsPage.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('admin');
  const [savedSettings, setSavedSettings] = useState(false);

  // Simple state for demo
  const [settings, setSettings] = useState({
    maintenance: false,
    debug: false,
    ssl: true,
    emailNotifications: true,
    requireEmailVerification: true,
    allowSelfRegistration: false
  });

  const handleSaveSettings = () => {
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2000);
  };

  const handleResetSettings = () => {
    setSettings({
      maintenance: false,
      debug: false,
      ssl: true,
      emailNotifications: true,
      requireEmailVerification: true,
      allowSelfRegistration: false
    });
  };

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const tabs = [
    { id: 'admin', label: 'Admin Control', icon: Shield },
    { id: 'system', label: 'System Config', icon: Server },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
  ];

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Admin Settings</h1>
        <p>Manage system configuration and administrative controls</p>
      </div>

      <div className="settings-container">
        {/* Navigation */}
        <div className="settings-nav">
          <div className="nav-tabs">
            {tabs.map(tab => {
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

        {/* Content */}
        <div className="settings-content">
          {activeTab === 'admin' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Administrative Controls</h2>
                <p>Manage system-wide administrative settings</p>
              </div>

              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-header">
                      <AlertTriangle size={18} />
                      <span>Maintenance Mode</span>
                    </div>
                    <p>Put system in maintenance mode</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.maintenance}
                      onChange={() => handleToggle('maintenance')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-header">
                      <Activity size={18} />
                      <span>Debug Mode</span>
                    </div>
                    <p>Enable debug logging</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.debug}
                      onChange={() => handleToggle('debug')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>System Configuration</h2>
                <p>Configure global system settings</p>
              </div>

              <div className="settings-grid">
                <div className="setting-item">
                  <label>Site Name</label>
                  <input 
                    type="text" 
                    defaultValue="ReviewHub Admin"
                    className="setting-input" 
                  />
                </div>

                <div className="setting-item">
                  <label>Admin Email</label>
                  <input 
                    type="email" 
                    defaultValue="admin@reviewhub.com"
                    className="setting-input" 
                  />
                </div>

                <div className="setting-item">
                  <label>Timezone</label>
                  <select className="setting-input">
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="PST">Pacific Time</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Security Configuration</h2>
                <p>Manage security policies</p>
              </div>

              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-header">
                      <Lock size={18} />
                      <span>SSL Enforcement</span>
                    </div>
                    <p>Require HTTPS connections</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.ssl}
                      onChange={() => handleToggle('ssl')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <label>Password Min Length</label>
                  <input 
                    type="number" 
                    defaultValue="8"
                    min="6"
                    max="20"
                    className="setting-input" 
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>User Management</h2>
                <p>Configure user registration and permissions</p>
              </div>

              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-header">
                      <Mail size={18} />
                      <span>Email Verification</span>
                    </div>
                    <p>Require email verification</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.requireEmailVerification}
                      onChange={() => handleToggle('requireEmailVerification')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-header">
                      <Users size={18} />
                      <span>Self Registration</span>
                    </div>
                    <p>Allow users to register</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.allowSelfRegistration}
                      onChange={() => handleToggle('allowSelfRegistration')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Admin Notifications</h2>
                <p>Configure system alerts</p>
              </div>

              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-header">
                      <Mail size={18} />
                      <span>Email Notifications</span>
                    </div>
                    <p>Receive admin alerts via email</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.emailNotifications}
                      onChange={() => handleToggle('emailNotifications')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Admin Help & Support</h2>
                <p>Get help with system administration</p>
              </div>

              <div className="help-cards">
                <div className="help-card">
                  <FileText size={24} />
                  <h3>Documentation</h3>
                  <p>Browse admin documentation</p>
                  <button className="help-btn">View Docs</button>
                </div>

                <div className="help-card">
                  <Mail size={24} />
                  <h3>Support</h3>
                  <p>Contact technical support</p>
                  <button className="help-btn">Contact</button>
                </div>

                <div className="help-card">
                  <Server size={24} />
                  <h3>System Status</h3>
                  <p>Check system performance</p>
                  <button className="help-btn">Status</button>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="settings-actions">
            <button 
              className={`save-btn ${savedSettings ? 'saved' : ''}`}
              onClick={handleSaveSettings}
            >
              {savedSettings ? <Check size={18} /> : <Save size={18} />}
              {savedSettings ? 'Saved!' : 'Save Changes'}
            </button>
            
            <button className="reset-btn" onClick={handleResetSettings}>
              <RefreshCw size={18} />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
