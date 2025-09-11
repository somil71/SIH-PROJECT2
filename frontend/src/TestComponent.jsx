import React from 'react';

const TestComponent = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
      }}>
        <h1 style={{ 
          color: '#1f2937', 
          fontSize: '32px', 
          fontWeight: 'bold',
          marginBottom: '16px'
        }}>
          🏥 HealthCare App
        </h1>
        <p style={{ 
          color: '#6b7280', 
          fontSize: '18px',
          marginBottom: '24px'
        }}>
          System is working! This means the white screen issue is likely in one of the complex components.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '12px',
          marginTop: '20px'
        }}>
          <button 
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
            onClick={() => window.location.href = '/login'}
          >
            Login
          </button>
          <button 
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
            onClick={() => window.location.href = '/demo'}
          >
            Demo
          </button>
        </div>
        <div style={{ marginTop: '20px', fontSize: '14px', color: '#9ca3af' }}>
          If you can see this, React is working correctly.
        </div>
      </div>
    </div>
  );
};

export default TestComponent;
