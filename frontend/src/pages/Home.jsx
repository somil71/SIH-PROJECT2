import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text3D, OrbitControls, Sphere, Box, Torus, useAnimations, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { doctorAPI } from '../utils/api';
import {
  PlayIcon,
  StarIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  HeartIcon,
  ShieldCheckIcon,
  ClockIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  PhoneIcon,
  SparklesIcon,
  CubeIcon,
  GlobeAltIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import groupProfile from '../assets/assets_frontend/group_profiles.png';
import arrowIcon from '../assets/assets_frontend/arrow_icon.svg';
import headerImg from '../assets/assets_frontend/header_img.png';
import appointmentImg from '../assets/assets_frontend/appointment_img.png';
import { dummyDoctors, getDynamicStats, getLiveActivities, dummyTestimonials } from '../data/dummyData';

// Three.js Animated Components
const FloatingMedicalIcon = ({ position, color = '#3B82F6', scale = 1, rotationSpeed = 0.01 }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.02;
    }
  });
  
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        position={position}
        scale={hovered ? scale * 1.2 : scale}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial 
          color={hovered ? '#60A5FA' : color} 
          roughness={0.3}
          metalness={0.4}
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </mesh>
    </Float>
  );
};

const HeartBeat = ({ position }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 1;
      meshRef.current.scale.setScalar(pulse);
      meshRef.current.rotation.y += 0.02;
    }
  });
  
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color="#EF4444" 
          emissive="#DC2626"
          emissiveIntensity={0.4}
        />
      </mesh>
    </Float>
  );
};

const DNAHelix = ({ position }) => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });
  
  return (
    <group ref={groupRef} position={position}>
      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.3}>
        <Torus args={[0.4, 0.1, 8, 16]} rotation={[Math.PI / 4, 0, 0]}>
          <meshStandardMaterial color="#10B981" emissive="#059669" emissiveIntensity={0.3} />
        </Torus>
        <Torus args={[0.4, 0.1, 8, 16]} rotation={[-Math.PI / 4, 0, 0]}>
          <meshStandardMaterial color="#3B82F6" emissive="#2563EB" emissiveIntensity={0.3} />
        </Torus>
      </Float>
    </group>
  );
};

const InteractiveScene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3B82F6" />
      
      <FloatingMedicalIcon position={[2, 1, 0]} color="#3B82F6" scale={0.8} />
      <FloatingMedicalIcon position={[-2, 0.5, 1]} color="#10B981" scale={0.6} rotationSpeed={0.015} />
      <FloatingMedicalIcon position={[1, -1, -1]} color="#8B5CF6" scale={0.7} rotationSpeed={-0.01} />
      
      <HeartBeat position={[0, 2, 0]} />
      <DNAHelix position={[-1, -0.5, 2]} />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </>
  );
};

