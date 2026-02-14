import React, { useState } from 'react';
import { 
  Shield, 
  Database, 
  Users, 
  Settings, 
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
  Check,
  Key,
  AlertTriangle,
  Globe,
  Server,
  FileText,
  BarChart3,
  UserCheck,
  Ban,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Edit,
  Search,
  Filter,
  Calendar,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';
import './SettingsPage.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Admin-specific settings
  const [adminSettings, setAdminSettings] = useState({
    systemMaintenance: false,
    debugMode: false,
    logLevel: 'info',
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordPolicy: 'strong',
    twoFactorAuth: true,
    ipWhitelist: '',
    apiRateLimit: 1000,
    backupFrequency: 'daily',
    autoCleanup: true,
    emailNotifications: true,
    securityAlerts: true,
    userRegistration: 'admin',
    contentModeration: true,
    dataRetention: 365
  });

  const [systemConfig, setSystemConfig] = useState({
    siteName: 'ReviewHub Admin',
    adminEmail: 'admin@reviewhub.com',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    language: 'en',
    itemsPerPage: 25,
    exportFormat: 'csv',
    autoSave: true,
    theme: 'light'
  });

  const [securitySettings, setSecuritySettings] = useState({
    enforceSSL: true,
    sessionEncryption: true,
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: true,
    sessionTimeoutMinutes: 30,
    maxConcurrentSessions: 3,
    loginLockoutDuration: 15,
    auditLogging: true,
    ipRestrictions: false,
    allowedIPs: '',
    apiAuthentication: 'bearer'
  });

  const [userManagement, setUserManagement] = useState({
    defaultUserRole: 'user',
    requireEmailVerification: true,
    allowSelfRegistration: false,
    accountApprovalRequired: true,
    userDeletionPolicy: 'soft',
    bulkUserActions: true,
    userImportEnabled: true,
    userExportEnabled: true,
    profileFieldsRequired: ['email', 'name'],
    userProfileVisibility: 'public'
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    desktop: true,
    systemAlerts: true,
    userActivity: false,
    securityEvents: true,
    backupReminders: true,
    maintenanceAlerts: true,
    performanceAlerts: true
  });

  const [savedSettings, setSavedSettings] = useState(false);

  const handleSaveSettings = () => {
    // Simulate saving settings
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2000);
  };

  const handleResetSettings = () => {
    // Reset to admin defaults
    setAdminSettings({
      systemMaintenance: false,
      debugMode: false,
      logLevel: 'info',
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordPolicy: 'strong',
      twoFactorAuth: true,
      ipWhitelist: '',
      apiRateLimit: 1000,
      backupFrequency: 'daily',
      autoCleanup: true,
      emailNotifications: true,
      securityAlerts: true,
      userRegistration: 'admin',
      contentModeration: true,
      dataRetention: 365
    });
    
    setSystemConfig({
      siteName: 'ReviewHub Admin',
      adminEmail: 'admin@reviewhub.com',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      language: 'en',
      itemsPerPage: 25,
      exportFormat: 'csv',
      autoSave: true,
      theme: 'light'
    });
    
    setSecuritySettings({
      enforceSSL: true,
      sessionEncryption: true,
      passwordMinLength: 8,
      passwordRequireUppercase: true,
      passwordRequireNumbers: true,
      passwordRequireSymbols: true,
      sessionTimeoutMinutes: 30,
      maxConcurrentSessions: 3,
      loginLockoutDuration: 15,
      auditLogging: true,
      ipRestrictions: false,
      allowedIPs: '',
      apiAuthentication: 'bearer'
    });
    
    setUserManagement({
      defaultUserRole: 'user',
      requireEmailVerification: true,
      allowSelfRegistration: false,
      accountApprovalRequired: true,
      userDeletionPolicy: 'soft',
      bulkUserActions: true,
      userImportEnabled: true,
      userExportEnabled: true,
      profileFieldsRequired: ['email', 'name'],
      userProfileVisibility: 'public'
    });
    
    setNotifications({
      email: true,
      push: false,
      sms: true,
      desktop: true,
      systemAlerts: true,
      userActivity: false,
      securityEvents: true,
      backupReminders: true,
      maintenanceAlerts: true,
      performanceAlerts: true
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

                <div className="setting-select">
                  <div className="select-info">
                    <div className="select-header">
                      <FileText size={18} />
                      <span>Log Level</span>
                    </div>
                    <p>Set the minimum level of logs to record</p>
                  </div>
                  <select 
                    value={adminSettings.logLevel}
                    onChange={(e) => setAdminSettings({...adminSettings, logLevel: e.target.value})}
                    className="setting-select-input"
                  >
                    <option value="error">Error Only</option>
                    <option value="warn">Warning & Above</option>
                    <option value="info">Info & Above</option>
                    <option value="debug">Debug & Above</option>
                  </select>
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

                <div className="setting-item">
                  <label>Max Login Attempts</label>
                  <input 
                    type="number" 
                    value={adminSettings.maxLoginAttempts}
                    onChange={(e) => setAdminSettings({...adminSettings, maxLoginAttempts: parseInt(e.target.value)})}
                    className="setting-input" 
                  />
                  <small>Lock account after this many failed attempts</small>
                </div>

                <div className="setting-select">
                  <div className="select-info">
                    <div className="select-header">
                      <Shield size={18} />
                      <span>Password Policy</span>
                    </div>
                    <p>Set minimum password requirements</p>
                  </div>
                  <select 
                    value={adminSettings.passwordPolicy}
                    onChange={(e) => setAdminSettings({...adminSettings, passwordPolicy: e.target.value})}
                    className="setting-select-input"
                  >
                    <option value="basic">Basic (6+ chars)</option>
                    <option value="medium">Medium (8+ chars, mixed case)</option>
                    <option value="strong">Strong (8+ chars, mixed case, numbers, symbols)</option>
                  </select>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <Key size={18} />
                      <span>Two-Factor Authentication</span>
                    </div>
                    <p>Require 2FA for all admin accounts</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={adminSettings.twoFactorAuth}
                      onChange={(e) => setAdminSettings({...adminSettings, twoFactorAuth: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <label>API Rate Limit (requests/hour)</label>
                  <input 
                    type="number" 
                    value={adminSettings.apiRateLimit}
                    onChange={(e) => setAdminSettings({...adminSettings, apiRateLimit: parseInt(e.target.value)})}
                    className="setting-input" 
                  />
                  <small>Limit API requests per admin per hour</small>
                </div>

                <div className="setting-select">
                  <div className="select-info">
                    <div className="select-header">
                      <RefreshCw size={18} />
                      <span>Backup Frequency</span>
                    </div>
                    <p>How often to create system backups</p>
                  </div>
                  <select 
                    value={adminSettings.backupFrequency}
                    onChange={(e) => setAdminSettings({...adminSettings, backupFrequency: e.target.value})}
                    className="setting-select-input"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <Trash2 size={18} />
                      <span>Auto Cleanup</span>
                    </div>
                    <p>Automatically clean up old logs and temporary files</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={adminSettings.autoCleanup}
                      onChange={(e) => setAdminSettings({...adminSettings, autoCleanup: e.target.checked})}
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
                      <Users size={18} />
                      <span>User Activity</span>
                    </div>
                    <p>Monitor user registrations and profile changes</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.userActivity}
                      onChange={(e) => setNotifications({...notifications, userActivity: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <Shield size={18} />
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

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <RefreshCw size={18} />
                      <span>Backup Reminders</span>
                    </div>
                    <p>Get notified about backup status and failures</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.backupReminders}
                      onChange={(e) => setNotifications({...notifications, backupReminders: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <AlertTriangle size={18} />
                      <span>Maintenance Alerts</span>
                    </div>
                    <p>Notify about scheduled maintenance and downtime</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.maintenanceAlerts}
                      onChange={(e) => setNotifications({...notifications, maintenanceAlerts: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <TrendingUp size={18} />
                      <span>Performance Alerts</span>
                    </div>
                    <p>Alert when system performance exceeds thresholds</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.performanceAlerts}
                      onChange={(e) => setNotifications({...notifications, performanceAlerts: e.target.checked})}
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
                    <p>Get instant push notifications on mobile devices</p>
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
                    <p>Receive critical alerts via text message</p>
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
                    <p>Show browser notifications for real-time alerts</p>
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

                <div className="setting-item">
                  <label>Timezone</label>
                  <select 
                    value={systemConfig.timezone}
                    onChange={(e) => setSystemConfig({...systemConfig, timezone: e.target.value})}
                    className="setting-input"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="PST">Pacific Time</option>
                    <option value="GMT">Greenwich Mean Time</option>
                    <option value="CET">Central European Time</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Date Format</label>
                  <select 
                    value={systemConfig.dateFormat}
                    onChange={(e) => setSystemConfig({...systemConfig, dateFormat: e.target.value})}
                    className="setting-input"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="DD MMM YYYY">DD MMM YYYY</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Time Format</label>
                  <select 
                    value={systemConfig.timeFormat}
                    onChange={(e) => setSystemConfig({...systemConfig, timeFormat: e.target.value})}
                    className="setting-input"
                  >
                    <option value="12h">12-hour (AM/PM)</option>
                    <option value="24h">24-hour</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Language</label>
                  <select 
                    value={systemConfig.language}
                    onChange={(e) => setSystemConfig({...systemConfig, language: e.target.value})}
                    className="setting-input"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="zh">Chinese</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Items Per Page</label>
                  <input 
                    type="number" 
                    value={systemConfig.itemsPerPage}
                    onChange={(e) => setSystemConfig({...systemConfig, itemsPerPage: parseInt(e.target.value)})}
                    className="setting-input" 
                  />
                  <small>Default number of items in data tables</small>
                </div>

                <div className="setting-item">
                  <label>Export Format</label>
                  <select 
                    value={systemConfig.exportFormat}
                    onChange={(e) => setSystemConfig({...systemConfig, exportFormat: e.target.value})}
                    className="setting-input"
                  >
                    <option value="csv">CSV</option>
                    <option value="xlsx">Excel (XLSX)</option>
                    <option value="json">JSON</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>

                <div className="setting-item full-width">
                  <label>Auto Save</label>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={systemConfig.autoSave}
                      onChange={(e) => setSystemConfig({...systemConfig, autoSave: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <small>Automatically save form inputs and drafts</small>
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
                      <Shield size={18} />
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

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <FileText size={18} />
                      <span>Require Uppercase Letters</span>
                    </div>
                    <p>Passwords must contain uppercase letters</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={securitySettings.passwordRequireUppercase}
                      onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireUppercase: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <BarChart3 size={18} />
                      <span>Require Numbers</span>
                    </div>
                    <p>Passwords must contain numeric characters</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={securitySettings.passwordRequireNumbers}
                      onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireNumbers: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <AlertTriangle size={18} />
                      <span>Require Symbols</span>
                    </div>
                    <p>Passwords must contain special characters</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={securitySettings.passwordRequireSymbols}
                      onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireSymbols: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <label>Session Timeout (minutes)</label>
                  <input 
                    type="number" 
                    value={securitySettings.sessionTimeoutMinutes}
                    onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeoutMinutes: parseInt(e.target.value)})}
                    className="setting-input" 
                  />
                  <small>Automatically log out after inactivity</small>
                </div>

                <div className="setting-item">
                  <label>Max Concurrent Sessions</label>
                  <input 
                    type="number" 
                    value={securitySettings.maxConcurrentSessions}
                    onChange={(e) => setSecuritySettings({...securitySettings, maxConcurrentSessions: parseInt(e.target.value)})}
                    className="setting-input" 
                  />
                  <small>Maximum sessions per admin account</small>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <Activity size={18} />
                      <span>Audit Logging</span>
                    </div>
                    <p>Log all admin actions for security audit</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={securitySettings.auditLogging}
                      onChange={(e) => setSecuritySettings({...securitySettings, auditLogging: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
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
                <div className="setting-select">
                  <div className="select-info">
                    <div className="select-header">
                      <UserCheck size={18} />
                      <span>Default User Role</span>
                    </div>
                    <p>Set the default role for new users</p>
                  </div>
                  <select 
                    value={userManagement.defaultUserRole}
                    onChange={(e) => setUserManagement({...userManagement, defaultUserRole: e.target.value})}
                    className="setting-select-input"
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                    <option value="readonly">Read Only</option>
                  </select>
                </div>

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

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <Check size={18} />
                      <span>Account Approval Required</span>
                    </div>
                    <p>Admin must approve new user accounts</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={userManagement.accountApprovalRequired}
                      onChange={(e) => setUserManagement({...userManagement, accountApprovalRequired: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-select">
                  <div className="select-info">
                    <div className="select-header">
                      <Trash2 size={18} />
                      <span>User Deletion Policy</span>
                    </div>
                    <p>How to handle deleted user accounts</p>
                  </div>
                  <select 
                    value={userManagement.userDeletionPolicy}
                    onChange={(e) => setUserManagement({...userManagement, userDeletionPolicy: e.target.value})}
                    className="setting-select-input"
                  >
                    <option value="soft">Soft Delete (Recoverable)</option>
                    <option value="hard">Hard Delete (Permanent)</option>
                    <option value="archive">Archive (Keep Data)</option>
                  </select>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <Edit size={18} />
                      <span>Bulk User Actions</span>
                    </div>
                    <p>Allow bulk operations on multiple users</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={userManagement.bulkUserActions}
                      onChange={(e) => setUserManagement({...userManagement, bulkUserActions: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <Upload size={18} />
                      <span>User Import</span>
                    </div>
                    <p>Allow importing users from CSV files</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={userManagement.userImportEnabled}
                      onChange={(e) => setUserManagement({...userManagement, userImportEnabled: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-toggle">
                  <div className="toggle-info">
                    <div className="toggle-header">
                      <Download size={18} />
                      <span>User Export</span>
                    </div>
                    <p>Allow exporting user data</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={userManagement.userExportEnabled}
                      onChange={(e) => setUserManagement({...userManagement, userExportEnabled: e.target.checked})}
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
              <RotateCcw size={18} />
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
