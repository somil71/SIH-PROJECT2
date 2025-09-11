import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const HealthDashboardDemo = () => {
  const [vitals, setVitals] = useState({
    heartRate: 72,
    bloodPressure: { systolic: 120, diastolic: 80 },
    temperature: 98.6,
    oxygenSaturation: 98
  });
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setVitals(prev => ({
        heartRate: Math.max(60, Math.min(100, prev.heartRate + (Math.random() - 0.5) * 4)),
        bloodPressure: {
          systolic: Math.max(110, Math.min(140, prev.bloodPressure.systolic + (Math.random() - 0.5) * 6)),
          diastolic: Math.max(70, Math.min(90, prev.bloodPressure.diastolic + (Math.random() - 0.5) * 4))
        },
        temperature: Math.max(97, Math.min(100, prev.temperature + (Math.random() - 0.5) * 0.4)),
        oxygenSaturation: Math.max(95, Math.min(100, prev.oxygenSaturation + (Math.random() - 0.5) * 2))
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Live Health Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Real-time vital sign monitoring and health analytics
          </p>
          
          <motion.button
            onClick={() => setIsLive(!isLive)}
            className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
              isLive 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25' 
                : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLive ? 'Stop Live Demo' : 'Start Live Demo'}
            <span className={`ml-2 w-2 h-2 rounded-full inline-block ${
              isLive ? 'bg-white animate-pulse' : 'bg-white/70'
            }`}></span>
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
            animate={isLive ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: vitals.heartRate / 60, repeat: Infinity }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-red-100">
                  <HeartIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Heart Rate</h3>
                  <p className="text-sm text-gray-500">Beats per minute</p>
                </div>
              </div>
              {isLive && (
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 60 / vitals.heartRate, repeat: Infinity }}
                  className="w-3 h-3 bg-red-500 rounded-full"
                />
              )}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {Math.round(vitals.heartRate)} BPM
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"
                style={{ width: `${(vitals.heartRate / 120) * 100}%` }}
                animate={{ width: `${(vitals.heartRate / 120) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>

          <motion.div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-blue-100">
                <ChartBarIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Blood Pressure</h3>
                <p className="text-sm text-gray-500">mmHg</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              {Math.round(vitals.bloodPressure.systolic)}/{Math.round(vitals.bloodPressure.diastolic)}
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">Systolic</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                    animate={{ width: `${(vitals.bloodPressure.systolic / 160) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">Diastolic</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                    animate={{ width: `${(vitals.bloodPressure.diastolic / 100) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-orange-100">
                <span className="text-xl">🌡️</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Temperature</h3>
                <p className="text-sm text-gray-500">Degrees Fahrenheit</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              {vitals.temperature.toFixed(1)}°F
            </div>
            <div className="relative h-16 bg-gradient-to-t from-blue-200 via-green-200 to-red-200 rounded-lg overflow-hidden">
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 via-green-500 to-red-500 opacity-60"
                animate={{ height: `${((vitals.temperature - 96) / 6) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          <motion.div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-green-100">
                <span className="text-xl">🫁</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Blood Oxygen</h3>
                <p className="text-sm text-gray-500">SpO2 percentage</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {Math.round(vitals.oxygenSaturation)}%
            </div>
            <div className="relative w-24 h-24 mx-auto">
              <svg className="transform -rotate-90 w-24 h-24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                  fill="transparent"
                  className="w-full h-full"
                />
                <motion.circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="url(#oxygen-gradient)"
                  strokeWidth="2"
                  fill="transparent"
                  strokeDasharray={`${vitals.oxygenSaturation * 0.628} ${(100 - vitals.oxygenSaturation) * 0.628}`}
                  className="w-full h-full"
                  animate={{ strokeDasharray: `${vitals.oxygenSaturation * 0.628} ${(100 - vitals.oxygenSaturation) * 0.628}` }}
                  transition={{ duration: 0.5 }}
                />
                <defs>
                  <linearGradient id="oxygen-gradient">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Health Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "✅", text: "All vitals within normal range", color: "text-green-600" },
              { icon: "💡", text: "Stay hydrated for optimal performance", color: "text-blue-600" },
              { icon: "🏃", text: "Consider 30min cardio exercise", color: "text-purple-600" }
            ].map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.2 }}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-lg">{insight.icon}</span>
                <span className={`text-sm font-medium ${insight.color}`}>{insight.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HealthDashboardDemo;