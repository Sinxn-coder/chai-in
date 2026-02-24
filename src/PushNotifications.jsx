import React, { useState } from 'react';
import { Bell, Send, AlertTriangle, Info, CheckCircle, AlertCircle, MessageSquare, Zap, MoreVertical } from 'lucide-react';
import './PushNotifications.css';

const PushNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'urgent',
      title: 'Security Alert',
      message: 'Your account was accessed from a new device. Please verify if this was you.',
      time: '2 min ago',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'New Feature Available',
      message: 'Check out our new spot recommendation engine that helps you discover better places!',
      time: '15 min ago',
      read: false
    },
    {
      id: 3,
      type: 'success',
      title: 'Spot Verified Successfully',
      message: 'Your submitted spot "Sunset Restaurant" has been approved and is now live!',
      time: '1 hour ago',
      read: true
    },
    {
      id: 4,
      type: 'warning',
      title: 'Account Activity Warning',
      message: 'Unusual login pattern detected. Please review your recent activity.',
      time: '2 hours ago',
      read: true
    },
    {
      id: 5,
      type: 'message',
      title: 'New Message from Admin',
      message: 'Thank you for being an active community member! Here\'s a special reward for you.',
      time: '3 hours ago',
      read: false
    },
    {
      id: 6,
      type: 'system',
      title: 'Scheduled Maintenance',
      message: 'System will be down for maintenance tonight from 11 PM to 2 AM.',
      time: '5 hours ago',
      read: true
    },
    {
      id: 7,
      type: 'urgent',
      title: 'Payment Failed',
      message: 'Your recent payment could not be processed. Please update your payment method.',
      time: '6 hours ago',
      read: false
    },
    {
      id: 8,
      type: 'info',
      title: 'Weekly Summary',
      message: 'You visited 12 spots and left 8 reviews this week. Keep up the great work!',
      time: '1 day ago',
      read: true
    },
    {
      id: 9,
      type: 'success',
      title: 'Achievement Unlocked',
      message: 'Congratulations! You\'ve earned the "Explorer" badge for visiting 50 unique spots!',
      time: '2 days ago',
      read: true
    },
    {
      id: 10,
      type: 'message',
      title: 'Community Update',
      message: '5 new spots have been added in your area. Check them out now!',
      time: '3 days ago',
      read: true
    }
  ]);
  const [showSendForm, setShowSendForm] = useState(false);
  const [newNotification, setNewNotification] = useState({
    type: 'info',
    title: '',
    message: ''
  });
  const [activeDropdown, setActiveDropdown] = useState(null);

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

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    setActiveDropdown(null);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle size={16} className="notification-icon urgent" />;
      case 'success':
        return <CheckCircle size={16} className="notification-icon success" />;
      case 'warning':
        return <AlertCircle size={16} className="notification-icon warning" />;
      case 'message':
        return <MessageSquare size={16} className="notification-icon message" />;
      case 'system':
        return <Zap size={16} className="notification-icon system" />;
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
          <h2>User Notifications</h2>
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
                <option value="warning">Warning</option>
                <option value="message">Message</option>
                <option value="system">System</option>
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
              <div key={notification.id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
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
                      className="notification-options-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(notification.id);
                      }}
                    >
                      <MoreVertical size={16} />
                    </button>
                    {activeDropdown === notification.id && (
                      <div className={`notification-dropdown ${notification.type}`}>
                        <button 
                          className="dropdown-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Resend notification logic
                            const resendNotification = {
                              id: Date.now(),
                              type: notification.type,
                              title: notification.title,
                              message: notification.message,
                              time: 'Just now',
                              read: false
                            };
                            setNotifications([resendNotification, ...notifications]);
                            setActiveDropdown(null);
                          }}
                        >
                          <Send size={16} />
                          <span>Send again</span>
                        </button>
                        <button 
                          className="dropdown-item delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <AlertTriangle size={16} />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
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
