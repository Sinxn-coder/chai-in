import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import './PushNotifications.css';

const PushNotifications = () => {
  const [showSendForm, setShowSendForm] = useState(false);
  const [newNotification, setNewNotification] = useState({
    type: 'info',
    title: '',
    message: ''
  });

  const sendNotification = () => {
    try {
      if (newNotification.title && newNotification.message) {
        // Here you would normally send the notification to backend
        console.log('Notification sent:', newNotification);
        setNewNotification({ type: 'info', title: '', message: '' });
        setShowSendForm(false);
        alert('Notification sent successfully!');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return (
    <div className="push-notifications">
      <div className="notifications-header">
        <div className="header-left">
          <h2>Send Notification</h2>
          <p>Create and send notifications to users</p>
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
              disabled={!newNotification.title || !newNotification.message}
            >
              <Send size={16} />
              Send Notification
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PushNotifications;
