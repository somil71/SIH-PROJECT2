import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Real-time data states
  const [liveStats, setLiveStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    activeConsultations: 0
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      // Try to connect to WebSocket server with fallback to demo mode
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      
      const newSocket = io(BACKEND_URL, {
        auth: {
          userId: user.id,
          userType: user.role || 'patient',
          userName: user.name
        },
        transports: ['websocket', 'polling'],
        timeout: 5000,
        reconnection: true,
        reconnectionDelay: 2000,
        reconnectionAttempts: maxReconnectAttempts
      });

      newSocket.on('connect', () => {
        console.log('✅ Connected to WebSocket server');
        setConnected(true);
        setSocket(newSocket);
        reconnectAttempts.current = 0;
        
        // Add welcome notification
        addNotification({
          id: Date.now(),
          type: 'system',
          title: 'Connected',
          message: 'Real-time notifications are now active',
          priority: 'low'
        });
      });

      newSocket.on('connect_error', (error) => {
        console.log('❌ WebSocket connection failed:', error.message);
        setConnected(false);
        
        // Enable demo mode with simulated notifications
        startDemoMode();
      });

      newSocket.on('disconnect', (reason) => {
        console.log('🔌 Disconnected from server:', reason);
        setConnected(false);
        
        if (reason === 'io server disconnect') {
          // Server forcefully disconnected, don't try to reconnect
          addNotification({
            id: Date.now(),
            type: 'system',
            title: 'Connection Lost',
            message: 'Server disconnected. Some features may be limited.',
            priority: 'medium'
          });
          return;
        }
      });

      // Connection timeout fallback
      const connectionTimeout = setTimeout(() => {
        if (!connected) {
          console.log('🕒 Connection timeout - switching to demo mode');
          newSocket.disconnect();
          startDemoMode();
        }
      }, 8000);

      // Listen for real-time updates
      newSocket.on('stats-update', (data) => {
        setLiveStats(data);
      });

      newSocket.on('users-online', (users) => {
        setOnlineUsers(users);
      });

      newSocket.on('new-appointment', (appointment) => {
        addNotification({
          id: Date.now(),
          type: 'appointment',
          title: 'New Appointment',
          message: `New appointment scheduled with ${appointment.doctorName}`,
          data: appointment
        });
      });

      newSocket.on('appointment-cancelled', (appointment) => {
        addNotification({
          id: Date.now(),
          type: 'cancellation',
          title: 'Appointment Cancelled',
          message: `Appointment with ${appointment.doctorName} has been cancelled`,
          data: appointment
        });
      });

      newSocket.on('doctor-available', (doctor) => {
        addNotification({
          id: Date.now(),
          type: 'availability',
          title: 'Doctor Available',
          message: `Dr. ${doctor.name} is now available for consultations`,
          data: doctor
        });
      });

      newSocket.on('new-message', (message) => {
        addNotification({
          id: Date.now(),
          type: 'message',
          title: 'New Message',
          message: `New message from ${message.senderName}`,
          data: message
        });
      });

      newSocket.on('video-call-request', (callData) => {
        addNotification({
          id: Date.now(),
          type: 'video-call',
          title: 'Incoming Video Call',
          message: `${callData.callerName} is calling you`,
          data: callData,
          priority: 'high'
        });
      });

      setSocket(newSocket);

      return () => {
        clearTimeout(connectionTimeout);
        newSocket.disconnect();
        setSocket(null);
        setConnected(false);
      };
    }
  }, [isAuthenticated, user]);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 20)); // Keep only latest 20
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Demo mode for when WebSocket is not available
  const startDemoMode = () => {
    console.log('🎤 Starting demo mode - simulated notifications enabled');
    setConnected(false); // Keep as false to show demo status
    
    // Add demo notification
    addNotification({
      id: Date.now(),
      type: 'system',
      title: 'Demo Mode Active',
      message: 'Using simulated notifications for demonstration',
      priority: 'low'
    });

    // Simulate various medical notifications
    const demoNotifications = [
      {
        type: 'appointment',
        title: 'Appointment Reminder',
        message: 'Your appointment with Dr. Smith is tomorrow at 10:00 AM',
        priority: 'medium'
      },
      {
        type: 'prescription',
        title: 'Prescription Ready',
        message: 'Your prescription is ready for pickup at City Pharmacy',
        priority: 'medium'
      },
      {
        type: 'test-result',
        title: 'Test Results Available',
        message: 'Your blood test results are now available in your portal',
        priority: 'high'
      },
      {
        type: 'health-tip',
        title: 'Daily Health Tip',
        message: 'Remember to stay hydrated! Aim for 8 glasses of water today',
        priority: 'low'
      }
    ];

    // Add demo notifications with delays
    demoNotifications.forEach((notif, index) => {
      setTimeout(() => {
        addNotification({
          id: Date.now() + index,
          ...notif
        });
      }, (index + 1) * 5000); // 5s intervals
    });
  };

  // Emit events
  const joinRoom = (roomId) => {
    if (socket) {
      socket.emit('join-room', roomId);
    }
  };

  const leaveRoom = (roomId) => {
    if (socket) {
      socket.emit('leave-room', roomId);
    }
  };

  const sendMessage = (roomId, message) => {
    if (socket) {
      socket.emit('send-message', { roomId, message });
    }
  };

  const updateUserStatus = (status) => {
    if (socket) {
      socket.emit('update-status', status);
    }
  };

  const requestVideoCall = (recipientId, callData) => {
    if (socket) {
      socket.emit('video-call-request', { recipientId, callData });
    }
  };

  const acceptVideoCall = (callId) => {
    if (socket) {
      socket.emit('accept-video-call', callId);
    }
  };

  const rejectVideoCall = (callId) => {
    if (socket) {
      socket.emit('reject-video-call', callId);
    }
  };

  const updateLiveStats = () => {
    if (socket) {
      socket.emit('request-stats-update');
    }
  };

  // Listen for custom events based on user role
  useEffect(() => {
    if (socket && user) {
      if (user.role === 'admin') {
        socket.on('admin-alert', (alert) => {
          addNotification({
            id: Date.now(),
            type: 'admin-alert',
            title: 'System Alert',
            message: alert.message,
            priority: alert.priority || 'normal'
          });
        });

        socket.on('user-registered', (newUser) => {
          addNotification({
            id: Date.now(),
            type: 'registration',
            title: 'New User Registration',
            message: `${newUser.name} has registered as a ${newUser.role}`,
            data: newUser
          });
        });
      }

      if (user.role === 'doctor') {
        socket.on('patient-booking', (booking) => {
          addNotification({
            id: Date.now(),
            type: 'booking',
            title: 'New Patient Booking',
            message: `${booking.patientName} has booked an appointment`,
            data: booking
          });
        });

        socket.on('emergency-consultation', (emergency) => {
          addNotification({
            id: Date.now(),
            type: 'emergency',
            title: 'Emergency Consultation Request',
            message: `Urgent consultation needed for ${emergency.patientName}`,
            data: emergency,
            priority: 'high'
          });
        });
      }
    }

    return () => {
      if (socket) {
        socket.off('admin-alert');
        socket.off('user-registered');
        socket.off('patient-booking');
        socket.off('emergency-consultation');
      }
    };
  }, [socket, user]);

  const value = {
    socket,
    connected,
    onlineUsers,
    notifications,
    liveStats,
    // Methods
    joinRoom,
    leaveRoom,
    sendMessage,
    updateUserStatus,
    requestVideoCall,
    acceptVideoCall,
    rejectVideoCall,
    updateLiveStats,
    addNotification,
    removeNotification,
    clearAllNotifications
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContext;
