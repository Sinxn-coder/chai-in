import React, { useState } from 'react';
import { Send, X, AlertTriangle, Info, CheckCircle, AlertCircle, MessageSquare, Zap, MoreVertical } from 'lucide-react';
import './PushNotifications.css';
import { supabase } from './supabase';

const PushNotifications = () => {
  const [showSendForm, setShowSendForm] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newNotification, setNewNotification] = useState({
    type: 'info',
    title: '',
    message: ''
  });
  const [notifications, setNotifications] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);

  React.useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setNotifications(data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const sendNotification = async () => {
    try {
      if (newNotification.title && newNotification.message) {
        setIsSending(true);
        
        // Use RPC to broadcast to all users
        const { error } = await supabase.rpc('broadcast_notification', {
          p_type: newNotification.type,
          p_title: newNotification.title,
          p_message: newNotification.message,
          p_data: { 
            sender_name: 'Admin',
            category: 'broadcast'
          }
        });

        if (error) throw error;

        setNewNotification({ type: 'info', title: '', message: '' });
        setShowSendForm(false);
        alert('Broadcast notification sent to all users!');
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error sending notification:', error);
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
      <div className="notifications-header">
        <div className="header-left">
          <h2>Send Notification</h2>
        </div>
        <button 
          className="send-notification-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowSendForm(!showSendForm);
          }}
        >
          <Send size={16} />
          {showSendForm ? 'Cancel' : 'Send'}
        </button>
      </div>

      {showSendForm && (
        <div className="send-notification-form">
          <div className="form-header">
            <h3>New Notification</h3>
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                sendNotification();
              }}
              disabled={!newNotification.title || !newNotification.message || isSending}
            >
              {isSending ? (
                <div className="spinner-small" style={{ width: 16, height: 16, borderColor: 'white', borderTopColor: 'transparent' }}></div>
              ) : (
                <Send size={16} />
              )}
              {isSending ? 'Sending Broadcast...' : 'Broadcast to All Users'}
            </button>
          </div>
        </div>
      )}

      {/* Recent Notifications Section */}
      <div className="notifications-list">
        <h3>Recent Activity</h3>
        {isLoading ? (
          <div className="empty-notifications">
            <div className="spinner-small" style={{ width: 30, height: 30, margin: '0 auto 10px' }}></div>
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="empty-notifications">
            <p>No notifications yet</p>
            <span>Broadcast messages will appear here</span>
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
                      <span className="notification-time">
                        {new Date(notification.created_at).toLocaleString()}
                      </span>
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
