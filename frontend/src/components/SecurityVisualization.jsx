import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  LockClosedIcon,
  KeyIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const SecurityVisualization = () => {
  const [securityLevel, setSecurityLevel] = useState(95);
  const [threats, setThreats] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setThreats(prev => {
        const newThreats = [...prev];
        if (Math.random() > 0.7 && newThreats.length < 5) {
          newThreats.push({
            id: Date.now(),
            type: ['Malware', 'Phishing', 'Data Breach', 'Unauthorized Access'][Math.floor(Math.random() * 4)],
            severity: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
            status: 'blocked'
          });
        }
        return newThreats.slice(-5);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const securityFeatures = [
    {
      name: 'End-to-End Encryption',
      description: 'All data is encrypted using AES-256 encryption',
      icon: LockClosedIcon,
      status: 'active',
      color: 'text-green-600'
    },
    {
      name: 'HIPAA Compliance',
      description: 'Fully compliant with healthcare data protection standards',
      icon: ShieldCheckIcon,
      status: 'active',
      color: 'text-blue-600'
    },
    {
      name: 'Multi-Factor Authentication',
      description: 'Additional security layer for all user accounts',
      icon: KeyIcon,
      status: 'active',
      color: 'text-purple-600'
    },
    {
      name: 'Real-time Monitoring',
      description: 'Continuous security monitoring and threat detection',
      icon: EyeIcon,
      status: 'active',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Security & Privacy Dashboard
          </h1>
          <p className="text-xl text-gray-300">
            Advanced security visualization and threat monitoring
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Security Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-white">Overall Security</h4>
                  <ShieldCheckIcon className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {securityLevel}%
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${securityLevel}%` }}
                    transition={{ duration: 2 }}
                  />
                </div>
              </div>

              <div className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-white">Threats Blocked</h4>
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
                </div>
                <div className="text-3xl font-bold text-red-400 mb-2">
                  {threats.length}
                </div>
                <div className="text-sm text-gray-400">Last 24 hours</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Security Features</h3>
            <div className="space-y-4">
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <feature.icon className={`w-5 h-5 mt-1 ${feature.color}`} />
                  <div>
                    <h4 className="text-white font-medium">{feature.name}</h4>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                    <div className="flex items-center mt-1">
                      <CheckCircleIcon className="w-4 h-4 text-green-400 mr-1" />
                      <span className="text-green-400 text-xs">Active</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Threat Detection</h3>
            <button
              onClick={() => setIsScanning(!isScanning)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isScanning
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isScanning ? 'Stop Scan' : 'Start Scan'}
            </button>
          </div>

          <div className="space-y-3">
            {threats.length > 0 ? (
              threats.map((threat) => (
                <motion.div
                  key={threat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-red-500/20"
                >
                  <div className="flex items-center space-x-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                    <div>
                      <h4 className="text-white font-medium">{threat.type}</h4>
                      <p className="text-gray-400 text-sm">Severity: {threat.severity}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400 text-sm font-medium">BLOCKED</span>
                    <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <ShieldCheckIcon className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                <p>No threats detected</p>
                <p className="text-sm">System is secure</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              title: 'Data Encryption',
              description: 'All patient data is encrypted using industry-standard AES-256 encryption',
              icon: '🔐',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              title: 'Access Control',
              description: 'Role-based access control ensures only authorized personnel can view sensitive data',
              icon: '👤',
              color: 'from-purple-500 to-pink-500'
            },
            {
              title: 'Audit Logging',
              description: 'Comprehensive audit logs track all data access and modifications',
              icon: '📊',
              color: 'from-green-500 to-teal-500'
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-4`}>
                {feature.icon}
              </div>
              <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SecurityVisualization;