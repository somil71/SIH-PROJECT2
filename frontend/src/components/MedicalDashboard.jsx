import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const MedicalDashboard = ({ userRole = 'patient' }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const healthMetrics = [
    { name: 'Heart Rate', value: '72 BPM', status: 'normal', icon: HeartIcon, color: 'text-red-500' },
    { name: 'Blood Pressure', value: '120/80', status: 'normal', icon: ChartBarIcon, color: 'text-blue-500' },
    { name: 'Weight', value: '70 kg', status: 'stable', icon: UserGroupIcon, color: 'text-green-500' },
    { name: 'Steps Today', value: '8,432', status: 'good', icon: CalendarDaysIcon, color: 'text-purple-500' }
  ];

  const recentActivities = [
    { id: 1, type: 'appointment', message: 'Consultation with Dr. Smith', time: '2 hours ago', status: 'completed' },
    { id: 2, type: 'medication', message: 'Medication reminder', time: '4 hours ago', status: 'pending' },
    { id: 3, type: 'test', message: 'Lab results available', time: '1 day ago', status: 'completed' },
    { id: 4, type: 'prescription', message: 'New prescription added', time: '2 days ago', status: 'active' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Health Overview</h2>
        <div className="flex space-x-2">
          {['day', 'week', 'month'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {healthMetrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
              <span className={`text-xs px-2 py-1 rounded-full ${
                metric.status === 'normal' ? 'bg-green-100 text-green-800' :
                metric.status === 'stable' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {metric.status}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
            <div className="text-sm text-gray-600">{metric.name}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'completed' ? 'bg-green-500' :
                  activity.status === 'pending' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{activity.message}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Trends</h3>
          <div className="bg-gray-50 rounded-lg p-4 h-48 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <ChartBarIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Health trend chart would appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalDashboard;