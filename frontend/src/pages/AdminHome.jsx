import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  UserPlusIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  BellIcon,
  ArrowRightIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { dummyAdminStats, getDynamicStats, getLiveActivities } from '../data/dummyData';

const AdminHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(getDynamicStats());
  const [liveActivities, setLiveActivities] = useState(getLiveActivities());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setStats(getDynamicStats());
      setLiveActivities(getLiveActivities());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(timer);
  }, []);

  const quickActions = [
    {
      title: 'Manage Doctors',
      description: 'View, verify, and manage doctor accounts',
      icon: <UsersIcon className="w-8 h-8" />,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      onClick: () => navigate('/admin/doctors')
    },
    {
      title: 'Manage Patients',
      description: 'View and manage patient accounts',
      icon: <UserPlusIcon className="w-8 h-8" />,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      onClick: () => navigate('/admin/patients')
    },
    {
      title: 'Analytics Dashboard',
      description: 'View detailed analytics and reports',
      icon: <ChartBarIcon className="w-8 h-8" />,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      onClick: () => navigate('/admin')
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: <CogIcon className="w-8 h-8" />,
      color: 'bg-gray-500',
      hoverColor: 'hover:bg-gray-600',
      onClick: () => navigate('/admin/settings')
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'doctor',
      message: 'Dr. Sarah Wilson completed verification',
      time: '5 minutes ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'patient',
      message: 'New patient registration: Alice Johnson',
      time: '12 minutes ago',
      status: 'info'
    },
    {
      id: 3,
      type: 'appointment',
      message: 'Appointment cancelled by patient',
      time: '18 minutes ago',
      status: 'warning'
    },
    {
      id: 4,
      type: 'payment',
      message: 'Payment processed successfully',
      time: '25 minutes ago',
      status: 'success'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <BellIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome to Admin Panel
              </h1>
              <p className="text-gray-600 text-lg">
                Manage your healthcare platform efficiently
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {currentTime.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">System Status</p>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-green-600">Online</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Doctors</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{dummyAdminStats.totalDoctors}</p>
                <p className="text-sm text-green-600 mt-1">+2 this week</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <UsersIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{dummyAdminStats.totalPatients.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">+{stats.newPatients} today</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <UserPlusIcon className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Appointments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalAppointments}</p>
                <p className="text-sm text-blue-600 mt-1">{stats.completedAppointments} completed</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <CalendarDaysIcon className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ₹{(stats.totalRevenue / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-green-600 mt-1">+12% this month</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <CurrencyDollarIcon className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
                <ShieldCheckIcon className="w-6 h-6 text-gray-400" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    onClick={action.onClick}
                    className={`p-6 rounded-xl border-2 border-transparent hover:border-gray-200 transition-all duration-200 text-left group ${action.hoverColor}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform duration-200`}>
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white transition-colors duration-200">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 group-hover:text-gray-200 transition-colors duration-200">
                          {action.description}
                        </p>
                      </div>
                      <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Activities</h2>
                <BellIcon className="w-6 h-6 text-gray-400" />
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className={`p-4 rounded-lg border ${getStatusColor(activity.status)}`}
                  >
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(activity.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
                View all activities
              </button>
            </div>
          </motion.div>
        </div>

        {/* System Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">System Health</h3>
              <p className="text-sm text-gray-600">All systems operational</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Security</h3>
              <p className="text-sm text-gray-600">All security measures active</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance</h3>
              <p className="text-sm text-gray-600">Optimal performance</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminHome;
