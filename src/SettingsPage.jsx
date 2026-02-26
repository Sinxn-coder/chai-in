import React, { useState } from 'react';
import { User, Shield, Bell, Database, Crown, Lock, Building, Mail, MapPin, Phone, Key, Server, Users, Settings, Check, X, CreditCard, FileText, Award, Save } from 'lucide-react';
import './SettingsPage.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
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

              <div className="certifications-section">
                <div className="section-header">
                  <Award size={18} />
                  <h4>Professional Certifications</h4>
                </div>
                <div className="certification-list">
                  <div className="cert-item">
                    <div className="cert-icon">🏆</div>
                    <div className="cert-details">
                      <h5>AWS Certified Solutions Architect</h5>
                      <p>Amazon Web Services • 2023</p>
                    </div>
                  </div>
                  <div className="cert-item">
                    <div className="cert-icon">🛡️</div>
                    <div className="cert-details">
                      <h5>CISSP - Certified Information Systems Security Professional</h5>
                      <p>(ISC)² • 2022</p>
                    </div>
                  </div>
                  <div className="cert-item">
                    <div className="cert-icon">☁️</div>
                    <div className="cert-details">
                      <h5>Microsoft Certified: Azure Administrator</h5>
                      <p>Microsoft • 2021</p>
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
            <h2>Security Settings</h2>
            <p>Manage your security and privacy settings</p>
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div className="content-section">
            <h2>Notification Settings</h2>
            <p>Configure how you receive notifications</p>
          </div>
        )}
        
        {activeTab === 'system' && (
          <div className="content-section">
            <h2>System Settings</h2>
            <p>Manage system-wide configurations</p>
          </div>
        )}
      </div>
    </div>
  );
}
