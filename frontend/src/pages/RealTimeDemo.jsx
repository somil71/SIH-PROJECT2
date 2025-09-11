import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWebSocket } from '../context/WebSocketContext';

const RealTimeDemo = () => {
  const { connected, liveStats, notifications } = useWebSocket();
  const [demoData, setDemoData] = useState({
    heartRate: 72,
    bloodPressure: '120/80',
    temperature: 98.6,
    oxygenSaturation: 98
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDemoData(prev => ({
        heartRate: Math.max(60, Math.min(100, prev.heartRate + (Math.random() - 0.5) * 4)),
        bloodPressure: `${Math.max(110, Math.min(140, 120 + (Math.random() - 0.5) * 10))}/${Math.max(70, Math.min(90, 80 + (Math.random() - 0.5) * 6))}`,
        temperature: Math.max(97, Math.min(100, prev.temperature + (Math.random() - 0.5) * 0.4)),
        oxygenSaturation: Math.max(95, Math.min(100, prev.oxygenSaturation + (Math.random() - 0.5) * 2))
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Real-Time Healthcare Demo
          </h1>
          <p className="text-xl text-gray-600">
            Experience live health monitoring and real-time data
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Heart Rate</h3>
            <div className="text-3xl font-bold text-red-600">
              {Math.round(demoData.heartRate)} BPM
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <motion.div
                className="h-2 bg-red-500 rounded-full"
                style={{ width: `${(demoData.heartRate / 120) * 100}%` }}
                animate={{ width: `${(demoData.heartRate / 120) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Blood Pressure</h3>
            <div className="text-3xl font-bold text-blue-600">
              {demoData.bloodPressure}
            </div>
            <div className="text-sm text-gray-500 mt-1">mmHg</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Temperature</h3>
            <div className="text-3xl font-bold text-orange-600">
              {demoData.temperature.toFixed(1)}°F
            </div>
            <div className="text-sm text-gray-500 mt-1">Body Temperature</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Oxygen</h3>
            <div className="text-3xl font-bold text-green-600">
              {Math.round(demoData.oxygenSaturation)}%
            </div>
            <div className="text-sm text-gray-500 mt-1">SpO2</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Connection Status</h3>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className={connected ? 'text-green-600' : 'text-yellow-600'}>
                {connected ? 'Connected to WebSocket' : 'Connecting...'}
              </span>
            </div>
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Live Stats</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Total Doctors: {liveStats.totalDoctors}</div>
                <div>Total Patients: {liveStats.totalPatients}</div>
                <div>Total Appointments: {liveStats.totalAppointments}</div>
                <div>Active Consultations: {liveStats.activeConsultations}</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h3>
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notification) => (
                <div key={notification.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900">{notification.title}</div>
                  <div className="text-sm text-gray-600">{notification.message}</div>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="text-gray-500 text-center py-4">
                  No notifications yet
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeDemo;
