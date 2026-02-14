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

  const [privacySettings, setPrivacySettings] = useState({
    analyticsData: false,
    userBehaviorTracking: false,
    performanceMetrics: true,
    errorLogs: true,
    userDataRetention: 365,
    activityLogRetention: 90,
    analyticsDataRetention: 180,
    autoDataCleanup: true,
    profileVisibility: true,
    privateProfiles: true,
    dataExport: true,
    accountDeletion: true,
    searchIndexing: false,
    defaultPrivacyLevel: 'public',
    publicAnalytics: false,
    researchData: false,
    marketingCommunications: false,
    cookiesTracking: true,
    gdprCompliance: true,
    privacyPolicy: true,
    consentManagement: true,
    dataEncryption: true,
    privacyPolicyUrl: '/privacy',
    termsOfServiceUrl: '/terms'
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
    
    setPrivacySettings({
      analyticsData: false,
      userBehaviorTracking: false,
      performanceMetrics: true,
      errorLogs: true,
      userDataRetention: 365,
      activityLogRetention: 90,
      analyticsDataRetention: 180,
      autoDataCleanup: true,
      profileVisibility: true,
      privateProfiles: true,
      dataExport: true,
      accountDeletion: true,
      searchIndexing: false,
      defaultPrivacyLevel: 'public',
      publicAnalytics: false,
      researchData: false,
      marketingCommunications: false,
      cookiesTracking: true,
      gdprCompliance: true,
      privacyPolicy: true,
      consentManagement: true,
      dataEncryption: true,
      privacyPolicyUrl: '/privacy',
      termsOfServiceUrl: '/terms'
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
      case 'privacy':
        setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }));
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
      case 'privacy':
        setPrivacySettings(prev => ({ ...prev, [field]: value }));
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
    { id: 'privacy', label: 'Privacy', icon: Eye },
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

              {/* System Operations */}
              <div className="settings-subsection">
                <div className="subsection-header">
                  <h3>System Operations</h3>
                  <p>Control system availability and maintenance operations</p>
                </div>
                <div className="settings-grid">
                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <AlertTriangle size={18} />
                        <span>Maintenance Mode</span>
                      </div>
                      <p>Put system in maintenance mode for updates</p>
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

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Activity size={18} />
                        <span>Debug Mode</span>
                      </div>
                      <p>Enable detailed logging and debug information</p>
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

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <BarChart3 size={18} />
                        <span>System Monitoring</span>
                      </div>
                      <p>Monitor system performance and health metrics</p>
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

                  <div className="setting-item">
                    <label>System Status</label>
                    <select 
                      value={adminSettings.systemStatus || 'operational'}
                      onChange={(e) => handleInputChange('admin', 'systemStatus', e.target.value)}
                      className="setting-input"
                    >
                      <option value="operational">Operational</option>
                      <option value="degraded">Degraded Performance</option>
                      <option value="maintenance">Under Maintenance</option>
                      <option value="critical">Critical Issues</option>
                    </select>
                    <small>Current system operational status</small>
                  </div>

                  <div className="setting-item">
                    <label>Emergency Contact</label>
                    <input 
                      type="email" 
                      value={adminSettings.emergencyContact || ''}
                      onChange={(e) => handleInputChange('admin', 'emergencyContact', e.target.value)}
                      className="setting-input" 
                      placeholder="admin@company.com"
                    />
                    <small>Contact for system emergencies</small>
                  </div>
                </div>
              </div>

              {/* Logging & Monitoring */}
              <div className="settings-subsection">
                <div className="subsection-header">
                  <h3>Logging & Monitoring</h3>
                  <p>Configure system logging, monitoring and backup strategies</p>
                </div>
                <div className="settings-grid">
                  <div className="setting-item">
                    <label>Log Level</label>
                    <select 
                      value={adminSettings.logLevel}
                      onChange={(e) => handleInputChange('admin', 'logLevel', e.target.value)}
                      className="setting-input"
                    >
                      <option value="error">Error Only</option>
                      <option value="warn">Warning & Above</option>
                      <option value="info">Info & Above</option>
                      <option value="debug">Debug & Above</option>
                    </select>
                    <small>Set minimum level of logs to record</small>
                  </div>

                  <div className="setting-item">
                    <label>Log Retention (days)</label>
                    <input 
                      type="number" 
                      value={adminSettings.logRetention || 30}
                      onChange={(e) => handleInputChange('admin', 'logRetention', parseInt(e.target.value))}
                      className="setting-input" 
                      min="1"
                      max="365"
                    />
                    <small>How long to keep system logs</small>
                  </div>

                  <div className="setting-item">
                    <label>Backup Frequency</label>
                    <select 
                      value={adminSettings.backupFrequency}
                      onChange={(e) => handleInputChange('admin', 'backupFrequency', e.target.value)}
                      className="setting-input"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                    <small>How often to create system backups</small>
                  </div>

                  <div className="setting-item">
                    <label>Backup Location</label>
                    <input 
                      type="text" 
                      value={adminSettings.backupLocation || '/backups'}
                      onChange={(e) => handleInputChange('admin', 'backupLocation', e.target.value)}
                      className="setting-input" 
                      placeholder="/var/backups"
                    />
                    <small>Directory for system backups</small>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Trash2 size={18} />
                        <span>Auto Cleanup</span>
                      </div>
                      <p>Automatically clean up old logs and temporary files</p>
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

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Database size={18} />
                        <span>Database Optimization</span>
                      </div>
                      <p>Automatically optimize database performance</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={adminSettings.dbOptimization}
                        onChange={() => handleToggle('admin', 'dbOptimization')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Security & Authentication */}
              <div className="settings-subsection">
                <div className="subsection-header">
                  <h3>Security & Authentication</h3>
                  <p>Configure authentication, access control and security policies</p>
                </div>
                <div className="settings-grid">
                  <div className="setting-item">
                    <label>Session Timeout (minutes)</label>
                    <input 
                      type="number" 
                      value={adminSettings.sessionTimeout}
                      onChange={(e) => handleInputChange('admin', 'sessionTimeout', parseInt(e.target.value))}
                      className="setting-input" 
                      min="5"
                      max="120"
                    />
                    <small>Automatically log out inactive admins</small>
                  </div>

                  <div className="setting-item">
                    <label>Max Login Attempts</label>
                    <input 
                      type="number" 
                      value={adminSettings.maxLoginAttempts}
                      onChange={(e) => handleInputChange('admin', 'maxLoginAttempts', parseInt(e.target.value))}
                      className="setting-input" 
                      min="1"
                      max="10"
                    />
                    <small>Lock account after failed attempts</small>
                  </div>

                  <div className="setting-item">
                    <label>Account Lockout Duration (minutes)</label>
                    <input 
                      type="number" 
                      value={adminSettings.lockoutDuration || 15}
                      onChange={(e) => handleInputChange('admin', 'lockoutDuration', parseInt(e.target.value))}
                      className="setting-input" 
                      min="5"
                      max="60"
                    />
                    <small>Duration of account lockout</small>
                  </div>

                  <div className="setting-item">
                    <label>Password Policy</label>
                    <select 
                      value={adminSettings.passwordPolicy}
                      onChange={(e) => handleInputChange('admin', 'passwordPolicy', e.target.value)}
                      className="setting-input"
                    >
                      <option value="basic">Basic (6+ chars)</option>
                      <option value="medium">Medium (8+ chars, mixed case)</option>
                      <option value="strong">Strong (8+ chars, mixed case, numbers, symbols)</option>
                      <option value="enterprise">Enterprise (12+ chars, all requirements)</option>
                    </select>
                    <small>Set minimum password requirements</small>
                  </div>

                  <div className="setting-item">
                    <label>Password Expiry (days)</label>
                    <input 
                      type="number" 
                      value={adminSettings.passwordExpiry || 90}
                      onChange={(e) => handleInputChange('admin', 'passwordExpiry', parseInt(e.target.value))}
                      className="setting-input" 
                      min="30"
                      max="365"
                    />
                    <small>Force password change after this period</small>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Key size={18} />
                        <span>Two-Factor Authentication</span>
                      </div>
                      <p>Require 2FA for all admin accounts</p>
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

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Shield size={18} />
                        <span>IP Whitelist</span>
                      </div>
                      <p>Restrict access to specific IP addresses</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={adminSettings.ipWhitelist}
                        onChange={() => handleToggle('admin', 'ipWhitelist')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <label>Allowed IP Addresses</label>
                    <textarea 
                      value={adminSettings.allowedIPs || ''}
                      onChange={(e) => handleInputChange('admin', 'allowedIPs', e.target.value)}
                      className="setting-input" 
                      rows={3}
                      placeholder="192.168.1.1, 10.0.0.1"
                    />
                    <small>Comma-separated IP addresses</small>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Activity size={18} />
                        <span>Failed Login Alerts</span>
                      </div>
                      <p>Send alerts for failed login attempts</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={adminSettings.failedLoginAlerts}
                        onChange={() => handleToggle('admin', 'failedLoginAlerts')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* API & Integration */}
              <div className="settings-subsection">
                <div className="subsection-header">
                  <h3>API & Integration</h3>
                  <p>Configure API access, rate limiting and third-party integrations</p>
                </div>
                <div className="settings-grid">
                  <div className="setting-item">
                    <label>API Rate Limit (requests/hour)</label>
                    <input 
                      type="number" 
                      value={adminSettings.apiRateLimit}
                      onChange={(e) => handleInputChange('admin', 'apiRateLimit', parseInt(e.target.value))}
                      className="setting-input" 
                      min="100"
                      max="10000"
                    />
                    <small>Limit API requests per admin per hour</small>
                  </div>

                  <div className="setting-item">
                    <label>API Key Expiry (days)</label>
                    <input 
                      type="number" 
                      value={adminSettings.apiKeyExpiry || 365}
                      onChange={(e) => handleInputChange('admin', 'apiKeyExpiry', parseInt(e.target.value))}
                      className="setting-input" 
                      min="30"
                      max="730"
                    />
                    <small>API key expiration period</small>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Globe size={18} />
                        <span>CORS Enabled</span>
                      </div>
                      <p>Allow cross-origin requests</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={adminSettings.corsEnabled}
                        onChange={() => handleToggle('admin', 'corsEnabled')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <label>Allowed Origins</label>
                    <textarea 
                      value={adminSettings.allowedOrigins || ''}
                      onChange={(e) => handleInputChange('admin', 'allowedOrigins', e.target.value)}
                      className="setting-input" 
                      rows={3}
                      placeholder="https://example.com, https://app.example.com"
                    />
                    <small>Comma-separated allowed origins</small>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Download size={18} />
                        <span>Webhook Support</span>
                      </div>
                      <p>Enable webhook notifications</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={adminSettings.webhookSupport}
                        onChange={() => handleToggle('admin', 'webhookSupport')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <label>Webhook URL</label>
                    <input 
                      type="url" 
                      value={adminSettings.webhookUrl || ''}
                      onChange={(e) => handleInputChange('admin', 'webhookUrl', e.target.value)}
                      className="setting-input" 
                      placeholder="https://api.example.com/webhook"
                    />
                    <small>Endpoint for webhook notifications</small>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <RefreshCw size={18} />
                        <span>API Version</span>
                      </div>
                      <p>Current API version</p>
                    </div>
                    <select 
                      value={adminSettings.apiVersion || 'v1'}
                      onChange={(e) => handleInputChange('admin', 'apiVersion', e.target.value)}
                      className="setting-input"
                    >
                      <option value="v1">Version 1.0</option>
                      <option value="v2">Version 2.0</option>
                      <option value="beta">Beta Version</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Performance & Optimization */}
              <div className="settings-subsection">
                <div className="subsection-header">
                  <h3>Performance & Optimization</h3>
                  <p>Configure system performance settings and optimization</p>
                </div>
                <div className="settings-grid">
                  <div className="setting-item">
                    <label>Cache Duration (seconds)</label>
                    <input 
                      type="number" 
                      value={adminSettings.cacheDuration || 3600}
                      onChange={(e) => handleInputChange('admin', 'cacheDuration', parseInt(e.target.value))}
                      className="setting-input" 
                      min="60"
                      max="86400"
                    />
                    <small>How long to cache data in memory</small>
                  </div>

                  <div className="setting-item">
                    <label>Cache Size (MB)</label>
                    <input 
                      type="number" 
                      value={adminSettings.cacheSize || 512}
                      onChange={(e) => handleInputChange('admin', 'cacheSize', parseInt(e.target.value))}
                      className="setting-input" 
                      min="64"
                      max="4096"
                    />
                    <small>Maximum cache memory allocation</small>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <TrendingUp size={18} />
                        <span>Performance Monitoring</span>
                      </div>
                      <p>Track system performance metrics</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={adminSettings.performanceMonitoring}
                        onChange={() => handleToggle('admin', 'performanceMonitoring')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <label>Performance Threshold (%)</label>
                    <input 
                      type="number" 
                      value={adminSettings.performanceThreshold || 80}
                      onChange={(e) => handleInputChange('admin', 'performanceThreshold', parseInt(e.target.value))}
                      className="setting-input" 
                      min="50"
                      max="95"
                    />
                    <small>Alert when CPU usage exceeds this percentage</small>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Database size={18} />
                        <span>Database Pool Size</span>
                      </div>
                      <p>Database connection pool size</p>
                    </div>
                    <input 
                      type="number" 
                      value={adminSettings.dbPoolSize || 10}
                      onChange={(e) => handleInputChange('admin', 'dbPoolSize', parseInt(e.target.value))}
                      className="setting-input" 
                      min="1"
                      max="50"
                    />
                    <small>Number of database connections</small>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Clock size={18} />
                        <span>Scheduled Tasks</span>
                      </div>
                      <p>Enable scheduled system tasks</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={adminSettings.scheduledTasks}
                        onChange={() => handleToggle('admin', 'scheduledTasks')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Email & Notifications */}
              <div className="settings-subsection">
                <div className="subsection-header">
                  <h3>Email & Notifications</h3>
                  <p>Configure email settings and notification preferences</p>
                </div>
                <div className="settings-grid">
                  <div className="setting-item">
                    <label>SMTP Server</label>
                    <input 
                      type="text" 
                      value={adminSettings.smtpServer || ''}
                      onChange={(e) => handleInputChange('admin', 'smtpServer', e.target.value)}
                      className="setting-input" 
                      placeholder="smtp.example.com"
                    />
                    <small>SMTP server for email notifications</small>
                  </div>

                  <div className="setting-item">
                    <label>SMTP Port</label>
                    <input 
                      type="number" 
                      value={adminSettings.smtpPort || 587}
                      onChange={(e) => handleInputChange('admin', 'smtpPort', parseInt(e.target.value))}
                      className="setting-input" 
                      min="25"
                      max="65535"
                    />
                    <small>SMTP server port</small>
                  </div>

                  <div className="setting-item">
                    <label>From Email</label>
                    <input 
                      type="email" 
                      value={adminSettings.fromEmail || ''}
                      onChange={(e) => handleInputChange('admin', 'fromEmail', e.target.value)}
                      className="setting-input" 
                      placeholder="noreply@example.com"
                    />
                    <small>Default sender email address</small>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Mail size={18} />
                        <span>Admin Notifications</span>
                      </div>
                      <p>Receive admin alerts via email</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={adminSettings.adminNotifications}
                        onChange={() => handleToggle('admin', 'adminNotifications')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <AlertTriangle size={18} />
                        <span>Critical Alerts</span>
                      </div>
                      <p>Send critical system alerts immediately</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={adminSettings.criticalAlerts}
                        onChange={() => handleToggle('admin', 'criticalAlerts')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <label>Email Template</label>
                    <select 
                      value={adminSettings.emailTemplate || 'default'}
                      onChange={(e) => handleInputChange('admin', 'emailTemplate', e.target.value)}
                      className="setting-input"
                    >
                      <option value="default">Default Template</option>
                      <option value="professional">Professional</option>
                      <option value="minimal">Minimal</option>
                    </select>
                    <small>Email template for notifications</small>
                  </div>
                </div>
              </div>

              {/* Compliance & Audit */}
              <div className="settings-subsection">
                <div className="subsection-header">
                  <h3>Compliance & Audit</h3>
                  <p>Configure compliance settings and audit trails</p>
                </div>
                <div className="settings-grid">
                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <FileText size={18} />
                        <span>Audit Logging</span>
                      </div>
                      <p>Log all admin actions for compliance</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={adminSettings.auditLogging}
                        onChange={() => handleToggle('admin', 'auditLogging')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting">
                    <label>Audit Retention (days)</label>
                    <input 
                      type="number" 
                      value={adminSettings.auditRetention || 90}
                      onChange={(e) => handleInputChange('admin', 'auditRetention', parseInt(e.target.value))}
                      className="setting-input" 
                      min="30"
                      max="2555"
                    />
                    <small>How long to keep audit logs</small>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Shield size={18} />
                        <span>GDPR Compliance</span>
                      </div>
                      <p>Enable GDPR compliance features</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={adminSettings.gdprCompliance}
                        onChange={() => handleToggle('admin', 'gdprCompliance')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Lock size={18} />
                        <span>Data Encryption</span>
                      </div>
                      <p>Encrypt sensitive data at rest</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={adminSettings.dataEncryption}
                        onChange={() => handleToggle('admin', 'dataEncryption')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Users size={18} />
                        <span>User Consent Required</span>
                      </div>
                      <p>Require user consent for data processing</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={adminSettings.userConsent}
                        onChange={() => handleToggle('admin', 'userConsent')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <label>Compliance Reports</label>
                    <select 
                      value={adminSettings.complianceReports || 'monthly'}
                      onChange={(e) => handleInputChange('admin', 'complianceReports', e.target.value)}
                      className="setting-input"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                    </select>
                    <small>Frequency of compliance reports</small>
                  </div>
                </div>
              </div>

              {/* Advanced Features */}
              <div className="settings-subsection">
                <div className="subsection-header">
                  <h3>Advanced Features</h3>
                  <p>Configure advanced system features and experimental options</p>
                </div>
                <div className="settings-grid">
                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Database size={18} />
                        <span>Database Migration</span>
                      </div>
                      <p>Enable database migration tools</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={adminSettings.dbMigration}
                        onChange={() => handleToggle('admin', 'dbMigration')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <RefreshCw size={18} />
                        <span>Auto Updates</span>
                      </div>
                      <p>Automatically update system components</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={adminSettings.autoUpdates}
                        onChange={() => handleToggle('admin', 'autoUpdates')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Activity size={18} />
                        <span>Beta Features</span>
                      </div>
                      <p>Enable experimental beta features</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={adminSettings.betaFeatures}
                        onChange={() => handleToggle('admin', 'betaFeatures')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <AlertTriangle size={18} />
                        <span>Safe Mode</span>
                      </div>
                      <p>Run system in safe mode for testing</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={adminSettings.safeMode}
                        onChange={() => handleToggle('admin', 'safeMode')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <label>Environment</label>
                    <select 
                      value={adminSettings.environment || 'production'}
                      onChange={(e) => handleInputChange('admin', 'environment', e.target.value)}
                      className="setting-input"
                    >
                      <option value="development">Development</option>
                      <option value="staging">Staging</option>
                      <option value="production">Production</option>
                    </select>
                    <small>Current deployment environment</small>
                  </div>

                  <div className="setting-item">
                    <label>Feature Flags</label>
                    <textarea 
                      value={adminSettings.featureFlags || ''}
                      onChange={(e) => handleInputChange('admin', 'featureFlags', e.target.value)}
                      className="setting-input" 
                      rows={3}
                      placeholder="new_dashboard, advanced_search"
                    />
                    <small>Comma-separated feature flags</small>
                  </div>
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

          {activeTab === 'privacy' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Privacy Settings</h2>
                <p>Configure privacy controls and data protection settings</p>
              </div>

              {/* Data Collection */}
              <div className="settings-subsection">
                <div className="subsection-header">
                  <h3>Data Collection</h3>
                  <p>Control what data is collected and stored</p>
                </div>
                <div className="settings-grid">
                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Database size={18} />
                        <span>Analytics Data</span>
                      </div>
                      <p>Collect usage analytics for improvement</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={privacySettings?.analyticsData || false}
                        onChange={() => handleToggle('privacy', 'analyticsData')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Users size={18} />
                        <span>User Behavior Tracking</span>
                      </div>
                      <p>Track user interactions and behavior patterns</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={privacySettings?.userBehaviorTracking || false}
                        onChange={() => handleToggle('privacy', 'userBehaviorTracking')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <BarChart3 size={18} />
                        <span>Performance Metrics</span>
                      </div>
                      <p>Collect system performance data</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={privacySettings?.performanceMetrics || true}
                        onChange={() => handleToggle('privacy', 'performanceMetrics')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <FileText size={18} />
                        <span>Error Logs</span>
                      </div>
                      <p>Collect error logs for debugging</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={privacySettings?.errorLogs || true}
                        onChange={() => handleToggle('privacy', 'errorLogs')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Data Retention */}
              <div className="settings-subsection">
                <div className="subsection-header">
                  <h3>Data Retention</h3>
                  <p>Configure how long data is retained</p>
                </div>
                <div className="settings-grid">
                  <div className="setting-item">
                    <label>User Data Retention (days)</label>
                    <input 
                      type="number" 
                      value={privacySettings?.userDataRetention || 365}
                      onChange={(e) => handleInputChange('privacy', 'userDataRetention', parseInt(e.target.value))}
                      className="setting-input" 
                      min="30"
                      max="2555"
                    />
                    <small>How long to keep user data</small>
                  </div>

                  <div className="setting-item">
                    <label>Activity Log Retention (days)</label>
                    <input 
                      type="number" 
                      value={privacySettings?.activityLogRetention || 90}
                      onChange={(e) => handleInputChange('privacy', 'activityLogRetention', parseInt(e.target.value))}
                      className="setting-input" 
                      min="7"
                      max="365"
                    />
                    <small>How long to keep activity logs</small>
                  </div>

                  <div className="setting-item">
                    <label>Analytics Data Retention (days)</label>
                    <input 
                      type="number" 
                      value={privacySettings?.analyticsDataRetention || 180}
                      onChange={(e) => handleInputChange('privacy', 'analyticsDataRetention', parseInt(e.target.value))}
                      className="setting-input" 
                      min="30"
                      max="730"
                    />
                    <small>How long to keep analytics data</small>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Trash2 size={18} />
                        <span>Auto Data Cleanup</span>
                      </div>
                      <p>Automatically delete expired data</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={privacySettings?.autoDataCleanup || true}
                        onChange={() => handleToggle('privacy', 'autoDataCleanup')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* User Privacy */}
              <div className="settings-subsection">
                <div className="subsection-header">
                  <h3>User Privacy</h3>
                  <p>Configure user privacy controls and permissions</p>
                </div>
                <div className="settings-grid">
                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Eye size={18} />
                        <span>Profile Visibility</span>
                      </div>
                      <p>Allow users to control profile visibility</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={privacySettings?.profileVisibility || true}
                        onChange={() => handleToggle('privacy', 'profileVisibility')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <EyeOff size={18} />
                        <span>Private Profiles</span>
                      </div>
                      <p>Allow users to make profiles private</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={privacySettings?.privateProfiles || true}
                        onChange={() => handleToggle('privacy', 'privateProfiles')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Users size={18} />
                        <span>Data Export</span>
                      </div>
                      <p>Allow users to export their data</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={privacySettings?.dataExport || true}
                        onChange={() => handleToggle('privacy', 'dataExport')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Trash2 size={18} />
                        <span>Account Deletion</span>
                      </div>
                      <p>Allow users to delete their accounts</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={privacySettings?.accountDeletion || true}
                        onChange={() => handleToggle('privacy', 'accountDeletion')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Search size={18} />
                        <span>Search Indexing</span>
                      </div>
                      <p>Include user content in search results</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={privacySettings?.searchIndexing || false}
                        onChange={() => handleToggle('privacy', 'searchIndexing')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <label>Default Privacy Level</label>
                    <select 
                      value={privacySettings?.defaultPrivacyLevel || 'public'}
                      onChange={(e) => handleInputChange('privacy', 'defaultPrivacyLevel', e.target.value)}
                      className="setting-input"
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                    <small>Default privacy setting for new users</small>
                  </div>
                </div>
              </div>

              {/* Third-Party Sharing */}
              <div className="settings-subsection">
                <div className="subsection-header">
                  <h3>Third-Party Sharing</h3>
                  <p>Configure data sharing with third-party services</p>
                </div>
                <div className="settings-grid">
                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Globe size={18} />
                        <span>Public Analytics</span>
                      </div>
                      <p>Share anonymized usage data publicly</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={privacySettings?.publicAnalytics || false}
                        onChange={() => handleToggle('privacy', 'publicAnalytics')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Database size={18} />
                        <span>Research Data</span>
                      </div>
                      <p>Share anonymized data for research</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={privacySettings?.researchData || false}
                        onChange={() => handleToggle('privacy', 'researchData')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Mail size={18} />
                        <span>Marketing Communications</span>
                      </div>
                      <p>Share data with marketing partners</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={privacySettings?.marketingCommunications || false}
                        onChange={() => handleToggle('privacy', 'marketingCommunications')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <AlertTriangle size={18} />
                        <span>Cookies and Tracking</span>
                      </div>
                      <p>Use cookies and tracking technologies</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={privacySettings?.cookiesTracking || true}
                        onChange={() => handleToggle('privacy', 'cookiesTracking')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Compliance */}
              <div className="settings-subsection">
                <div className="subsection-header">
                  <h3>Compliance</h3>
                  <p>Legal compliance and regulatory requirements</p>
                </div>
                <div className="settings-grid">
                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Shield size={18} />
                        <span>GDPR Compliance</span>
                      </div>
                      <p>Enable GDPR compliance features</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={privacySettings?.gdprCompliance || true}
                        onChange={() => handleToggle('privacy', 'gdprCompliance')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <FileText size={18} />
                        <span>Privacy Policy</span>
                      </div>
                      <p>Display privacy policy to users</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={privacySettings?.privacyPolicy || true}
                        onChange={() => handleToggle('privacy', 'privacyPolicy')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Users size={18} />
                        <span>Consent Management</span>
                      </div>
                      <p>Require explicit user consent</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={privacySettings?.consentManagement || true}
                        onChange={() => handleToggle('privacy', 'consentManagement')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-header">
                        <Lock size={18} />
                        <span>Data Encryption</span>
                      </div>
                      <p>Encrypt sensitive user data</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={privacySettings?.dataEncryption || true}
                        onChange={() => handleToggle('privacy', 'dataEncryption')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <label>Privacy Policy URL</label>
                    <input 
                      type="url" 
                      value={privacySettings?.privacyPolicyUrl || '/privacy'}
                      onChange={(e) => handleInputChange('privacy', 'privacyPolicyUrl', e.target.value)}
                      className="setting-input" 
                      placeholder="/privacy"
                    />
                    <small>URL for privacy policy page</small>
                  </div>

                  <div className="setting-item">
                    <label>Terms of Service URL</label>
                    <input 
                      type="url" 
                      value={privacySettings?.termsOfServiceUrl || '/terms'}
                      onChange={(e) => handleInputChange('privacy', 'termsOfServiceUrl', e.target.value)}
                      className="setting-input" 
                      placeholder="/terms"
                    />
                    <small>URL for terms of service page</small>
                  </div>
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
