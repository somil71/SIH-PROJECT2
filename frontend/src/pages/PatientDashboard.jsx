import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  DocumentIcon,
  PlusIcon,
  BellIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { getDynamicStats, dummyAppointments, dummyDoctors } from '../data/dummyData';
import MedicalDashboard from '../components/MedicalDashboard';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(getDynamicStats());
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Simulate fetching patient-specific data
    const patientAppointments = dummyAppointments.slice(0, 3).map(apt => ({
      ...apt,
      doctor: dummyDoctors.find(doc => doc._id === apt.doctorId) || dummyDoctors[0]
    }));
    
    setUpcomingAppointments(patientAppointments);
    setRecentActivities([
      { id: 1, type: 'appointment', message: 'Consultation with Dr. Smith completed', time: '2 hours ago' },
      { id: 2, type: 'prescription', message: 'New prescription added to your records', time: '1 day ago' },
      { id: 3, type: 'reminder', message: 'Upcoming checkup reminder', time: '2 days ago' },
    ]);
  }, []);

  const quickActions = [
    {
      title: 'Book Appointment',
      description: 'Schedule a consultation with a doctor',
      icon: CalendarDaysIcon,
      color: 'from-blue-500 to-blue-600',
      onClick: () => navigate('/doctors')
    },
    {
      title: 'Video Consultation',
      description: 'Start or join a video call',
      icon: VideoCameraIcon,
      color: 'from-green-500 to-green-600',
      onClick: () => navigate('/patient/video-calls')
    },
    {
      title: 'Chat with Doctor',
      description: 'Send a message to your doctor',
      icon: ChatBubbleLeftRightIcon,
      color: 'from-purple-500 to-purple-600',
      onClick: () => navigate('/patient/chat')
    },
    {
      title: 'Health Records',
      description: 'View your medical history',
      icon: DocumentIcon,
      color: 'from-orange-500 to-orange-600',
      onClick: () => navigate('/patient/records')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || 'Patient'}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your health journey from your personalized dashboard
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all">
                <BellIcon className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Upcoming Appointments', value: upcomingAppointments.length, icon: CalendarDaysIcon, color: 'bg-blue-500' },
            { title: 'Total Consultations', value: '24', icon: UserGroupIcon, color: 'bg-green-500' },
            { title: 'Health Score', value: '85%', icon: HeartIcon, color: 'bg-red-500' },
            { title: 'Active Prescriptions', value: '3', icon: DocumentIcon, color: 'bg-purple-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100"
                  onClick={action.onClick}
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${action.color}`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Appointments */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 h-fit border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Appointments</h2>
              <button
                onClick={() => navigate('/patient/appointments')}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <div key={appointment._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">
                        Dr. {appointment.doctor?.user?.name || 'Unknown'}
                      </h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {appointment.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{appointment.doctor?.specialization}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <CalendarDaysIcon className="w-4 h-4 mr-1" />
                      {new Date(appointment.appointmentDate).toLocaleDateString()}
                      <ClockIcon className="w-4 h-4 ml-3 mr-1" />
                      {appointment.appointmentTime}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CalendarDaysIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No upcoming appointments</p>
                  <button
                    onClick={() => navigate('/doctors')}
                    className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Book your first appointment
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Medical Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <MedicalDashboard userRole="patient" />
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{activity.message}</p>
                  <p className="text-gray-500 text-sm">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientDashboard;
