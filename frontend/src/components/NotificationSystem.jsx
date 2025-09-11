import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebSocket } from '../context/WebSocketContext';
import {
  BellIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  UserPlusIcon,
  HeartIcon,
  DocumentTextIcon,
  BeakerIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const NotificationSystem = () => {
  const { notifications, removeNotification, clearAllNotifications, connected } = useWebSocket();
  const [showAll, setShowAll] = useState(false);
  const [toastNotifications, setToastNotifications] = useState([]);

  // Show toast notifications for high priority items
  useEffect(() => {
    const highPriorityNotification = notifications.find(n => n.priority === 'high');
    if (highPriorityNotification && !toastNotifications.find(t => t.id === highPriorityNotification.id)) {
      setToastNotifications(prev => [highPriorityNotification, ...prev].slice(0, 3));
      
      // Auto-remove after 10 seconds for high priority
      setTimeout(() => {
        setToastNotifications(prev => prev.filter(t => t.id !== highPriorityNotification.id));
      }, 10000);
    }
  }, [notifications, toastNotifications]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment':
        return CalendarDaysIcon;
      case 'video-call':
        return VideoCameraIcon;
      case 'message':
        return ChatBubbleLeftRightIcon;
      case 'registration':
        return UserPlusIcon;
      case 'emergency':
        return ExclamationCircleIcon;
      case 'availability':
        return HeartIcon;
      case 'prescription':
        return ClipboardDocumentListIcon;
      case 'test-result':
        return BeakerIcon;
      case 'health-tip':
        return LightBulbIcon;
      case 'system':
        return ShieldCheckIcon;
      case 'medical-report':
        return DocumentTextIcon;
      default:
        return BellIcon;
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'from-red-500 to-red-600';
    
    switch (type) {
      case 'appointment':
        return 'from-blue-500 to-blue-600';
      case 'video-call':
        return 'from-green-500 to-green-600';
      case 'message':
        return 'from-purple-500 to-purple-600';
      case 'registration':
        return 'from-indigo-500 to-indigo-600';
      case 'emergency':
        return 'from-red-500 to-red-600';
      case 'availability':
        return 'from-green-500 to-green-600';
      case 'prescription':
        return 'from-orange-500 to-orange-600';
      case 'test-result':
        return 'from-cyan-500 to-cyan-600';
      case 'health-tip':
        return 'from-teal-500 to-teal-600';
      case 'system':
        return 'from-slate-500 to-slate-600';
      case 'medical-report':
        return 'from-pink-500 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const removeToastNotification = (id) => {
    setToastNotifications(prev => prev.filter(t => t.id !== id));
  };

  return (
    <>
      {/* Toast Notifications - High Priority */}
      <div className="fixed top-4 right-4 z-50 space-y-4">
        <AnimatePresence>
          {toastNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const colorClass = getNotificationColor(notification.type, notification.priority);
            
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 300, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 300, scale: 0.8 }}
                className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-sm w-full"
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClass} flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    {notification.priority === 'high' && (
                      <div className="mt-3 flex space-x-2">
                        {notification.type === 'video-call' && (
                          <>
                            <button className="bg-green-500 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-green-600">
                              Accept
                            </button>
                            <button className="bg-red-500 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-red-600">
                              Decline
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeToastNotification(notification.id)}
                    className="p-1 hover:bg-gray-100 rounded-md flex-shrink-0"
                  >
                    <XMarkIcon className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Notification Panel */}
      <div className="relative">
        <button
          onClick={() => setShowAll(!showAll)}
          className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        >
          <BellIcon className="w-6 h-6" />
          {notifications.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-medium"
            >
              {notifications.length > 9 ? '9+' : notifications.length}
            </motion.span>
          )}
          {!connected && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full"></div>
          )}
        </button>

        {showAll && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-40"
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Notifications
                </h3>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="flex items-center mt-2 text-sm">
                <div className={`w-2 h-2 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className={connected ? 'text-green-600' : 'text-yellow-600'}>
                  {connected ? 'Connected' : 'Connecting...'}
                </span>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <BellIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type);
                    const colorClass = getNotificationColor(notification.type, notification.priority);
                    
                    return (
                      <div
                        key={notification.id}
                        className="p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClass} flex-shrink-0`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900">
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                                {notification.priority === 'high' && (
                                  <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                    High Priority
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => removeNotification(notification.id)}
                                className="ml-2 p-1 hover:bg-gray-200 rounded-md flex-shrink-0"
                              >
                                <XMarkIcon className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default NotificationSystem;
