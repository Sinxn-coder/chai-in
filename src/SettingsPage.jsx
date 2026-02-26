import React, { useState } from 'react';
import { User, Shield, Bell, Database } from 'lucide-react';
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
            <h2>Admin Profile Settings</h2>
            <p>Manage your administrator profile and system access settings</p>
            
            <div className="settings-form">
              <div className="form-group">
                <label>Admin Profile Picture</label>
                <div className="profile-picture-section">
                  <div className="avatar-preview">
                    <div className="avatar-placeholder">�‍💼</div>
                  </div>
                  <button className="upload-btn">Upload Photo</button>
                  <button className="remove-btn">Remove</button>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Admin First Name</label>
                  <input type="text" className="form-input" placeholder="Admin" />
                </div>
                <div className="form-group">
                  <label>Admin Last Name</label>
                  <input type="text" className="form-input" placeholder="User" />
                </div>
              </div>

              <div className="form-group">
                <label>Admin Email Address</label>
                <input type="email" className="form-input" placeholder="admin@company.com" />
              </div>

              <div className="form-group">
                <label>Admin Username</label>
                <input type="text" className="form-input" placeholder="admin_user" />
              </div>

              <div className="form-group">
                <label>Admin ID</label>
                <input type="text" className="form-input" placeholder="ADM-001" disabled />
                <small>System-generated administrator ID</small>
              </div>

              <div className="form-group">
                <label>Department</label>
                <select className="form-input">
                  <option>System Administration</option>
                  <option>IT Operations</option>
                  <option>Security Team</option>
                  <option>Development</option>
                  <option>Management</option>
                </select>
              </div>

              <div className="form-group">
                <label>Admin Role</label>
                <select className="form-input">
                  <option>Super Administrator</option>
                  <option>System Administrator</option>
                  <option>Security Administrator</option>
                  <option>Database Administrator</option>
                  <option>Network Administrator</option>
                </select>
              </div>

              <div className="form-group">
                <label>Access Level</label>
                <div className="access-level-display">
                  <div className="level-badge super-admin">Super Admin</div>
                  <small>Full system access and control</small>
                </div>
              </div>

              <div className="form-group">
                <label>Admin Bio</label>
                <textarea className="form-textarea" placeholder="Describe your administrative responsibilities and expertise..." rows="4"></textarea>
              </div>

              <div className="form-group">
                <label>Office Location</label>
                <input type="text" className="form-input" placeholder="Building A, Floor 3, Server Room" />
              </div>

              <div className="form-group">
                <label>Extension</label>
                <input type="tel" className="form-input" placeholder="x1234" />
              </div>

              <div className="form-group">
                <label>Emergency Contact</label>
                <input type="tel" className="form-input" placeholder="+1-555-0123" />
              </div>

              <div className="form-group">
                <label>System Access</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Server management access</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>User account management</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>System configuration</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Security settings</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Database administration</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span>Billing and payments</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Admin Preferences</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Show admin status to users</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Receive system alerts</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Show online availability</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span>Enable two-factor authentication</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Admin Certifications</label>
                <div className="certification-list">
                  <input type="text" className="form-input" placeholder="e.g., AWS Certified Solutions Architect" />
                  <input type="text" className="form-input" placeholder="e.g., Certified Information Systems Security Professional (CISSP)" />
                  <input type="text" className="form-input" placeholder="e.g., Microsoft Certified: Azure Administrator" />
                </div>
              </div>

              <div className="form-actions">
                <button className="save-btn">Save Admin Profile</button>
                <button className="cancel-btn">Cancel</button>
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
