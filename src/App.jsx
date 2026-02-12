import React from 'react';

function App() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      color: '#333',
      fontSize: '24px',
      fontFamily: 'Arial, sans-serif',
      padding: '40px',
      textAlign: 'center'
    }}>
      <div>
        <h1 style={{ marginBottom: '20px', fontSize: '36px', fontWeight: 'bold' }}>Chai-in</h1>
        <h2 style={{ marginBottom: '16px', fontSize: '24px', color: '#666' }}>Food Discovery Platform</h2>
        <p style={{ marginBottom: '12px', fontSize: '18px', lineHeight: '1.6' }}>A modern food discovery platform designed to connect users with amazing food spots in their community.</p>
        
        <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>Project Status</h3>
        <p style={{ marginBottom: '8px', fontSize: '16px' }}>This platform is currently under development and maintenance.</p>
        <p style={{ marginBottom: '8px', fontSize: '16px' }}>We are working hard to bring you an enhanced experience with new features and improvements.</p>
        
        <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>What's Coming Next</h3>
        <p style={{ marginBottom: '8px', fontSize: '16px' }}>• Enhanced user profiles and authentication system</p>
        <p style={{ marginBottom: '8px', fontSize: '16px' }}>• Advanced search and filtering capabilities</p>
        <p style={{ marginBottom: '8px', fontSize: '16px' }}>• Community-driven content and reviews</p>
        <p style={{ marginBottom: '8px', fontSize: '16px' }}>• Real-time notifications and updates</p>
        <p style={{ marginBottom: '8px', fontSize: '16px' }}>• Mobile and desktop applications</p>
        
        <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>Technology Stack</h3>
        <p style={{ marginBottom: '8px', fontSize: '16px' }}>• Frontend: React.js with modern UI/UX</p>
        <p style={{ marginBottom: '8px', fontSize: '16px' }}>• Backend: Supabase for real-time data</p>
        <p style={{ marginBottom: '8px', fontSize: '16px' }}>• Mobile: Flutter for cross-platform experience</p>
        <p style={{ marginBottom: '8px', fontSize: '16px' }}>• Deployment: GitHub Pages for reliable hosting</p>
        
        <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>Contact & Support</h3>
        <p style={{ marginBottom: '8px', fontSize: '16px' }}>For project inquiries and support, please contact the development team.</p>
        
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '0' }}>Thank you for your patience while we improve our platform.</p>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '0' }}>We look forward to serving you better soon.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
