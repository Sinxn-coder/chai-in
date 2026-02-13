import React from 'react';

export default function App() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', textAlign: 'center', marginBottom: '20px' }}>
        BytSpot Admin Panel
      </h1>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h2 style={{ color: '#666', marginBottom: '10px' }}>Application Status</h2>
        <p style={{ color: '#888', lineHeight: '1.6' }}>
          The BytSpot Admin Panel is loading successfully. This is a basic test version 
          to verify that the React application is working properly.
        </p>
        <div style={{ 
          backgroundColor: '#e8f5e8', 
          padding: '15px', 
          borderRadius: '4px',
          border: '1px solid #4caf50',
          marginTop: '20px'
        }}>
          <strong style={{ color: '#2e7d32' }}>✅ Application Working</strong>
          <p style={{ margin: '5px 0 0 0', color: '#2e7d32' }}>
            React is rendering correctly and the page is displaying properly.
          </p>
        </div>
      </div>
    </div>
  );
}
