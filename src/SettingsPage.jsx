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
