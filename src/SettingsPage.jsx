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
            <h2>Profile Settings</h2>
            <p>Manage your profile information and preferences</p>
            
            <div className="settings-form">
              <div className="form-group">
                <label>Profile Picture</label>
                <div className="profile-picture-section">
                  <div className="avatar-preview">
                    <div className="avatar-placeholder">👤</div>
                  </div>
                  <button className="upload-btn">Upload Photo</button>
                  <button className="remove-btn">Remove</button>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" className="form-input" placeholder="John" />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" className="form-input" placeholder="Doe" />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="form-input" placeholder="john.doe@example.com" />
              </div>

              <div className="form-group">
                <label>Username</label>
                <input type="text" className="form-input" placeholder="johndoe" />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea className="form-textarea" placeholder="Tell us about yourself..." rows="4"></textarea>
              </div>

              <div className="form-group">
                <label>Location</label>
                <input type="text" className="form-input" placeholder="City, Country" />
              </div>

              <div className="form-group">
                <label>Website</label>
                <input type="url" className="form-input" placeholder="https://yourwebsite.com" />
              </div>

              <div className="form-group">
                <label>Social Links</label>
                <div className="social-links">
                  <input type="text" className="form-input" placeholder="Twitter @username" />
                  <input type="text" className="form-input" placeholder="LinkedIn profile" />
                  <input type="text" className="form-input" placeholder="GitHub username" />
                </div>
              </div>

              <div className="form-group">
                <label>Preferences</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span>Show profile to public</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span>Allow email notifications</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span>Show online status</span>
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button className="save-btn">Save Changes</button>
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
