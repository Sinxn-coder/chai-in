import React, { useState, useEffect } from 'react';
import { 
  Send, X, AlertTriangle, Info, CheckCircle, 
  AlertCircle, MessageSquare, Zap, MoreVertical, 
  Users, Activity, Bell, Clock, Trash2, RotateCcw 
} from 'lucide-react';
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

  useEffect(() => {
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
            category: 'broadcast',
            visual_style: 'premium'
          }
        });

        if (error) throw error;

        setNewNotification({ type: 'info', title: '', message: '' });
        setShowSendForm(false);
        // Using native alert for now as requested by original logic, 
        // but could be replaced with a toast later
        alert('Broadcast notification sent to all users!');
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification: ' + error.message);
    } finally {
      setIsSending(false);
    }
  };

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const deleteNotification = async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotifications(notifications.filter(n => n.id !== id));
      setActiveDropdown(null);
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle size={20} />;
      case 'success':
        return <CheckCircle size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      case 'message':
        return <MessageSquare size={20} />;
      case 'system':
        return <Zap size={20} />;
      case 'info':
      default:
        return <Info size={20} />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="push-notifications">
      {/* Stats Section */}
      <div className="notifications-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#3b82f6' }}><Bell size={24} /></div>
          <h3>Total Broadcasts</h3>
          <div className="stat-value">{notifications.length}</div>
          <div className="stat-trend positive">System Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#f59e0b' }}><Activity size={24} /></div>
          <h3>Monthly Activity</h3>
          <div className="stat-value">{notifications.filter(n => {
            const date = new Date(n.created_at);
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return date > monthAgo;
          }).length}</div>
          <div className="stat-trend positive">Real Time</div>
        </div>
      </div>

      <div className="notifications-header">
        <h2>Push Notifications</h2>
        <button 
          className="broadcast-btn"
          onClick={() => setShowSendForm(true)}
        >
          <Zap size={18} />
          Create Broadcast
        </button>
      </div>

      {showSendForm && (
        <div className="form-overlay" onClick={() => setShowSendForm(false)}>
          <div className="send-notification-form" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <h3>Send New Broadcast</h3>
              <button 
                className="close-form-btn"
                onClick={() => setShowSendForm(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="form-content">
              <div className="form-group">
                <label>Alert Type</label>
                <select 
                  value={newNotification.type}
                  onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                  className="modern-select"
                >
                  <option value="info">Information</option>
                  <option value="urgent">Urgent Alert</option>
                  <option value="success">Success Message</option>
                  <option value="warning">Warning</option>
                  <option value="message">Direct Communication</option>
                  <option value="system">System Update</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Notification Title</label>
                <input
                  type="text"
                  placeholder="e.g. New Special Offers Available!"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                  className="modern-input"
                />
              </div>
              
              <div className="form-group">
                <label>Detailed Message</label>
                <textarea
                  placeholder="Tell your users something important..."
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                  className="modern-textarea"
                  rows="4"
                />
              </div>
              
              <button 
                className="submit-btn"
                onClick={(e) => {
                  e.preventDefault();
                  sendNotification();
                }}
                disabled={!newNotification.title || !newNotification.message || isSending}
              >
                {isSending ? (
                  <div className="spinner-white"></div>
                ) : (
                  <Send size={18} />
                )}
                {isSending ? 'Projecting to Users...' : 'Broadcast to All Users'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Notifications List */}
      <div className="activity-section">
        <div className="activity-section-header">
          <h3>Recent History</h3>
          <span className="activity-badge">{notifications.length} Records</span>
        </div>

        {isLoading ? (
          <div className="empty-notifications">
            <div className="spinner-white" style={{ borderColor: 'var(--nn-primary)', borderTopColor: 'transparent', width: 40, height: 40, margin: '0 auto 20px' }}></div>
            <p>Syncing notification records...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="empty-notifications">
            <Bell size={48} strokeWidth={1} style={{ marginBottom: 16, color: '#94a3b8' }} />
            <p>No activity yet</p>
            <span>Your broadcasted messages will appear here as a chronological log.</span>
          </div>
        ) : (
          <div className="notifications-container">
            {notifications.map(notification => (
              <div key={notification.id} className="notification-item">
                <div className={`notification-icon-wrapper icon-${notification.type}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="notification-main">
                  <div className="notification-top">
                    <h4>{notification.title}</h4>
                    <div className="notification-actions-menu">
                      <button 
                        className="options-trigger"
                        onClick={() => toggleDropdown(notification.id)}
                      >
                        <MoreVertical size={18} />
                      </button>
                      
                      {activeDropdown === notification.id && (
                        <div className="modern-dropdown">
                          <button 
                            className="dropdown-action"
                            onClick={() => {
                              setNewNotification({
                                type: notification.type,
                                title: notification.title,
                                message: notification.message
                              });
                              setShowSendForm(true);
                              setActiveDropdown(null);
                            }}
                          >
                            <RotateCcw size={14} />
                            Reuse
                          </button>
                          <button 
                            className="dropdown-action delete"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p>{notification.message}</p>
                  <div className="notification-footer">
                    <div className={`notification-type-tag tag-${notification.type}`}>
                      {notification.type}
                    </div>
                    <span className="notification-time">
                      <Clock size={12} />
                      {formatTime(notification.created_at)}
                    </span>
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
