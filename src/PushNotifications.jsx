import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Check, X, AlertTriangle, Info, Settings } from 'lucide-react';
import './PushNotifications.css';

const PushNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'urgent',
      title: 'New Flagged Content',
      message: '5 spots have been flagged for review',
      time: '2 min ago',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'High Activity',
      message: 'Unusual spike in spot submissions detected',
      time: '15 min ago',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'System Update',
      message: 'Maintenance scheduled for tonight 11 PM',
      time: '1 hour ago',
      read: true
    },
    {
      id: 4,
      type: 'success',
      title: 'Bulk Approval Complete',
      message: '23 spots have been successfully approved',
      time: '3 hours ago',
      read: true
    }
  ]);

  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle size={16} className="notification-icon urgent" />;
      case 'warning':
        return <AlertTriangle size={16} className="notification-icon warning" />;
      case 'success':
        return <Check size={16} className="notification-icon success" />;
      case 'info':
      default:
        return <Info size={16} className="notification-icon info" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="push-notifications">
      {/* Header */}
      <div className="notifications-header">
        <div className="header-left">
          <h2>Push Notifications</h2>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </div>
        <div className="header-actions">
          <button 
            className="action-btn"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark All Read
          </button>
          <button 
            className="action-btn danger"
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="notification-settings">
        <h3>Notification Settings</h3>
        <div className="settings-grid">
          <div className="setting-item">
            <div className="setting-info">
              <Bell size={20} className="setting-icon" />
              <div className="setting-details">
                <h4>Push Notifications</h4>
                <p>Receive alerts for important events</p>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={pushEnabled}
                onChange={(e) => setPushEnabled(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <Bell size={20} className="setting-icon" />
              <div className="setting-details">
                <h4>Sound</h4>
                <p>Play sound for notifications</p>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <Bell size={20} className="setting-icon" />
              <div className="setting-details">
                <h4>Vibration</h4>
                <p>Vibrate for notifications</p>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={vibrationEnabled}
                onChange={(e) => setVibrationEnabled(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        <h3>Recent Notifications</h3>
        {notifications.length === 0 ? (
          <div className="empty-notifications">
            <BellOff size={48} className="empty-icon" />
            <p>No notifications yet</p>
            <span>Notifications will appear here when events occur</span>
          </div>
        ) : (
          <div className="notifications-container">
            {notifications.map(notification => (
              <div 
                key={notification.id}
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="notification-content">
                  <div className="notification-left">
                    {getNotificationIcon(notification.type)}
                    <div className="notification-text">
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                  </div>
                  <div className="notification-actions">
                    {!notification.read && (
                      <button 
                        className="mark-read-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button 
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PushNotifications;