// Real-time Health Dashboard Demo Component
const HealthDashboardDemo = () => {
  const [vitals, setVitals] = useState({
    heartRate: 72,
    bloodPressure: { systolic: 120, diastolic: 80 },
    oxygenSaturation: 98,
    temperature: 98.6
  });
  const [isLive, setIsLive] = useState(false);
  const [heartbeatData, setHeartbeatData] = useState([]);

  // Simulate real-time vital signs
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setVitals(prev => ({
        heartRate: Math.max(60, Math.min(100, prev.heartRate + (Math.random() - 0.5) * 4)),
        bloodPressure: {
          systolic: Math.max(110, Math.min(140, prev.bloodPressure.systolic + (Math.random() - 0.5) * 6)),
          diastolic: Math.max(70, Math.min(90, prev.bloodPressure.diastolic + (Math.random() - 0.5) * 4))
        },
        oxygenSaturation: Math.max(95, Math.min(100, prev.oxygenSaturation + (Math.random() - 0.5) * 2)),
        temperature: Math.max(97, Math.min(100, prev.temperature + (Math.random() - 0.5) * 0.4))
      }));
      
      // Update heartbeat visualization data
      setHeartbeatData(prev => {
        const newData = [...prev, Math.sin(Date.now() / 100) * 30 + 50];
        return newData.slice(-50); // Keep last 50 data points
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isLive]);

  const getVitalStatus = (vital, value) => {
    const ranges = {
      heartRate: { normal: [60, 100], warning: [50, 110] },
      systolic: { normal: [90, 120], warning: [80, 140] },
      diastolic: { normal: [60, 80], warning: [50, 90] },
      oxygenSaturation: { normal: [95, 100], warning: [90, 100] },
      temperature: { normal: [97, 99], warning: [96, 100] }
    };
    
    const range = ranges[vital];
    if (!range) return 'normal';
    
    if (value >= range.normal[0] && value <= range.normal[1]) return 'normal';
    if (value >= range.warning[0] && value <= range.warning[1]) return 'warning';
    return 'critical';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'warning': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Real-time <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">Health Monitoring</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Experience live vital sign monitoring with our advanced IoT integration
          </p>
          
          {/* Live Demo Toggle */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vital Signs Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Heart Rate */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
              animate={isLive ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: vitals.heartRate / 60, repeat: Infinity }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${getStatusColor(getVitalStatus('heartRate', vitals.heartRate))}`}>
                    <HeartIcon className="w-6 h-6" />
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

            {/* Blood Pressure */}
            <motion.div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl ${getStatusColor(getVitalStatus('systolic', vitals.bloodPressure.systolic))}`}>
                  <span className="text-xl font-bold">BP</span>
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

            {/* Oxygen Saturation */}
            <motion.div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl ${getStatusColor(getVitalStatus('oxygenSaturation', vitals.oxygenSaturation))}`}>
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

            {/* Temperature */}
            <motion.div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl ${getStatusColor(getVitalStatus('temperature', vitals.temperature))}`}>
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
          </div>

          {/* Real-time Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">ECG Simulation</h3>
              {isLive && (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-green-500 rounded-full"
                  />
                  <span className="text-sm text-green-600 font-medium">Live</span>
                </div>
              )}
            </div>
            
            <div className="h-48 bg-gray-50 rounded-lg p-4 relative overflow-hidden">
              {isLive ? (
                <motion.div className="h-full flex items-center">
                  <svg className="w-full h-full" viewBox="0 0 200 100">
                    <motion.polyline
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      points={heartbeatData.map((point, index) => `${index * 4},${100 - point}`).join(' ')}
                      animate={{ pathLength: 1 }}
                      initial={{ pathLength: 0 }}
                    />
                  </svg>
                  <motion.div
                    className="absolute top-1/2 right-0 w-1 h-full bg-green-500 transform -translate-y-1/2"
                    animate={{ x: [-20, 0] }}
                    transition={{ duration: 0.1, repeat: Infinity }}
                  />
                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <HeartIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Start demo to see live ECG</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Health Insights */}
            <div className="mt-6 space-y-3">
              <h4 className="font-semibold text-gray-900">AI Health Insights</h4>
              {[
                { icon: "✅", text: "All vitals within normal range", color: "text-green-600" },
                { icon: "💡", text: "Stay hydrated for optimal performance", color: "text-blue-600" },
                { icon: "🏃", text: "Consider 30min cardio exercise", color: "text-purple-600" }
              ].map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-lg">{insight.icon}</span>
                  <span className={`text-sm font-medium ${insight.color}`}>{insight.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Advanced Interactive Showcase Component
const InteractiveShowcase = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [particles, setParticles] = useState([]);
  const showcaseRef = useRef(null);

  // Generate particles for background effect
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          speedX: (Math.random() - 0.5) * 2,
          speedY: (Math.random() - 0.5) * 2,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  // Update mouse position for interactive effects
  const handleMouseMove = (e) => {
    if (showcaseRef.current) {
      const rect = showcaseRef.current.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100
      });
    }
  };

  const features = [
    {
      title: "AI-Powered Diagnostics",
      description: "Advanced machine learning algorithms analyze symptoms and provide preliminary diagnosis assistance",
      icon: "🧠",
      color: "from-purple-500 to-pink-500",
      interactive: true,
      demo: "Neural Network Visualization"
    },
    {
      title: "Real-time Vital Monitoring",
      description: "Monitor heart rate, blood pressure, and other vitals through connected devices",
      icon: "❤️",
      color: "from-red-500 to-orange-500",
      interactive: true,
      demo: "Live Health Dashboard"
    },
    {
      title: "3D Medical Imaging",
      description: "Interactive 3D visualization of medical scans and anatomical models",
      icon: "🔬",
      color: "from-blue-500 to-cyan-500",
      interactive: true,
      demo: "3D Anatomy Explorer"
    },
    {
      title: "Blockchain Health Records",
      description: "Secure, immutable health records powered by blockchain technology",
      icon: "🔗",
      color: "from-green-500 to-teal-500",
      interactive: true,
      demo: "Security Visualization"
    }
  ];

  return (
    <section 
      ref={showcaseRef}
      className="demo-features-section relative py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity
            }}
            animate={{
              x: isHovering ? mousePosition.x - particle.x : 0,
              y: isHovering ? mousePosition.y - particle.y : 0,
              scale: isHovering ? [1, 1.5, 1] : 1
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>

      {/* Interactive Cursor Effect */}
      {isHovering && (
        <motion.div
          className="absolute pointer-events-none z-20"
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <div className="w-32 h-32 border-2 border-cyan-400 rounded-full transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-full h-full border-2 border-purple-400 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
          </div>
        </motion.div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Healthcare</span> Technology
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the future of medicine with cutting-edge technology and interactive features
          </p>
        </motion.div>

        {/* Interactive Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`relative group cursor-pointer transition-all duration-500 ${
                activeFeature === index ? 'scale-105' : 'hover:scale-102'
              }`}
              onClick={() => setActiveFeature(index)}
              whileHover={{ y: -10 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-20 rounded-2xl blur group-hover:blur-sm transition-all duration-300" 
                   style={{ background: `linear-gradient(135deg, ${feature.color.split(' ')[1]}, ${feature.color.split(' ')[3]})` }}>
              </div>
              
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 h-full">
                {/* Feature Icon with Animation */}
                <motion.div
                  className={`text-6xl mb-4 filter drop-shadow-lg ${activeFeature === index ? 'animate-bounce' : ''}`}
                  animate={{
                    rotateY: activeFeature === index ? [0, 360] : 0,
                    scale: activeFeature === index ? [1, 1.1, 1] : 1
                  }}
                  transition={{ duration: 2, repeat: activeFeature === index ? Infinity : 0 }}
                >
                  {feature.icon}
                </motion.div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Interactive Demo Button */}
                <motion.button
                  className={`w-full bg-gradient-to-r ${feature.color} text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    
                    if (feature.demo === 'Neural Network Visualization') {
                      navigate('/demo/neural-network');
                    } else if (feature.demo === 'Live Health Dashboard') {
                      navigate('/demo/health-dashboard');
                    } else if (feature.demo === '3D Anatomy Explorer') {
                      navigate('/demo/3d-anatomy');
                    } else if (feature.demo === 'Security Visualization') {
                      navigate('/demo/security');
                    }
                  }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <SparklesIcon className="w-5 h-5" />
                    Try {feature.demo}
                  </span>
                </motion.button>
                
                {/* Active Feature Indicator */}
                {activeFeature === index && (
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <CheckCircleIcon className="w-4 h-4 text-slate-900" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive Technology Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Interactive Visualization */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-2xl p-8 border border-cyan-400/30">
                {/* Animated Tech Visualization */}
                <motion.div
                  className="w-full h-full relative"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-4 h-4 bg-cyan-400 rounded-full"
                      style={{
                        top: `${50 + 30 * Math.sin((i * 2 * Math.PI) / 8)}%`,
                        left: `${50 + 30 * Math.cos((i * 2 * Math.PI) / 8)}%`
                      }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.25
                      }}
                    />
                  ))}
                  
                  {/* Center Hub */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(147, 51, 234, 0.4)",
                        "0 0 0 20px rgba(147, 51, 234, 0)",
                        "0 0 0 0 rgba(147, 51, 234, 0)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CubeIcon className="w-8 h-8 text-white" />
                  </motion.div>
                </motion.div>
              </div>
            </div>
            
            {/* Content */}
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Next-Generation Healthcare Platform
              </h3>
              <div className="space-y-4">
                {[
                  "🚀 Real-time data processing and analytics",
                  "🔒 End-to-end encryption and security",
                  "🤖 AI-powered health insights and recommendations",
                  "📱 Seamless multi-device synchronization",
                  "🌐 Global healthcare network integration"
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="text-lg">{feature}</span>
                  </motion.div>
                ))}
              </div>
              
              <motion.button
                className="mt-8 bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(6, 182, 212, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const featuresSection = document.querySelector('.demo-features-section');
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Explore Advanced Features
                <ArrowRightIcon className="inline w-5 h-5 ml-2" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { doctors, setDoctors, setLoading, setError } = useApp();
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [stats, setStats] = useState(getDynamicStats());
  const [liveActivities, setLiveActivities] = useState(getLiveActivities());
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    specialties: 0
  });

  // Fetch data and initialize with dummy data
  useEffect(() => {
    let isActive = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        // In real app: const [doctorsData, specializationsData] = await Promise.all([...]);
        // Using dummy data for prototype
        setDoctors(dummyDoctors.slice(0, 6));
        setLoadedOnce(true);
      } catch (error) {
        if (isActive) setError('Failed to load data');
      } finally {
        if (isActive) setLoading(false);
      }
    };

    if (!loadedOnce) fetchData();
    return () => { isActive = false };
  }, [setDoctors, setLoading, setError, loadedOnce]);

  // Animate stats counter
  useEffect(() => {
    const animateStats = (key, target) => {
      let start = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          start = target;
          clearInterval(timer);
        }
        setAnimatedStats(prev => ({ ...prev, [key]: Math.floor(start) }));
      }, 30);
    };

    Object.keys(stats).forEach(key => {
      if (typeof stats[key] === 'number') {
        animateStats(key, stats[key]);
      }
    });
  }, [stats]);

  // Update live activities every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveActivities(getLiveActivities());
      setStats(getDynamicStats());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Testimonial carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % dummyTestimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleBookAppointment = () => {
    if (isAuthenticated) {
      navigate('/doctors');
    } else {
      navigate('/login');
    }
  };

  const handleViewDoctor = (doctorId) => {
    navigate(`/doctor/${doctorId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Medical Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-teal-50">
        {/* Medical Pattern Background */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%230f766e%22%20fill-opacity%3D%220.04%22%3E%3Cpath%20d%3D%22M30%2030c0-11.046%208.954-20%2020-20s20%208.954%2020%2020-8.954%2020-20%2020-20-8.954-20-20zm0%200c0-11.046-8.954-20-20-20S-10%2018.954-10%2030s8.954%2020%2020%2020%2020-8.954%2020-20z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
          {/* Floating medical icons - more subtle */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 text-teal-100/60 text-3xl animate-pulse" style={{animationDelay: '0s', animationDuration: '4s'}}>🏥</div>
            <div className="absolute top-40 right-32 text-slate-200/50 text-2xl animate-pulse" style={{animationDelay: '2s', animationDuration: '5s'}}>⚕️</div>
            <div className="absolute bottom-32 left-40 text-teal-100/40 text-2xl animate-pulse" style={{animationDelay: '1s', animationDuration: '6s'}}>🩺</div>
            <div className="absolute top-60 left-1/3 text-slate-200/40 text-xl animate-pulse" style={{animationDelay: '3s', animationDuration: '4s'}}>💊</div>
            <div className="absolute bottom-20 right-20 text-teal-100/50 text-2xl animate-pulse" style={{animationDelay: '1.5s', animationDuration: '5s'}}>❤️</div>
          </div>
        </div>
        
        {/* Medical Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="mb-8">
              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-wrap items-center justify-center gap-4 mb-8"
              >
                <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-md rounded-full px-6 py-3 shadow-lg border border-teal-100/50">
                  <ShieldCheckIcon className="w-5 h-5 text-teal-600" />
                  <span className="text-slate-700 font-semibold text-sm">HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-md rounded-full px-6 py-3 shadow-lg border border-slate-100/50">
                  <CheckCircleIcon className="w-5 h-5 text-slate-600" />
                  <span className="text-slate-700 font-semibold text-sm">Licensed Doctors</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-md rounded-full px-6 py-3 shadow-lg border border-emerald-100/50">
                  <ClockIcon className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700 font-semibold text-sm">24/7 Available</span>
                </div>
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                <span className="block text-slate-800 mb-2">Excellence in</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-slate-700 to-emerald-700">
                  Healthcare
                </span>
                <span className="block text-3xl md:text-4xl mt-4 text-slate-600 font-medium">Trusted Medical Platform</span>
              </h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="text-lg md:text-xl text-slate-600 mb-12 leading-relaxed max-w-4xl mx-auto font-medium"
              >
                Connect with certified healthcare professionals • Secure telemedicine consultations
                <br className="hidden md:block" />
                Advanced health monitoring • Comprehensive medical records • 24/7 care access
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col sm:flex-row justify-center gap-6 mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBookAppointment}
                className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-3 group border border-teal-500/20"
              >
                <CalendarDaysIcon className="h-6 w-6" />
                <span>Book Appointment</span>
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/doctors')}
                className="border-2 border-slate-300 bg-white/80 backdrop-blur-sm text-slate-700 px-12 py-4 rounded-xl font-semibold text-lg hover:bg-slate-50 hover:border-teal-300 transition-all duration-300 flex items-center space-x-3 group shadow-lg"
              >
                <UserGroupIcon className="h-6 w-6" />
                <span>Find Specialists</span>
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              {/* Emergency Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open('tel:911', '_self')}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-3 group border border-red-400/20"
              >
                <PhoneIcon className="h-6 w-6" />
                <span>Emergency</span>
              </motion.button>
            </motion.div>
            
            {/* Medical Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
            >
              {[
                { number: animatedStats.totalDoctors, suffix: '+', label: 'Certified Doctors', icon: UserGroupIcon, color: 'bg-blue-500' },
                { number: Math.floor(animatedStats.totalPatients / 1000), suffix: 'K+', label: 'Patients Treated', icon: HeartIcon, color: 'bg-green-500' },
                { number: Math.floor(animatedStats.totalAppointments / 1000), suffix: 'K+', label: 'Successful Consultations', icon: CalendarDaysIcon, color: 'bg-purple-500' },
                { number: 98, suffix: '%', label: 'Patient Satisfaction', icon: StarIcon, color: 'bg-orange-500' },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.7 + index * 0.1 }}
                    className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {stat.number}{stat.suffix}
                    </div>
                    <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
        
        {/* Three.js Interactive Scene */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <Suspense fallback={null}>
              <InteractiveScene />
            </Suspense>
          </Canvas>
        </div>
      </section>
      
      {/* Live Activities Section */}
      <section className="py-8 bg-gradient-to-r from-blue-50 to-green-50 border-y border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-3 h-3 bg-green-500 rounded-full"
              />
              <span className="text-gray-800 font-semibold">Live Healthcare Updates:</span>
            </div>
            <div className="flex-1 overflow-hidden max-w-4xl">
              <motion.div
                animate={{ x: ["100%", "-100%"] }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                className="whitespace-nowrap"
              >
                {liveActivities.map((activity, index) => (
                  <span key={activity.id} className="text-gray-600 mr-12">
                    🩺 {activity.activity} • {activity.time}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Interactive Showcase Section */}
      <InteractiveShowcase />
      
      {/* Real-time Health Dashboard Demo */}
      <HealthDashboardDemo />

      {/* Medical Specialties Section */}
      <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Medical <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">Specialties</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with specialists across various medical fields
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[
              { 
                name: 'Cardiology', 
                icon: '❤️', 
                patients: '2,347', 
                description: 'Heart and cardiovascular system specialists',
                availableDoctors: 24,
                avgWaitTime: '2-3 days',
                color: 'from-red-500 to-pink-500'
              },
              { 
                name: 'Dermatology', 
                icon: '🧴', 
                patients: '1,892', 
                description: 'Skin, hair, and nail conditions',
                availableDoctors: 18,
                avgWaitTime: '1-2 days',
                color: 'from-orange-500 to-yellow-500'
              },
              { 
                name: 'Pediatrics', 
                icon: '👶', 
                patients: '3,156', 
                description: 'Comprehensive child healthcare',
                availableDoctors: 32,
                avgWaitTime: 'Same day',
                color: 'from-pink-500 to-purple-500'
              },
              { 
                name: 'Neurology', 
                icon: '🧠', 
                patients: '1,267', 
                description: 'Brain and nervous system disorders',
                availableDoctors: 15,
                avgWaitTime: '3-5 days',
                color: 'from-purple-500 to-indigo-500'
              },
              { 
                name: 'Orthopedics', 
                icon: '🧜', 
                patients: '2,734', 
                description: 'Bone, joint, and muscle care',
                availableDoctors: 28,
                avgWaitTime: '2-4 days',
                color: 'from-blue-500 to-cyan-500'
              },
              { 
                name: 'Mental Health', 
                icon: '🧘', 
                patients: '1,943', 
                description: 'Psychology and psychiatry services',
                availableDoctors: 22,
                avgWaitTime: '1-3 days',
                color: 'from-teal-500 to-green-500'
              },
              { 
                name: 'Gynecology', 
                icon: '🤱', 
                patients: '2,108', 
                description: 'Women\'s health and reproductive care',
                availableDoctors: 26,
                avgWaitTime: '1-2 days',
                color: 'from-pink-500 to-rose-500'
              },
              { 
                name: 'Oncology', 
                icon: '🎗️', 
                patients: '847', 
                description: 'Cancer diagnosis and treatment',
                availableDoctors: 12,
                avgWaitTime: '1-2 days',
                color: 'from-red-600 to-orange-600'
              },
              { 
                name: 'Emergency', 
                icon: '🚑', 
                patients: '24/7', 
                description: 'Urgent and critical care services',
                availableDoctors: 45,
                avgWaitTime: 'Immediate',
                color: 'from-red-500 to-red-600'
              },
              { 
                name: 'Family Medicine', 
                icon: '👩‍⚕️', 
                patients: '4,256', 
                description: 'Primary care for all ages',
                availableDoctors: 38,
                avgWaitTime: 'Same day',
                color: 'from-green-500 to-emerald-500'
              },
              { 
                name: 'Ophthalmology', 
                icon: '👁️', 
                patients: '1,634', 
                description: 'Eye and vision care specialists',
                availableDoctors: 16,
                avgWaitTime: '2-3 days',
                color: 'from-blue-500 to-indigo-500'
              },
              { 
                name: 'Dentistry', 
                icon: '🧜', 
                patients: '1,687', 
                description: 'Oral health and dental care',
                availableDoctors: 20,
                avgWaitTime: '1-2 days',
                color: 'from-cyan-500 to-blue-500'
              },
            ].map((specialty, index) => (
              <motion.div
                key={specialty.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -8 }}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200"
                onClick={() => navigate(`/doctors/${specialty.name.toLowerCase().replace(' ', '-')}`)}
              >
                <div className="relative">
                  {/* Gradient background for icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${specialty.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <span className="text-2xl filter drop-shadow-sm">{specialty.icon}</span>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 text-center mb-2 text-lg group-hover:text-blue-600 transition-colors">
                    {specialty.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 text-center mb-4 leading-relaxed">
                    {specialty.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Patients Served:</span>
                      <span className="font-semibold text-blue-600">{specialty.patients}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Available Doctors:</span>
                      <span className="font-semibold text-green-600">{specialty.availableDoctors}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Avg. Wait Time:</span>
                      <span className="font-semibold text-orange-600">{specialty.avgWaitTime}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all group-hover:shadow-lg">
                      Book Appointment
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of healthcare with our comprehensive digital platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <VideoCameraIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Video Consultations</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with doctors through secure video calls. Get professional medical advice from the comfort of your home.
              </p>
              <button 
                onClick={() => navigate('/video')}
                className="mt-4 text-blue-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all"
              >
                Try Video Call <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
            
            <div className="group bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Instant Messaging</h3>
              <p className="text-gray-600 leading-relaxed">
                Chat directly with your doctor, share reports, and get quick answers to your health questions 24/7.
              </p>
              <button 
                onClick={() => navigate('/chat')}
                className="mt-4 text-green-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all"
              >
                Start Chatting <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
            
            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheckIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Secure & Safe</h3>
              <p className="text-gray-600 leading-relaxed">
                Your health data is protected with bank-level security. HIPAA compliant and completely confidential.
              </p>
              <button 
                onClick={() => navigate('/about')}
                className="mt-4 text-purple-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all"
              >
                Learn More <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands Across India
            </h2>
            <p className="text-xl text-gray-600">
              Join our growing community of patients and healthcare providers
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserGroupIcon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {animatedStats.totalDoctors}+
                </div>
                <div className="text-gray-600 font-medium">Verified Doctors</div>
                <div className="text-sm text-gray-500 mt-1">Across all specialties</div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HeartIcon className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {Math.floor(animatedStats.totalPatients / 1000)}K+
                </div>
                <div className="text-gray-600 font-medium">Happy Patients</div>
                <div className="text-sm text-green-600 mt-1 font-medium">{stats.averageRating}⭐ Average Rating</div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-100">
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarDaysIcon className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {Math.floor(animatedStats.totalAppointments / 1000)}K+
                </div>
                <div className="text-gray-600 font-medium">Appointments</div>
                <div className="text-sm text-purple-600 mt-1 font-medium">{stats.successRate}% Success Rate</div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-100">
              <div className="text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClockIcon className="w-8 h-8 text-orange-600" />
                </div>
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  24/7
                </div>
                <div className="text-gray-600 font-medium">Available</div>
                <div className="text-sm text-orange-600 mt-1 font-medium">{stats.specialties} Specialties</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section with sample cards (name, post, specialty, image tag) */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Featured Doctors
            </h2>
            <p className="text-xl text-gray-600">
              Highly qualified and experienced healthcare professionals
            </p>
          </div>
          
          {doctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doctor) => (
                <div key={doctor._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      {/* Replace src with your asset path if needed */}
                      <img src={doctor.user?.profilePicture || groupProfile} alt={doctor.user?.name} className="w-16 h-16 rounded-full object-cover mr-4" />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Dr. {doctor.user?.name}</h3>
                        <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                        {/* Optional: Post/Designation tag */}
                        <p className="text-gray-500 text-sm">Senior Consultant</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(doctor.rating?.average || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {doctor.rating?.average || 0} ({doctor.rating?.count || 0} reviews)
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {doctor.experience} years experience • ₹{doctor.consultationFee} consultation
                      </p>
                    </div>
                    
                    <button
                      onClick={() => handleViewDoctor(doctor._id)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading doctors...</div>
            </div>
          )}
          
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/doctors')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Doctors
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to book your appointment
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Find a Doctor</h3>
              <p className="text-gray-600">
                Browse through our extensive list of verified doctors by specialty, location, or rating.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Book Appointment</h3>
              <p className="text-gray-600">
                Select your preferred date and time slot, and provide your medical information.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Treatment</h3>
              <p className="text-gray-600">
                Attend your appointment and receive quality healthcare from our trusted doctors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact Section */}
      <section className="py-16 bg-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Emergency Medical Services
            </h2>
            <p className="text-xl text-red-100">
              24/7 Emergency care when you need it most
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Emergency Services */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <PhoneIcon className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Emergency: 911</h3>
              <p className="text-red-100 mb-6">Life-threatening emergencies require immediate medical attention</p>
              <button 
                onClick={() => window.open('tel:911', '_self')}
                className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors w-full"
              >
                Call Now
              </button>
            </div>

            {/* 24/7 Helpline */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">24/7 Helpline</h3>
              <p className="text-red-100 mb-4">+1 (800) 123-4567</p>
              <p className="text-red-100 mb-6 text-sm">Non-emergency medical questions and urgent care guidance</p>
              <button 
                onClick={() => window.open('tel:+18001234567', '_self')}
                className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors w-full"
              >
                Call Helpline
              </button>
            </div>

            {/* Poison Control */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ExclamationCircleIcon className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Poison Control</h3>
              <p className="text-red-100 mb-4">+1 (800) 222-1222</p>
              <p className="text-red-100 mb-6 text-sm">24/7 poison emergency information and treatment guidance</p>
              <button 
                onClick={() => window.open('tel:+18002221222', '_self')}
                className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors w-full"
              >
                Call Poison Control
              </button>
            </div>
          </div>
          
          {/* Emergency Info */}
          <div className="mt-12 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">When to Call Emergency Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <div className="text-center">
                  <div className="bg-white/20 rounded-lg p-4 mb-3">
                    <span className="text-3xl">🫀</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">Heart Attack</h4>
                  <p className="text-red-100 text-sm">Chest pain, shortness of breath, arm pain</p>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 rounded-lg p-4 mb-3">
                    <span className="text-3xl">🧠</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">Stroke</h4>
                  <p className="text-red-100 text-sm">Face drooping, speech difficulty, severe headache</p>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 rounded-lg p-4 mb-3">
                    <span className="text-3xl">🩸</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">Severe Bleeding</h4>
                  <p className="text-red-100 text-sm">Uncontrolled bleeding, deep cuts</p>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 rounded-lg p-4 mb-3">
                    <span className="text-3xl">🫁</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">Severe Breathing</h4>
                  <p className="text-red-100 text-sm">Difficulty breathing, choking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Book Your Appointment?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of patients who trust us with their healthcare needs
          </p>
          <button
            onClick={handleBookAppointment}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;