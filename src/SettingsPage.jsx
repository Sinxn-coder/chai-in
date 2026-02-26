import React, { useState } from 'react';
import { User, Shield, Database, Crown, Lock, Building, Mail, MapPin, Phone, Key, Server, Users, Settings, Check, X, CreditCard, FileText, Award, Save, Eye, Clock } from 'lucide-react';
import './SettingsPage.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System', icon: Database }
  ];

  return (
    <div className="settings-page">
      <div className="settings-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
      
      <div className="tab-content">
        {activeTab === 'profile' && (
          <div className="content-section">
            <div className="profile-header">
              <div className="profile-avatar-section">
                <div className="avatar-large">
                  <div className="avatar-icon">👨‍💼</div>
                  <div className="avatar-overlay">
                    <button className="camera-btn">📷</button>
                  </div>
                </div>
                <div className="profile-status">
                  <h3>Super Administrator</h3>
                  <div className="status-badge online">Online</div>
                </div>
              </div>
              
              <div className="profile-summary">
                <div className="admin-id-card">
                  <div className="id-header">
                    <Shield size={20} />
                    <span>Administrator ID</span>
                  </div>
                  <div className="id-value">ADM-001</div>
                  <div className="id-status">System Generated</div>
                </div>
                
                <div className="quick-stats">
                  <div className="stat-item">
                    <div className="stat-value">Full</div>
                    <div className="stat-label">Access Level</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">5</div>
                    <div className="stat-label">Years Active</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">98%</div>
                    <div className="stat-label">Security Score</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-content">
              <div className="content-grid">
                <div className="form-section">
                  <div className="section-header">
                    <User size={18} />
                    <h4>Personal Information</h4>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label>First Name</label>
                      <input type="text" className="form-input modern" placeholder="John" />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input type="text" className="form-input modern" placeholder="Doe" />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Admin Email</label>
                    <div className="input-with-icon">
                      <Mail size={16} />
                      <input type="email" className="form-input modern" placeholder="admin@company.com" />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Username</label>
                    <div className="input-with-icon">
                      <User size={16} />
                      <input type="text" className="form-input modern" placeholder="admin_user" />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="section-header">
                    <Building size={18} />
                    <h4>Professional Details</h4>
                  </div>
                  
                  <div className="form-group">
                    <label>Department</label>
                    <div className="department-display">
                      <Building size={16} />
                      <span>System Administration</span>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Admin Role</label>
                    <div className="role-display">
                      <Crown size={16} />
                      <span>Super Administrator</span>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Office Location</label>
                    <div className="input-with-icon">
                      <MapPin size={16} />
                      <input type="text" className="form-input modern" placeholder="Building A, Floor 3" />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <div className="input-with-icon">
                      <Phone size={16} />
                      <input type="tel" className="form-input modern" placeholder="+1 234 567 8900" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="permissions-section">
                <div className="section-header">
                  <Key size={18} />
                  <h4>System Access Permissions</h4>
                </div>
                
                <div className="permissions-grid">
                  <div className="permission-card granted">
                    <div className="permission-icon">
                      <Server size={20} />
                    </div>
                    <div className="permission-details">
                      <h5>Server Management</h5>
                      <p>Full server access and control</p>
                    </div>
                    <div className="permission-status">
                      <Check size={16} />
                    </div>
                  </div>
                  
                  <div className="permission-card granted">
                    <div className="permission-icon">
                      <Users size={20} />
                    </div>
                    <div className="permission-details">
                      <h5>User Administration</h5>
                      <p>Manage all user accounts</p>
                    </div>
                    <div className="permission-status">
                      <Check size={16} />
                    </div>
                  </div>
                  
                  <div className="permission-card granted">
                    <div className="permission-icon">
                      <Settings size={20} />
                    </div>
                    <div className="permission-details">
                      <h5>System Configuration</h5>
                      <p>Modify system settings</p>
                    </div>
                    <div className="permission-status">
                      <Check size={16} />
                    </div>
                  </div>
                  
                  <div className="permission-card granted">
                    <div className="permission-icon">
                      <Shield size={20} />
                    </div>
                    <div className="permission-details">
                      <h5>Security Settings</h5>
                      <p>Access to security controls</p>
                    </div>
                    <div className="permission-status">
                      <Check size={16} />
                    </div>
                  </div>
                  
                  <div className="permission-card granted">
                    <div className="permission-icon">
                      <Database size={20} />
                    </div>
                    <div className="permission-details">
                      <h5>Database Access</h5>
                      <p>Full database administration</p>
                    </div>
                    <div className="permission-status">
                      <Check size={16} />
                    </div>
                  </div>
                  
                  <div className="permission-card granted">
                    <div className="permission-icon">
                      <CreditCard size={20} />
                    </div>
                    <div className="permission-details">
                      <h5>Billing & Payments</h5>
                      <p>Financial system access</p>
                    </div>
                    <div className="permission-status">
                      <Check size={16} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button className="save-btn modern">
                  <Save size={16} />
                  Save Admin Profile
                </button>
                <button className="cancel-btn modern">
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'security' && (
          <div className="content-section">
            <div className="security-grid">
              <div className="security-section">
                <div className="section-header">
                  <Lock size={18} />
                  <h4>Password Security</h4>
                </div>
                
                <div className="form-group">
                  <label>Current Password</label>
                  <div className="input-with-icon">
                    <Lock size={16} />
                    <input type="password" className="form-input modern" placeholder="Enter current password" />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>New Password</label>
                  <div className="input-with-icon">
                    <Key size={16} />
                    <input type="password" className="form-input modern" placeholder="Enter new password" />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <div className="input-with-icon">
                    <Lock size={16} />
                    <input type="password" className="form-input modern" placeholder="Confirm new password" />
                  </div>
                </div>
                
                <div className="password-strength">
                  <div className="strength-label">Password Strength:</div>
                  <div className="strength-bar">
                    <div className="strength-fill strong"></div>
                  </div>
                  <span className="strength-text">Strong</span>
                </div>
              </div>

              <div className="security-section">
                <div className="section-header">
                  <Shield size={18} />
                  <h4>Two-Factor Authentication</h4>
                </div>
                
                <div className="two-factor-status">
                  <div className="status-card enabled">
                    <div className="status-icon">
                      <Check size={20} />
                    </div>
                    <div className="status-details">
                      <h5>2FA Enabled</h5>
                      <p>Authenticator app configured</p>
                    </div>
                    <div className="status-toggle">
                      <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="security-grid">
              <div className="security-section">
                <div className="section-header">
                  <Eye size={18} />
                  <h4>Privacy Settings</h4>
                </div>
                
                <div className="privacy-options">
                  <div className="privacy-item">
                    <div className="privacy-info">
                      <h5>Profile Visibility</h5>
                      <p>Control who can see your profile</p>
                    </div>
                    <div className="privacy-control">
                      <select className="form-input modern">
                        <option>Admin Only</option>
                        <option>System Users</option>
                        <option>Public</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="privacy-item">
                    <div className="privacy-info">
                      <h5>Activity Status</h5>
                      <p>Show when you're online</p>
                    </div>
                    <div className="privacy-control">
                      <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="privacy-item">
                    <div className="privacy-info">
                      <h5>Login Alerts</h5>
                      <p>Get notified of new login attempts</p>
                    </div>
                    <div className="privacy-control">
                      <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="security-section">
                <div className="section-header">
                  <Clock size={18} />
                  <h4>Session Management</h4>
                </div>
                
                <div className="active-sessions">
                  <h5>Active Sessions</h5>
                  <div className="session-list">
                    <div className="session-item current">
                      <div className="session-info">
                        <div className="session-device">Current Device</div>
                        <div className="session-details">
                          Chrome on Windows • Last active: Now
                        </div>
                      </div>
                      <div className="session-status">
                        <div className="status-badge online">Current</div>
                      </div>
                    </div>
                    
                    <div className="session-item">
                      <div className="session-info">
                        <div className="session-device">Mobile Device</div>
                        <div className="session-details">
                          Safari on iPhone • Last active: 2 hours ago
                        </div>
                      </div>
                      <div className="session-actions">
                        <button className="terminate-btn">Terminate</button>
                      </div>
                    </div>
                  </div>
                  
                  <button className="terminate-all-btn">Terminate All Other Sessions</button>
                </div>
              </div>
            </div>

            <div className="security-actions">
              <button className="save-btn modern">
                <Save size={16} />
                Save Security Settings
              </button>
              <button className="cancel-btn modern">
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'system' && (
          <div className="content-section">
            <div className="system-grid">
              <div className="system-section">
                <div className="section-header">
                  <Server size={18} />
                  <h4>System Configuration</h4>
                </div>
                
                <div className="system-options">
                  <div className="system-item">
                    <div className="system-info">
                      <h5>System Mode</h5>
                      <p>Current operational mode</p>
                    </div>
                    <div className="system-control">
                      <select className="form-input modern">
                        <option>Successfully Running</option>
                        <option>Maintenance</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="system-section">
                <div className="section-header">
                  <Database size={18} />
                  <h4>Database Settings</h4>
                </div>
                
                <div className="database-status">
                  <div className="status-card active">
                    <div className="status-icon">
                      <Database size={20} />
                    </div>
                    <div className="status-details">
                      <h5>Database Status</h5>
                      <p>Connected and operational</p>
                    </div>
                    <div className="status-indicator">
                      <div className="status-dot online"></div>
                    </div>
                  </div>
                </div>
                
                <div className="database-metrics">
                  <div className="metric-item">
                    <div className="metric-value">98.5%</div>
                    <div className="metric-label">Uptime</div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-value">2.4GB</div>
                    <div className="metric-label">Storage Used</div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-value">1,247</div>
                    <div className="metric-label">Records</div>
                  </div>
                </div>
                
                <div className="database-actions">
                  <button className="action-btn primary">Optimize Database</button>
                  <button className="action-btn secondary">Clear Cache</button>
                </div>
              </div>
            </div>

            <div className="system-grid">
              <div className="system-section">
                <div className="section-header">
                  <Users size={18} />
                  <h4>User Management</h4>
                </div>
                
                <div className="user-stats">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <User size={20} />
                    </div>
                    <div className="stat-info">
                      <div className="stat-number">523</div>
                      <div className="stat-label">Total Users</div>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">
                      <Shield size={20} />
                    </div>
                    <div className="stat-info">
                      <div className="stat-number">12</div>
                      <div className="stat-label">Admin Users</div>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">
                      <Users size={20} />
                    </div>
                    <div className="stat-info">
                      <div className="stat-number">89</div>
                      <div className="stat-label">Active Now</div>
                    </div>
                  </div>
                </div>
                
                <div className="user-actions">
                  <button className="action-btn primary">Manage Users</button>
                  <button className="action-btn secondary">Export User Data</button>
                </div>
              </div>

              <div className="system-section">
                <div className="section-header">
                  <Settings size={18} />
                  <h4>System Maintenance</h4>
                </div>
                
                <div className="maintenance-options">
                  <div className="maintenance-item">
                    <div className="maintenance-info">
                      <h5>Cleanup Temporary Files</h5>
                      <p>Remove unnecessary temporary data</p>
                    </div>
                    <button className="maintenance-btn">Run Cleanup</button>
                  </div>
                  
                  <div className="maintenance-item">
                    <div className="maintenance-info">
                      <h5>System Health Check</h5>
                      <p>Perform comprehensive system diagnostics</p>
                    </div>
                    <button className="maintenance-btn">Run Check</button>
                  </div>
                  
                  <div className="maintenance-item">
                    <div className="maintenance-info">
                      <h5>Update System</h5>
                      <p>Check and apply system updates</p>
                    </div>
                    <button className="maintenance-btn">Check Updates</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="system-section full-width">
              <div className="section-header">
                <Clock size={18} />
                <h4>System Information</h4>
              </div>
              
              <div className="system-info-grid">
                <div className="info-item">
                  <div className="info-label">System Version</div>
                  <div className="info-value">v2.4.1</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Last Updated</div>
                  <div className="info-value">2 days ago</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Server Status</div>
                  <div className="info-value">
                    <span className="status-badge online">Operational</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">API Version</div>
                  <div className="info-value">v1.3.0</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Database Version</div>
                  <div className="info-value">MySQL 8.0</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Cache Status</div>
                  <div className="info-value">
                    <span className="status-badge online">Active</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="system-actions">
              <button className="save-btn modern">
                <Save size={16} />
                Save System Settings
              </button>
              <button className="cancel-btn modern">
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
