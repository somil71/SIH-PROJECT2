import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import {
  UserPlusIcon,
  CalendarDaysIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const RealTimeDemo = () => {
  const { user, isAuthenticated, isAdmin, isDoctor } = useAuth();
  const { addNotification, connected, liveStats } = useWebSocket();
  const [simulatedUsers, setSimulatedUsers] = useState([]);
  const [demoStats, setDemoStats] = useState({ doctors: 142, patients: 2847, appointments: 5632 });

  // Simulate adding new users
  const simulateNewUser = (userType) => {
    const names = ['John Doe', 'Jane Smith', 'Dr. Robert Wilson', 'Dr. Sarah Connor', 'Mike Johnson', 'Emily Davis'];
    const newUser = {
      id: Date.now(),
      name: names[Math.floor(Math.random() * names.length)],
      type: userType,
      timestamp: new Date()
    };

    setSimulatedUsers(prev => [newUser, ...prev].slice(0, 5));

    // Update stats
    setDemoStats(prev => ({
      ...prev,
      [userType === 'doctor' ? 'doctors' : 'patients']: prev[userType === 'doctor' ? 'doctors' : 'patients'] + 1
    }));

    // Send notification
    addNotification({
      id: Date.now(),
      type: 'registration',
      title: `New ${userType} Registration`,
      message: `${newUser.name} has joined as a ${userType}`,
      data: newUser
    });
  };

  const simulateAppointment = () => {
    const doctorNames = ['Dr. Smith', 'Dr. Johnson', 'Dr. Wilson'];
    const patientNames = ['John Doe', 'Jane Smith', 'Mike Davis'];
    
    const appointment = {
      doctor: doctorNames[Math.floor(Math.random() * doctorNames.length)],
      patient: patientNames[Math.floor(Math.random() * patientNames.length)],
      time: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
    };

    setDemoStats(prev => ({
      ...prev,
      appointments: prev.appointments + 1
    }));

    addNotification({
      id: Date.now(),
      type: 'appointment',
      title: 'New Appointment Scheduled',
      message: `${appointment.patient} booked with ${appointment.doctor} on ${appointment.time}`,
      data: appointment
    });
  };

  const simulateVideoCall = () => {
    addNotification({
      id: Date.now(),
      type: 'video-call',
      title: 'Incoming Video Call',
      message: `Dr. Wilson is calling you for your scheduled consultation`,
      priority: 'high',
      data: { callId: Date.now(), caller: 'Dr. Wilson' }
    });
  };

  const simulateMessage = () => {
    const messages = [
      'Your test results are now available',
      'Please take your medication as prescribed',
      'Your next appointment is confirmed',
      'Lab reports have been uploaded to your profile'
    ];

    addNotification({
      id: Date.now(),
      type: 'message',
      title: 'New Message',
      message: messages[Math.floor(Math.random() * messages.length)],
      data: { senderId: 'doctor_123', senderName: 'Dr. Smith' }
    });
  };

  const simulateEmergency = () => {
    addNotification({
      id: Date.now(),
      type: 'emergency',
      title: 'Emergency Consultation Request',
      message: 'Patient requires immediate medical attention',
      priority: 'high',
      data: { patientId: 'patient_456', urgency: 'high' }
    });
  };

  // Auto-simulate activity every 30 seconds
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const actions = [simulateNewUser, simulateAppointment, simulateMessage];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      
      if (randomAction === simulateNewUser) {
        randomAction(Math.random() > 0.5 ? 'doctor' : 'patient');
      } else {
        randomAction();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Real-Time Demo</h2>
        <p className="text-gray-600 mb-6">
          Please log in to test the real-time features. You can simulate different user roles to see how the system handles cross-browser interactions.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Demo Features:</h3>
          <ul className="text-blue-800 space-y-1">
            <li>• Real-time notifications</li>
            <li>• Role-based dashboards</li>
            <li>• Live stats updates</li>
            <li>• Cross-browser patient-doctor interactions</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Connection Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Real-Time Demo Dashboard</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className={`text-sm font-medium ${connected ? 'text-green-600' : 'text-yellow-600'}`}>
              {connected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Doctors</p>
                <p className="text-2xl font-bold">{demoStats.doctors}</p>
              </div>
              <UserPlusIcon className="w-8 h-8 text-blue-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Patients</p>
                <p className="text-2xl font-bold">{demoStats.patients}</p>
              </div>
              <UserPlusIcon className="w-8 h-8 text-green-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Appointments</p>
                <p className="text-2xl font-bold">{demoStats.appointments}</p>
              </div>
              <CalendarDaysIcon className="w-8 h-8 text-purple-200" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Demo Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4">Simulate Real-Time Events</h3>
        <p className="text-gray-600 mb-6">
          Test the notification system and real-time updates by simulating different events. 
          Try opening multiple browser tabs to see cross-browser interactions!
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <button
            onClick={() => simulateNewUser('doctor')}
            className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
          >
            <UserPlusIcon className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-blue-700">Add Doctor</span>
          </button>
          
          <button
            onClick={() => simulateNewUser('patient')}
            className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
          >
            <UserPlusIcon className="w-8 h-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-green-700">Add Patient</span>
          </button>
          
          <button
            onClick={simulateAppointment}
            className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
          >
            <CalendarDaysIcon className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-purple-700">New Appointment</span>
          </button>
          
          <button
            onClick={simulateVideoCall}
            className="flex flex-col items-center p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group"
          >
            <VideoCameraIcon className="w-8 h-8 text-red-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-red-700">Video Call</span>
          </button>
          
          <button
            onClick={simulateMessage}
            className="flex flex-col items-center p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors group"
          >
            <ChatBubbleLeftRightIcon className="w-8 h-8 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-indigo-700">New Message</span>
          </button>
          
          {isDoctor && (
            <button
              onClick={simulateEmergency}
              className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors group"
            >
              <BellIcon className="w-8 h-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-orange-700">Emergency</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
        {simulatedUsers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No activity yet. Try clicking the buttons above to simulate events!
          </p>
        ) : (
          <div className="space-y-3">
            {simulatedUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
              >
                <div className={`p-2 rounded-full ${user.type === 'doctor' ? 'bg-blue-100' : 'bg-green-100'}`}>
                  <UserPlusIcon className={`w-4 h-4 ${user.type === 'doctor' ? 'text-blue-600' : 'text-green-600'}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">Registered as {user.type}</p>
                </div>
                <div className="text-xs text-gray-400">
                  {user.timestamp.toLocaleTimeString()}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
      >
        <h3 className="text-lg font-bold text-blue-900 mb-4">🚀 Testing Cross-Browser Interactions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-semibold mb-2">For Patient Testing:</h4>
            <ul className="space-y-1">
              <li>• Open a new incognito window</li>
              <li>• Register as a patient</li>
              <li>• Book appointments and send messages</li>
              <li>• Watch notifications appear in both windows</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">For Doctor Testing:</h4>
            <ul className="space-y-1">
              <li>• Use another browser or device</li>
              <li>• Register as a doctor</li>
              <li>• Accept patient appointments</li>
              <li>• Initiate video calls and chat sessions</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
          <p className="text-blue-700">
            <strong>💡 Pro Tip:</strong> Open developer tools to see WebSocket connection logs and real-time event handling!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RealTimeDemo;
