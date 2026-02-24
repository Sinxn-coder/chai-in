import React, { useState } from 'react';
import { Bell, Send, X, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import './PushNotifications.css';

const PushNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showSendForm, setShowSendForm] = useState(false);
  const [newNotification, setNewNotification] = useState({
    type: 'info',
    title: '',
    message: ''
  });

  const sendNotification = () => {
    if (newNotification.title && newNotification.message) {
      const notification = {
        id: Date.now(),
        type: newNotification.type,
        title: newNotification.title,
        message: newNotification.message,
        time: 'Just now',
        read: false
      };
      
      setNotifications([notification, ...notifications]);
      setNewNotification({ type: 'info', title: '', message: '' });
      setShowSendForm(false);
    }
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle size={16} className="notification-icon urgent" />;
      case 'success':
        return <CheckCircle size={16} className="notification-icon success" />;
      case 'info':
      default:
        return <Info size={16} className="notification-icon info" />;
    }
  };

  return (
    <div className="push-notifications">
      {/* Header */}
      <div className="notifications-header">
        <div className="header-left">
          <h2>Push Notifications</h2>
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="unread-badge">{notifications.filter(n => !n.read).length}</span>
          )}
        </div>
        <button 
          className="send-notification-btn"
          onClick={() => setShowSendForm(!showSendForm)}
        >
          <Send size={16} />
          Send
        </button>
      </div>

      {/* Send Notification Form */}
      {showSendForm && (
        <div className="send-notification-form">
          <div className="form-header">
            <h3>Send New Notification</h3>
            <button 
              className="close-form-btn"
              onClick={() => setShowSendForm(false)}
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="form-content">
            <div className="form-group">
              <label>Notification Type</label>
              <select 
                value={newNotification.type}
                onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                className="type-select"
              >
                <option value="info">Info</option>
                <option value="urgent">Urgent</option>
                <option value="success">Success</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                placeholder="Enter notification title..."
                value={newNotification.title}
                onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                className="title-input"
              />
            </div>
            
            <div className="form-group">
              <label>Message</label>
              <textarea
                placeholder="Enter notification message..."
                value={newNotification.message}
                onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                className="message-input"
                rows="3"
              />
            </div>
            
            <button 
              className="submit-btn"
              onClick={sendNotification}
              disabled={!newNotification.title || !newNotification.message}
            >
              <Send size={16} />
              Send Notification
            </button>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="notifications-list">
        <h3>Recent Notifications</h3>
        {notifications.length === 0 ? (
          <div className="empty-notifications">
            <Bell size={48} className="empty-icon" />
            <p>No notifications yet</p>
            <span>Send your first notification using the Send button above</span>
          </div>
        ) : (
          <div className="notifications-container">
            {notifications.map(notification => (
              <div key={notification.id} className="notification-item">
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
                    <button 
                      className="delete-btn"
                      onClick={() => deleteNotification(notification.id)}
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
