import React, { useState } from 'react';
import { Shield, Settings, HelpCircle, ChevronRight, AlertTriangle, Activity, FileText, Key, Lock, RefreshCw, Trash2, Shield as ShieldIcon, Server, Users, Bell, Mail } from 'lucide-react';
import './SettingsPage.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('admin');
  const [savedSettings, setSavedSettings] = useState(false);

  // Admin-specific settings
  const [adminSettings, setAdminSettings] = useState({
    systemMaintenance: false,
    debugMode: false,
    logLevel: 'info',
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordPolicy: 'strong',
    twoFactorAuth: true
  });

  const [systemConfig, setSystemConfig] = useState({
    siteName: 'ReviewHub Admin',
    adminEmail: 'admin@reviewhub.com',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY'
  });

  const [securitySettings, setSecuritySettings] = useState({
    enforceSSL: true,
    sessionEncryption: true,
    passwordMinLength: 8,
    auditLogging: true
  });

  const [userManagement, setUserManagement] = useState({
    defaultUserRole: 'user',
    requireEmailVerification: true,
    allowSelfRegistration: false,
    accountApprovalRequired: true
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    desktop: true,
    systemAlerts: true,
    securityEvents: true
  });

  const handleSaveSettings = () => {
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2000);
  };

  const handleResetSettings = () => {
    setAdminSettings({
      systemMaintenance: false,
      debugMode: false,
      logLevel: 'info',
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordPolicy: 'strong',
      twoFactorAuth: true
    });
    
    setSystemConfig({
      siteName: 'ReviewHub Admin',
      adminEmail: 'admin@reviewhub.com',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY'
    });
    
    setSecuritySettings({
      enforceSSL: true,
      sessionEncryption: true,
      passwordMinLength: 8,
      auditLogging: true
    });
    
    setUserManagement({
      defaultUserRole: 'user',
      requireEmailVerification: true,
      allowSelfRegistration: false,
      accountApprovalRequired: true
    });
    
    setNotifications({
      email: true,
      push: false,
      sms: true,
      desktop: true,
      systemAlerts: true,
      securityEvents: true
    });
  };

  const settingsTabs = [
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
          {/* Admin Control Settings */}
          {activeTab === 'admin' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Administrative Controls</h2>
                <p>Manage system-wide administrative settings and permissions</p>
              </div>

              <div className="settings-list">
                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <AlertTriangle size={18} />
                      <span>System Maintenance Mode</span>
                    </div>
                    <p>Put the system in maintenance mode for updates</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={adminSettings.systemMaintenance}
                      onChange={(e) => setAdminSettings({...adminSettings, systemMaintenance: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <Activity size={18} />
                      <span>Debug Mode</span>
                    </div>
                    <p>Enable detailed logging and debug information</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={adminSettings.debugMode}
                      onChange={(e) => setAdminSettings({...adminSettings, debugMode: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <label>Session Timeout (minutes)</label>
                  <input 
                    type="number" 
                    value={adminSettings.sessionTimeout}
                    onChange={(e) => setAdminSettings({...adminSettings, sessionTimeout: parseInt(e.target.value)})}
                    className="setting-input" 
                  />
                  <small>Automatically log out inactive admins after this period</small>
                </div>
              </div>
            </div>
          )}

          {/* System Configuration Settings */}
          {activeTab === 'system' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>System Configuration</h2>
                <p>Configure global system settings and platform preferences</p>
              </div>

              <div className="settings-grid">
                <div className="setting-item">
                  <label>Site Name</label>
                  <input 
                    type="text" 
                    value={systemConfig.siteName}
                    onChange={(e) => setSystemConfig({...systemConfig, siteName: e.target.value})}
                    className="setting-input" 
                  />
                  <small>Display name for the admin panel</small>
                </div>

                <div className="setting-item">
                  <label>Admin Email</label>
                  <input 
                    type="email" 
                    value={systemConfig.adminEmail}
                    onChange={(e) => setSystemConfig({...systemConfig, adminEmail: e.target.value})}
                    className="setting-input" 
                  />
                  <small>Primary contact email for system notifications</small>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Security Configuration</h2>
                <p>Manage security policies and access controls</p>
              </div>

              <div className="settings-list">
                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <Lock size={18} />
                      <span>Enforce SSL</span>
                    </div>
                    <p>Require HTTPS for all connections</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={securitySettings.enforceSSL}
                      onChange={(e) => setSecuritySettings({...securitySettings, enforceSSL: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <ShieldIcon size={18} />
                      <span>Session Encryption</span>
                    </div>
                    <p>Encrypt all session data</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={securitySettings.sessionEncryption}
                      onChange={(e) => setSecuritySettings({...securitySettings, sessionEncryption: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <label>Password Minimum Length</label>
                  <input 
                    type="number" 
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                    className="setting-input" 
                  />
                  <small>Minimum characters required for passwords</small>
                </div>
              </div>
            </div>
          )}

          {/* User Management Settings */}
          {activeTab === 'users' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>User Management</h2>
                <p>Configure user registration, roles, and permissions</p>
              </div>

              <div className="settings-list">
                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <Mail size={18} />
                      <span>Require Email Verification</span>
                    </div>
                    <p>New users must verify email addresses</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={userManagement.requireEmailVerification}
                      onChange={(e) => setUserManagement({...userManagement, requireEmailVerification: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <Users size={18} />
                      <span>Allow Self Registration</span>
                    </div>
                    <p>Users can register without admin approval</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={userManagement.allowSelfRegistration}
                      onChange={(e) => setUserManagement({...userManagement, allowSelfRegistration: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Admin Notifications</h2>
                <p>Configure system alerts and administrative notifications</p>
              </div>

              <div className="settings-list">
                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <Mail size={18} />
                      <span>Email Notifications</span>
                    </div>
                    <p>Receive admin alerts and system updates via email</p>
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
                      <AlertTriangle size={18} />
                      <span>System Alerts</span>
                    </div>
                    <p>Get notified about critical system issues and errors</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.systemAlerts}
                      onChange={(e) => setNotifications({...notifications, systemAlerts: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <ShieldIcon size={18} />
                      <span>Security Events</span>
                    </div>
                    <p>Alert on security breaches and suspicious activities</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.securityEvents}
                      onChange={(e) => setNotifications({...notifications, securityEvents: e.target.checked})}
                    />
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
                <h2>Admin Help & Support</h2>
                <p>Get help with system administration and technical support</p>
              </div>

              <div className="help-cards">
                <div className="help-card">
                  <FileText size={24} />
                  <h3>Admin Documentation</h3>
                  <p>Browse comprehensive admin documentation and system guides</p>
                  <button className="help-btn">View Docs</button>
                </div>

                <div className="help-card">
                  <Mail size={24} />
                  <h3>Technical Support</h3>
                  <p>Get in touch with our technical support team for system issues</p>
                  <button className="help-btn">Contact Support</button>
                </div>

                <div className="help-card">
                  <Server size={24} />
                  <h3>System Status</h3>
                  <p>Check real-time system status and performance metrics</p>
                  <button className="help-btn">View Status</button>
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
              <RefreshCw size={18} />
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
