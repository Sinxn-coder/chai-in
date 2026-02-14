import React, { useState } from 'react';
import { Shield, Server, Lock, Users, Bell, HelpCircle, ChevronRight, AlertTriangle, Activity, Mail, FileText, RefreshCw, Save, Check, Database, Globe, Key, Download, Upload, BarChart3, Clock, TrendingUp, UserCheck, Ban, Search, Filter, Calendar, Eye, EyeOff, Copy, Trash2, Edit, Plus, X } from 'lucide-react';
import './SettingsPage.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('admin');
  const [savedSettings, setSavedSettings] = useState(false);

  // Enhanced admin settings
  const [adminSettings, setAdminSettings] = useState({
    maintenance: false,
    debug: false,
    logLevel: 'info',
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordPolicy: 'strong',
    twoFactorAuth: true,
    apiRateLimit: 1000,
    backupFrequency: 'daily',
    autoCleanup: true,
    systemMonitoring: true
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
    ssl: true,
    sessionEncryption: true,
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: true,
    sessionTimeoutMinutes: 30,
    maxConcurrentSessions: 3,
    auditLogging: true,
    ipRestrictions: false,
    twoFactorAuth: true
  });

  const [userManagement, setUserManagement] = useState({
    defaultUserRole: 'user',
    requireEmailVerification: true,
    allowSelfRegistration: false,
    accountApprovalRequired: true,
    userDeletionPolicy: 'soft',
    bulkUserActions: true,
    userImportEnabled: true,
    userExportEnabled: true
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

  const [advancedSettings, setAdvancedSettings] = useState({
    cacheDuration: 3600,
    maxFileSize: 10,
    allowedFileTypes: ['jpg', 'png', 'pdf', 'doc', 'docx'],
    rateLimitPerMinute: 60,
    databaseBackup: true,
    logRetention: 30,
    errorReporting: true,
    analyticsEnabled: true
  });

  const handleSaveSettings = () => {
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2000);
  };

  const handleResetSettings = () => {
    setAdminSettings({
      maintenance: false,
      debug: false,
      logLevel: 'info',
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordPolicy: 'strong',
      twoFactorAuth: true,
      apiRateLimit: 1000,
      backupFrequency: 'daily',
      autoCleanup: true,
      systemMonitoring: true
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
      ssl: true,
      sessionEncryption: true,
      passwordMinLength: 8,
      passwordRequireUppercase: true,
      passwordRequireNumbers: true,
      passwordRequireSymbols: true,
      sessionTimeoutMinutes: 30,
      maxConcurrentSessions: 3,
      auditLogging: true,
      ipRestrictions: false,
      twoFactorAuth: true
    });
    
    setUserManagement({
      defaultUserRole: 'user',
      requireEmailVerification: true,
      allowSelfRegistration: false,
      accountApprovalRequired: true,
      userDeletionPolicy: 'soft',
      bulkUserActions: true,
      userImportEnabled: true,
      userExportEnabled: true
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
    
    setAdvancedSettings({
      cacheDuration: 3600,
      maxFileSize: 10,
      allowedFileTypes: ['jpg', 'png', 'pdf', 'doc', 'docx'],
      rateLimitPerMinute: 60,
      databaseBackup: true,
      logRetention: 30,
      errorReporting: true,
      analyticsEnabled: true
    });
  };

  const handleToggle = (section, key) => {
    switch (section) {
      case 'admin':
        setAdminSettings(prev => ({ ...prev, [key]: !prev[key] }));
        break;
      case 'security':
        setSecuritySettings(prev => ({ ...prev, [key]: !prev[key] }));
        break;
      case 'userManagement':
        setUserManagement(prev => ({ ...prev, [key]: !prev[key] }));
        break;
      case 'notifications':
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
        break;
      case 'advanced':
        setAdvancedSettings(prev => ({ ...prev, [key]: !prev[key] }));
        break;
      default:
        break;
    }
  };

  const handleInputChange = (section, field, value) => {
    switch (section) {
      case 'system':
        setSystemConfig(prev => ({ ...prev, [field]: value }));
        break;
      case 'security':
        setSecuritySettings(prev => ({ ...prev, [field]: value }));
        break;
      case 'admin':
        setAdminSettings(prev => ({ ...prev, [field]: value }));
        break;
      case 'userManagement':
        setUserManagement(prev => ({ ...prev, [field]: value }));
        break;
      case 'advanced':
        setAdvancedSettings(prev => ({ ...prev, [field]: value }));
        break;
      default:
        break;
    }
  };

  const tabs = [
    { id: 'admin', label: 'Admin Control', icon: Shield },
    { id: 'system', label: 'System Config', icon: Server },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'advanced', label: 'Advanced', icon: Database },
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
                <p>Manage system-wide administrative settings and permissions</p>
              </div>

              {/* Admin Dashboard Overview */}
              <div className="admin-dashboard">
                <div className="dashboard-stats">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <Shield size={24} />
                    </div>
                    <div className="stat-content">
                      <h4>System Health</h4>
                      <div className="stat-value">Operational</div>
                      <div className="stat-status online">● Online</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <Users size={24} />
                    </div>
                    <div className="stat-content">
                      <h4>Active Admins</h4>
                      <div className="stat-value">3</div>
                      <div className="stat-status">● Active</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <Activity size={24} />
                    </div>
                    <div className="stat-content">
                      <h4>System Load</h4>
                      <div className="stat-value">45%</div>
                      <div className="stat-status">● Normal</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <Database size={24} />
                    </div>
                    <div className="stat-content">
                      <h4>Last Backup</h4>
                      <div className="stat-value">2h ago</div>
                      <div className="stat-status">● Success</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Critical Controls */}
              <div className="critical-controls">
                <div className="controls-header">
                  <h3>⚡ Critical Controls</h3>
                  <p>Essential system management options</p>
                </div>
                <div className="controls-grid">
                  <div className="control-card critical">
                    <div className="control-header">
                      <AlertTriangle size={20} />
                      <div className="control-info">
                        <h4>Maintenance Mode</h4>
                        <p>Put system in maintenance mode</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={adminSettings.maintenance}
                        onChange={() => handleToggle('admin', 'maintenance')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="control-card critical">
                    <div className="control-header">
                      <Activity size={20} />
                      <div className="control-info">
                        <h4>Debug Mode</h4>
                        <p>Enable detailed logging</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={adminSettings.debug}
                        onChange={() => handleToggle('admin', 'debug')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="control-card critical">
                    <div className="control-header">
                      <BarChart3 size={20} />
                      <div className="control-info">
                        <h4>System Monitoring</h4>
                        <p>Performance tracking</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={adminSettings.systemMonitoring}
                        onChange={() => handleToggle('admin', 'systemMonitoring')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Security & Access */}
              <div className="security-section">
                <div className="controls-header">
                  <h3>🔒 Security & Access</h3>
                  <p>Authentication and security policies</p>
                </div>
                <div className="controls-grid">
                  <div className="control-card">
                    <div className="control-header">
                      <Key size={20} />
                      <div className="control-info">
                        <h4>Two-Factor Auth</h4>
                        <p>Required for admin accounts</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={adminSettings.twoFactorAuth}
                        onChange={() => handleToggle('admin', 'twoFactorAuth')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="control-card">
                    <div className="control-header">
                      <Lock size={20} />
                      <div className="control-info">
                        <h4>Session Timeout</h4>
                        <p>Auto logout after inactivity</p>
                      </div>
                    </div>
                    <div className="control-input-group">
                      <input 
                        type="number" 
                        value={adminSettings.sessionTimeout}
                        onChange={(e) => handleInputChange('admin', 'sessionTimeout', parseInt(e.target.value))}
                        className="control-input" 
                        min="5"
                        max="120"
                      />
                      <span className="input-suffix">minutes</span>
                    </div>
                  </div>

                  <div className="control-card">
                    <div className="control-header">
                      <Shield size={20} />
                      <div className="control-info">
                        <h4>Max Login Attempts</h4>
                        <p>Account lockout threshold</p>
                      </div>
                    </div>
                    <div className="control-input-group">
                      <input 
                        type="number" 
                        value={adminSettings.maxLoginAttempts}
                        onChange={(e) => handleInputChange('admin', 'maxLoginAttempts', parseInt(e.target.value))}
                        className="control-input" 
                        min="1"
                        max="10"
                      />
                      <span className="input-suffix">attempts</span>
                    </div>
                  </div>

                  <div className="control-card">
                    <div className="control-header">
                      <FileText size={20} />
                      <div className="control-info">
                        <h4>Password Policy</h4>
                        <p>Security requirements</p>
                      </div>
                    </div>
                    <select 
                      value={adminSettings.passwordPolicy}
                      onChange={(e) => handleInputChange('admin', 'passwordPolicy', e.target.value)}
                      className="control-select"
                    >
                      <option value="basic">Basic (6+ chars)</option>
                      <option value="medium">Medium (8+ chars, mixed case)</option>
                      <option value="strong">Strong (8+ chars, mixed case, numbers, symbols)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* System Configuration */}
              <div className="system-section">
                <div className="controls-header">
                  <h3>⚙️ System Configuration</h3>
                  <p>System performance and maintenance</p>
                </div>
                <div className="controls-grid">
                  <div className="control-card">
                    <div className="control-header">
                      <Activity size={20} />
                      <div className="control-info">
                        <h4>Log Level</h4>
                        <p>System logging verbosity</p>
                      </div>
                    </div>
                    <select 
                      value={adminSettings.logLevel}
                      onChange={(e) => handleInputChange('admin', 'logLevel', e.target.value)}
                      className="control-select"
                    >
                      <option value="error">Error Only</option>
                      <option value="warn">Warning & Above</option>
                      <option value="info">Info & Above</option>
                      <option value="debug">Debug & Above</option>
                    </select>
                  </div>

                  <div className="control-card">
                    <div className="control-header">
                      <RefreshCw size={20} />
                      <div className="control-info">
                        <h4>Backup Frequency</h4>
                        <p>Automated backup schedule</p>
                      </div>
                    </div>
                    <select 
                      value={adminSettings.backupFrequency}
                      onChange={(e) => handleInputChange('admin', 'backupFrequency', e.target.value)}
                      className="control-select"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div className="control-card">
                    <div className="control-header">
                      <Trash2 size={20} />
                      <div className="control-info">
                        <h4>Auto Cleanup</h4>
                        <p>Automatic log cleanup</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={adminSettings.autoCleanup}
                        onChange={() => handleToggle('admin', 'autoCleanup')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* API & Performance */}
              <div className="api-section">
                <div className="controls-header">
                  <h3>🌐 API & Performance</h3>
                  <p>API access and system performance</p>
                </div>
                <div className="controls-grid">
                  <div className="control-card">
                    <div className="control-header">
                      <Database size={20} />
                      <div className="control-info">
                        <h4>API Rate Limit</h4>
                        <p>Requests per hour per admin</p>
                      </div>
                    </div>
                    <div className="control-input-group">
                      <input 
                        type="number" 
                        value={adminSettings.apiRateLimit}
                        onChange={(e) => handleInputChange('admin', 'apiRateLimit', parseInt(e.target.value))}
                        className="control-input" 
                        min="100"
                        max="10000"
                      />
                      <span className="input-suffix">req/hour</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <div className="actions-header">
                  <h3>⚡ Quick Actions</h3>
                  <p>Common administrative tasks</p>
                </div>
                <div className="actions-grid">
                  <button className="action-btn primary">
                    <RefreshCw size={16} />
                    Restart System
                  </button>
                  <button className="action-btn secondary">
                    <Download size={16} />
                    Export Logs
                  </button>
                  <button className="action-btn secondary">
                    <Trash2 size={16} />
                    Clear Cache
                  </button>
                  <button className="action-btn secondary">
                    <FileText size={16} />
                    Generate Report
                  </button>
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
                    value={systemConfig.siteName}
                    onChange={(e) => handleInputChange('system', 'siteName', e.target.value)}
                    className="setting-input" 
                  />
                  <small>Display name for the admin panel</small>
                </div>

                <div className="setting-item">
                  <label>Admin Email</label>
                  <input 
                    type="email" 
                    value={systemConfig.adminEmail}
                    onChange={(e) => handleInputChange('system', 'adminEmail', e.target.value)}
                    className="setting-input" 
                  />
                  <small>Primary contact email for system notifications</small>
                </div>

                <div className="setting-item">
                  <label>Timezone</label>
                  <select 
                    value={systemConfig.timezone}
                    onChange={(e) => handleInputChange('system', 'timezone', e.target.value)}
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
                    onChange={(e) => handleInputChange('system', 'dateFormat', e.target.value)}
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
                    onChange={(e) => handleInputChange('system', 'timeFormat', e.target.value)}
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
                    onChange={(e) => handleInputChange('system', 'language', e.target.value)}
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
                    onChange={(e) => handleInputChange('system', 'itemsPerPage', parseInt(e.target.value))}
                    className="setting-input" 
                    min="10"
                    max="100"
                  />
                  <small>Default number of items in data tables</small>
                </div>

                <div className="setting-item">
                  <label>Export Format</label>
                  <select 
                    value={systemConfig.exportFormat}
                    onChange={(e) => handleInputChange('system', 'exportFormat', e.target.value)}
                    className="setting-input"
                  >
                    <option value="csv">CSV</option>
                    <option value="xlsx">Excel (XLSX)</option>
                    <option value="json">JSON</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-header">
                      <Save size={18} />
                      <span>Auto Save</span>
                    </div>
                    <p>Automatically save form inputs and drafts</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={systemConfig.autoSave}
                      onChange={() => handleToggle('system', 'autoSave')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <label>Theme</label>
                  <select 
                    value={systemConfig.theme}
                    onChange={(e) => handleInputChange('system', 'theme', e.target.value)}
                    className="setting-input"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
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
                <p>Configure system alerts and administrative notifications</p>
              </div>

              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-header">
                      <Mail size={18} />
                      <span>Email Notifications</span>
                    </div>
                    <p>Receive admin alerts and system updates via email</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.email}
                      onChange={() => handleToggle('notifications', 'email')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-header">
                      <Bell size={18} />
                      <span>Push Notifications</span>
                    </div>
                    <p>Get instant push notifications on mobile devices</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.push}
                      onChange={() => handleToggle('notifications', 'push')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-header">
                      <AlertTriangle size={18} />
                      <span>System Alerts</span>
                    </div>
                    <p>Get notified about critical system issues and errors</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.systemAlerts}
                      onChange={() => handleToggle('notifications', 'systemAlerts')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-header">
                      <Users size={18} />
                      <span>User Activity</span>
                    </div>
                    <p>Monitor user registrations and profile changes</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.userActivity}
                      onChange={() => handleToggle('notifications', 'userActivity')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-header">
                      <Lock size={18} />
                      <span>Security Events</span>
                    </div>
                    <p>Alert on security breaches and suspicious activities</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.securityEvents}
                      onChange={() => handleToggle('notifications', 'securityEvents')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-header">
                      <RefreshCw size={18} />
                      <span>Backup Reminders</span>
                    </div>
                    <p>Get notified about backup status and failures</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.backupReminders}
                      onChange={() => handleToggle('notifications', 'backupReminders')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-header">
                      <TrendingUp size={18} />
                      <span>Performance Alerts</span>
                    </div>
                    <p>Alert when system performance exceeds thresholds</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.performanceAlerts}
                      onChange={() => handleToggle('notifications', 'performanceAlerts')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Advanced Settings</h2>
                <p>Configure advanced system options and performance settings</p>
              </div>

              <div className="settings-list">
                <div className="setting-item">
                  <label>Cache Duration (seconds)</label>
                  <input 
                    type="number" 
                    value={advancedSettings.cacheDuration}
                    onChange={(e) => handleInputChange('advanced', 'cacheDuration', parseInt(e.target.value))}
                    className="setting-input" 
                    min="60"
                    max="86400"
                  />
                  <small>How long to cache data in memory</small>
                </div>

                <div className="setting-item">
                  <label>Max File Size (MB)</label>
                  <input 
                    type="number" 
                    value={advancedSettings.maxFileSize}
                    onChange={(e) => handleInputChange('advanced', 'maxFileSize', parseInt(e.target.value))}
                    className="setting-input" 
                    min="1"
                    max="100"
                  />
                  <small>Maximum file upload size</small>
                </div>

                <div className="setting-item">
                  <label>Rate Limit (requests/minute)</label>
                  <input 
                    type="number" 
                    value={advancedSettings.rateLimitPerMinute}
                    onChange={(e) => handleInputChange('advanced', 'rateLimitPerMinute', parseInt(e.target.value))}
                    className="setting-input" 
                    min="10"
                    max="1000"
                  />
                  <small>API rate limit per user</small>
                </div>

                <div className="setting-item">
                  <label>Log Retention (days)</label>
                  <input 
                    type="number" 
                    value={advancedSettings.logRetention}
                    onChange={(e) => handleInputChange('advanced', 'logRetention', parseInt(e.target.value))}
                    className="setting-input" 
                    min="1"
                    max="365"
                  />
                  <small>How long to keep system logs</small>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-header">
                      <Database size={18} />
                      <span>Database Backup</span>
                    </div>
                    <p>Automatically backup database daily</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={advancedSettings.databaseBackup}
                      onChange={() => handleToggle('advanced', 'databaseBackup')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-header">
                      <AlertTriangle size={18} />
                      <span>Error Reporting</span>
                    </div>
                    <p>Send error reports to development team</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={advancedSettings.errorReporting}
                      onChange={() => handleToggle('advanced', 'errorReporting')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-header">
                      <BarChart3 size={18} />
                      <span>Analytics Enabled</span>
                    </div>
                    <p>Collect usage analytics for improvement</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={advancedSettings.analyticsEnabled}
                      onChange={() => handleToggle('advanced', 'analyticsEnabled')}
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
