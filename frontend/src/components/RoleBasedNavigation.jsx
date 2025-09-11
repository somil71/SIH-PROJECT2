import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  CogIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  PlusIcon,
  ChartBarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const RoleBasedNavigation = () => {
  const { user, isAuthenticated, isAdmin, isDoctor } = useAuth();

  // Admin Navigation
  const adminNavItems = [
    { name: 'Dashboard', href: '/admin', icon: ChartBarIcon },
    { name: 'Manage Doctors', href: '/admin/doctors', icon: UserGroupIcon },
    { name: 'Manage Patients', href: '/admin/patients', icon: HeartIcon },
    { name: 'Appointments', href: '/admin/appointments', icon: CalendarDaysIcon },
    { name: 'System Settings', href: '/admin/settings', icon: CogIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  ];

  // Doctor Navigation
  const doctorNavItems = [
    { name: 'Dashboard', href: '/doctor/dashboard', icon: HomeIcon },
    { name: 'My Patients', href: '/doctor/patients', icon: HeartIcon },
    { name: 'Appointments', href: '/doctor/appointments', icon: CalendarDaysIcon },
    { name: 'Video Consultations', href: '/doctor/video-calls', icon: VideoCameraIcon },
    { name: 'Chat Messages', href: '/doctor/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Patient Records', href: '/doctor/records', icon: ClipboardDocumentListIcon },
    { name: 'Profile', href: '/doctor/profile', icon: UserIcon },
  ];

  // Patient Navigation
  const patientNavItems = [
    { name: 'Find Doctors', href: '/doctors', icon: UserGroupIcon },
    { name: 'My Appointments', href: '/patient/appointments', icon: CalendarDaysIcon },
    { name: 'Health Records', href: '/patient/records', icon: ClipboardDocumentListIcon },
    { name: 'Chat with Doctor', href: '/patient/chat', icon: ChatBubbleLeftRightIcon },
    { name: 'Video Consultations', href: '/patient/video-calls', icon: VideoCameraIcon },
    { name: 'My Profile', href: '/patient/profile', icon: UserIcon },
  ];

  // Public Navigation
  const publicNavItems = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Find Doctors', href: '/doctors', icon: UserGroupIcon },
    { name: 'About Us', href: '/about', icon: ShieldCheckIcon },
    { name: 'Contact', href: '/contact', icon: ChatBubbleLeftRightIcon },
  ];

  const getNavigationItems = () => {
    if (!isAuthenticated) return publicNavItems;
    if (isAdmin) return adminNavItems;
    if (isDoctor) return doctorNavItems;
    return patientNavItems;
  };

  const getRoleLabel = () => {
    if (isAdmin) return 'Admin Dashboard';
    if (isDoctor) return 'Doctor Portal';
    return 'Patient Portal';
  };

  const getRoleColor = () => {
    if (isAdmin) return 'from-red-500 to-pink-600';
    if (isDoctor) return 'from-blue-500 to-indigo-600';
    return 'from-green-500 to-emerald-600';
  };

  return {
    navigationItems: getNavigationItems(),
    roleLabel: getRoleLabel(),
    roleColor: getRoleColor(),
    user,
    isAuthenticated,
    isAdmin,
    isDoctor
  };
};

export default RoleBasedNavigation;
