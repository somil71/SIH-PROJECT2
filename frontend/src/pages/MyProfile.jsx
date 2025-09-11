import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../utils/api';
import {
  UserIcon,
  CalendarDaysIcon,
  ClockIcon,
  HeartIcon,
  DocumentTextIcon,
  CameraIcon,
  PencilSquareIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  BellIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { dummyPatients, dummyAppointments } from '../data/dummyData';

const MyProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  // Get dummy data for current patient
  const currentPatient = dummyPatients.find(p => p.email === user?.email) || dummyPatients[0];
  const patientAppointments = dummyAppointments.filter(apt => apt.patientId === currentPatient?.id);
  const upcomingAppointments = patientAppointments.filter(apt => new Date(apt.date) > new Date()).slice(0, 3);
  const recentAppointments = patientAppointments.filter(apt => new Date(apt.date) <= new Date()).slice(0, 3);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
      loadNotifications();
    }
  }, [isAuthenticated]);

  const loadNotifications = () => {
    // Mock notifications based on appointments and health data
    const mockNotifications = [
      {
        id: 1,
        type: 'appointment',
        title: 'Upcoming Appointment',
        message: 'You have an appointment with Dr. Sarah Wilson tomorrow at 10:00 AM',
        time: '2 hours ago',
        read: false,
        icon: CalendarDaysIcon
      },
      {
        id: 2,
        type: 'health',
        title: 'Health Reminder',
        message: 'Time to take your evening medication',
        time: '4 hours ago',
        read: false,
        icon: HeartIcon
      },
      {
        id: 3,
        type: 'report',
        title: 'Lab Results Ready',
        message: 'Your recent blood work results are now available',
        time: '1 day ago',
        read: true,
        icon: DocumentTextIcon
      }
    ];
    setNotifications(mockNotifications);
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getProfile();
      setProfile(data.user);
      setFormData({
        name: data.user.name || '',
        phone: data.user.phone || '',
        gender: data.user.gender || '',
        dateOfBirth: data.user.dateOfBirth ? data.user.dateOfBirth.split('T')[0] : '',
        address: {
          street: data.user.address?.street || '',
          city: data.user.address?.city || '',
          state: data.user.address?.state || '',
          zipCode: data.user.address?.zipCode || '',
          country: data.user.address?.country || ''
        }
      });
    } catch (error) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userAPI.updateProfile(formData);
      setProfile(prev => ({ ...prev, ...formData }));
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile: ' + error.message);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name || '',
      phone: profile.phone || '',
      gender: profile.gender || '',
      dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
      address: {
        street: profile.address?.street || '',
        city: profile.address?.city || '',
        state: profile.address?.state || '',
        zipCode: profile.address?.zipCode || '',
        country: profile.address?.country || ''
      }
    });
    setEditing(false);
  };

  // Reports upload/list
  const [reports, setReports] = useState([])
  const [uploading, setUploading] = useState(false)
  const loadReports = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:5000/api/reports/mine', { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok){ const data = await res.json(); setReports(data.reports) }
    } catch {}
  }
  React.useEffect(()=>{ if (isAuthenticated) loadReports() }, [isAuthenticated])

  const uploadReport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('http://localhost:5000/api/reports/upload', { method:'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, body: form })
    setUploading(false)
    if (res.ok){ await loadReports() }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view your profile.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProfile}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Health Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Appointments</p>
                    <p className="text-2xl font-bold text-blue-900">{patientAppointments.length}</p>
                    <p className="text-blue-600 text-xs">{upcomingAppointments.length} upcoming</p>
                  </div>
                  <CalendarDaysIcon className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Health Score</p>
                    <p className="text-2xl font-bold text-green-900">{currentPatient?.healthScore || 85}/100</p>
                    <p className="text-green-600 text-xs">Good condition</p>
                  </div>
                  <HeartIcon className="h-8 w-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Medical Reports</p>
                    <p className="text-2xl font-bold text-purple-900">{reports.length}</p>
                    <p className="text-purple-600 text-xs">documents stored</p>
                  </div>
                  <DocumentTextIcon className="h-8 w-8 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => navigate('/doctors')}
                  className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                >
                  <UserIcon className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-blue-900">Find Doctor</span>
                </button>
                
                <button
                  onClick={() => navigate('/appointments')}
                  className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
                >
                  <CalendarDaysIcon className="h-8 w-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-green-900">Book Appointment</span>
                </button>
                
                <button
                  onClick={() => navigate('/chat')}
                  className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
                >
                  <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-purple-900">Consult Online</span>
                </button>
                
                <label className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors group cursor-pointer">
                  <DocumentTextIcon className="h-8 w-8 text-orange-600 mb-2" />
                  <span className="text-sm font-medium text-orange-900">Upload Report</span>
                  <input type="file" className="hidden" onChange={uploadReport} />
                </label>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Appointments</h3>
                {recentAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {recentAppointments.map((appointment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{appointment.doctorName}</p>
                            <p className="text-sm text-gray-600">{appointment.specialization}</p>
                            <p className="text-xs text-gray-500">{new Date(appointment.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          appointment.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : appointment.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarDaysIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No recent appointments</p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingAppointments.map((appointment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <ClockIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{appointment.doctorName}</p>
                            <p className="text-sm text-gray-600">{appointment.specialization}</p>
                            <p className="text-xs text-gray-500">{new Date(appointment.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors">
                          Join
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ClockIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No upcoming appointments</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-semibold text-gray-900">Personal Information</h3>
              <button
                onClick={() => setEditing(!editing)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PencilSquareIcon className="h-4 w-4" />
                <span>{editing ? 'Cancel Edit' : 'Edit Profile'}</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={profile?.email || ''}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed pr-10"
                      />
                      <ShieldCheckIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed for security reasons
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="border-t border-gray-200 pt-8">
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Address Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                      placeholder="New York"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                      placeholder="NY"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                      placeholder="10001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                      placeholder="United States"
                    />
                  </div>
                </div>
              </div>

              {editing && (
                <div className="flex gap-4 pt-8 border-t border-gray-200">
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        );

      case 'health':
        return (
          <div className="space-y-6">
            {/* Health Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <HeartIcon className="h-5 w-5 mr-2 text-red-500" />
                Health Summary
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-blue-600">{currentPatient?.vitals?.bloodPressure || 'N/A'}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">Blood Pressure</p>
                  <p className="text-xs text-gray-500">mmHg</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-green-600">{currentPatient?.vitals?.heartRate || 'N/A'}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">Heart Rate</p>
                  <p className="text-xs text-gray-500">bpm</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-yellow-600">{currentPatient?.vitals?.weight || 'N/A'}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">Weight</p>
                  <p className="text-xs text-gray-500">kg</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-purple-600">{currentPatient?.vitals?.height || 'N/A'}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">Height</p>
                  <p className="text-xs text-gray-500">cm</p>
                </div>
              </div>
            </div>

            {/* Medical History */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h3>
                {currentPatient?.medicalHistory?.length > 0 ? (
                  <div className="space-y-3">
                    {currentPatient.medicalHistory.map((condition, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{condition.condition}</p>
                          <p className="text-sm text-gray-600">Diagnosed: {condition.diagnosedDate}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          condition.status === 'Active' ? 'bg-red-100 text-red-800' :
                          condition.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {condition.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <DocumentTextIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No medical history recorded</p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Medications</h3>
                {currentPatient?.medications?.length > 0 ? (
                  <div className="space-y-3">
                    {currentPatient.medications.map((medication, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{medication.name}</p>
                          <p className="text-sm text-gray-600">{medication.dosage}</p>
                          <p className="text-xs text-gray-500">Prescribed: {medication.prescribedDate}</p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {medication.frequency}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <HeartIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No current medications</p>
                  </div>
                )}
              </div>
            </div>

            {/* Allergies */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-red-500" />
                Allergies & Alerts
              </h3>
              {currentPatient?.allergies?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentPatient.allergies.map((allergy, index) => (
                    <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                        <span className="font-medium text-red-900">{allergy.allergen}</span>
                      </div>
                      <p className="text-sm text-red-700 mt-1">{allergy.reaction}</p>
                      <p className="text-xs text-red-600 mt-1">Severity: {allergy.severity}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircleIcon className="h-12 w-12 mx-auto mb-2 text-green-300" />
                  <p>No known allergies</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-500" />
                Medical Reports
              </h3>
              <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                <CameraIcon className="h-4 w-4" />
                <span>{uploading ? 'Uploading...' : 'Upload Report'}</span>
                <input type="file" className="hidden" onChange={uploadReport} disabled={uploading} />
              </label>
            </div>
            
            {reports.length === 0 ? (
              <div className="text-center py-12">
                <DocumentTextIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No reports uploaded yet</h4>
                <p className="text-gray-600 mb-4">Upload your medical reports to keep them organized and easily accessible.</p>
                <label className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                  <CameraIcon className="h-5 w-5" />
                  <span>Upload Your First Report</span>
                  <input type="file" className="hidden" onChange={uploadReport} disabled={uploading} />
                </label>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.map(report => (
                  <div key={report._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                        <div>
                          <h4 className="font-medium text-gray-900 truncate">{report.originalName}</h4>
                          <p className="text-sm text-gray-600">{Math.round(report.size/1024)} KB</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      Uploaded: {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex space-x-2">
                      <a 
                        href={`http://localhost:5000${report.url}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors text-center"
                      >
                        View
                      </a>
                      <button className="px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors">
                        Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {currentPatient?.name || profile?.name || 'Patient'}!
              </h1>
              <p className="text-lg text-gray-600">
                Manage your health journey with our comprehensive dashboard
              </p>
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <button className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative">
                <BellIcon className="h-6 w-6 text-gray-600" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <img
                src={currentPatient?.profilePicture || profile?.profilePicture || '/api/placeholder/150/150'}
                alt={currentPatient?.name || profile?.name || 'Profile'}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                <CameraIcon className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {currentPatient?.name || profile?.name || 'Patient Name'}
              </h2>
              <p className="text-gray-600 mb-3">{currentPatient?.email || profile?.email}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  profile?.isEmailVerified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  <CheckCircleIcon className="h-4 w-4 inline mr-1" />
                  {profile?.isEmailVerified ? 'Verified Account' : 'Unverified'}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Patient ID: {currentPatient?.id || 'P001'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{patientAppointments.length}</p>
                  <p className="text-sm text-gray-600">Total Visits</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{currentPatient?.healthScore || 85}</p>
                  <p className="text-sm text-gray-600">Health Score</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{reports.length}</p>
                  <p className="text-sm text-gray-600">Reports</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{upcomingAppointments.length}</p>
                  <p className="text-sm text-gray-600">Upcoming</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-8">
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'profile', name: 'Profile', icon: UserIcon },
              { id: 'health', name: 'Health Data', icon: HeartIcon },
              { id: 'reports', name: 'Reports', icon: DocumentTextIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default MyProfile;
