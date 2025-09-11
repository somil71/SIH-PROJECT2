import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Text } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  CubeIcon, 
  EyeIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

// 3D Heart Model Component
const Heart = ({ isAnimating, selectedPart, onPartClick }) => {
  const heartRef = useRef();
  const ventricleRef = useRef();
  const atriumRef = useRef();

  useFrame((state) => {
    if (heartRef.current && isAnimating) {
      // Heartbeat animation
      const beat = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 1;
      heartRef.current.scale.setScalar(beat);
      
      // Gentle rotation
      heartRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={heartRef} position={[0, 0, 0]}>
      {/* Main Heart Body */}
      <mesh
        onClick={() => onPartClick('heart')}
        onPointerOver={(e) => (e.object.material.color.setHex(0xff6b6b))}
        onPointerOut={(e) => (e.object.material.color.setHex(0xff4757))}
      >
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshStandardMaterial 
          color={selectedPart === 'heart' ? '#ff6b6b' : '#ff4757'} 
          transparent 
          opacity={0.8}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Left Ventricle */}
      <mesh
        ref={ventricleRef}
        position={[-0.3, -0.2, 0.1]}
        onClick={() => onPartClick('leftVentricle')}
        onPointerOver={(e) => (e.object.material.color.setHex(0xe74c3c))}
        onPointerOut={(e) => (e.object.material.color.setHex(0xc0392b))}
      >
        <sphereGeometry args={[0.6, 12, 12]} />
        <meshStandardMaterial 
          color={selectedPart === 'leftVentricle' ? '#e74c3c' : '#c0392b'} 
          transparent 
          opacity={0.9}
        />
      </mesh>
      
      {/* Right Ventricle */}
      <mesh
        position={[0.3, -0.2, 0.1]}
        onClick={() => onPartClick('rightVentricle')}
        onPointerOver={(e) => (e.object.material.color.setHex(0xe74c3c))}
        onPointerOut={(e) => (e.object.material.color.setHex(0xa93226))}
      >
        <sphereGeometry args={[0.5, 12, 12]} />
        <meshStandardMaterial 
          color={selectedPart === 'rightVentricle' ? '#e74c3c' : '#a93226'} 
          transparent 
          opacity={0.9}
        />
      </mesh>
      
      {/* Left Atrium */}
      <mesh
        ref={atriumRef}
        position={[-0.2, 0.4, 0]}
        onClick={() => onPartClick('leftAtrium')}
        onPointerOver={(e) => (e.object.material.color.setHex(0xf39c12))}
        onPointerOut={(e) => (e.object.material.color.setHex(0xe67e22))}
      >
        <sphereGeometry args={[0.4, 10, 10]} />
        <meshStandardMaterial 
          color={selectedPart === 'leftAtrium' ? '#f39c12' : '#e67e22'} 
          transparent 
          opacity={0.8}
        />
      </mesh>
      
      {/* Right Atrium */}
      <mesh
        position={[0.2, 0.4, 0]}
        onClick={() => onPartClick('rightAtrium')}
        onPointerOver={(e) => (e.object.material.color.setHex(0xf39c12))}
        onPointerOut={(e) => (e.object.material.color.setHex(0xd68910))}
      >
        <sphereGeometry args={[0.35, 10, 10]} />
        <meshStandardMaterial 
          color={selectedPart === 'rightAtrium' ? '#f39c12' : '#d68910'} 
          transparent 
          opacity={0.8}
        />
      </mesh>
      
      {/* Aorta */}
      <mesh
        position={[0, 0.8, 0]}
        rotation={[0, 0, Math.PI / 6]}
        onClick={() => onPartClick('aorta')}
        onPointerOver={(e) => (e.object.material.color.setHex(0x3498db))}
        onPointerOut={(e) => (e.object.material.color.setHex(0x2980b9))}
      >
        <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
        <meshStandardMaterial 
          color={selectedPart === 'aorta' ? '#3498db' : '#2980b9'} 
          transparent 
          opacity={0.7}
        />
      </mesh>
      
      {/* Pulmonary Artery */}
      <mesh
        position={[0.3, 0.6, 0.2]}
        rotation={[0, Math.PI / 4, Math.PI / 8]}
        onClick={() => onPartClick('pulmonaryArtery')}
        onPointerOver={(e) => (e.object.material.color.setHex(0x9b59b6))}
        onPointerOut={(e) => (e.object.material.color.setHex(0x8e44ad))}
      >
        <cylinderGeometry args={[0.1, 0.1, 0.6, 8]} />
        <meshStandardMaterial 
          color={selectedPart === 'pulmonaryArtery' ? '#9b59b6' : '#8e44ad'} 
          transparent 
          opacity={0.7}
        />
      </mesh>
    </group>
  );
};

// Skeleton Model Component
const Skeleton = ({ selectedPart, onPartClick }) => {
  return (
    <group position={[0, -1, 0]}>
      {/* Skull */}
      <mesh
        position={[0, 3, 0]}
        onClick={() => onPartClick('skull')}
        onPointerOver={(e) => (e.object.material.color.setHex(0xffffff))}
        onPointerOut={(e) => (e.object.material.color.setHex(0xf8f9fa))}
      >
        <sphereGeometry args={[0.4, 12, 12]} />
        <meshStandardMaterial 
          color={selectedPart === 'skull' ? '#ffffff' : '#f8f9fa'} 
          transparent 
          opacity={0.9}
        />
      </mesh>
      
      {/* Spine */}
      <mesh
        position={[0, 1.5, -0.1]}
        onClick={() => onPartClick('spine')}
        onPointerOver={(e) => (e.object.material.color.setHex(0xffffff))}
        onPointerOut={(e) => (e.object.material.color.setHex(0xf1f2f6))}
      >
        <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
        <meshStandardMaterial 
          color={selectedPart === 'spine' ? '#ffffff' : '#f1f2f6'} 
          transparent 
          opacity={0.9}
        />
      </mesh>
      
      {/* Rib Cage */}
      {[...Array(6)].map((_, i) => (
        <group key={`rib-${i}`}>
          <mesh
            position={[-0.3, 2.2 - i * 0.15, 0]}
            rotation={[0, 0, -Math.PI / 6]}
            onClick={() => onPartClick('ribs')}
          >
            <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
            <meshStandardMaterial 
              color={selectedPart === 'ribs' ? '#ffffff' : '#ecf0f1'} 
              transparent 
              opacity={0.8}
            />
          </mesh>
          <mesh
            position={[0.3, 2.2 - i * 0.15, 0]}
            rotation={[0, 0, Math.PI / 6]}
            onClick={() => onPartClick('ribs')}
          >
            <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
            <meshStandardMaterial 
              color={selectedPart === 'ribs' ? '#ffffff' : '#ecf0f1'} 
              transparent 
              opacity={0.8}
            />
          </mesh>
        </group>
      ))}
      
      {/* Arms */}
      <mesh
        position={[-0.8, 1.8, 0]}
        rotation={[0, 0, -Math.PI / 4]}
        onClick={() => onPartClick('leftArm')}
      >
        <cylinderGeometry args={[0.03, 0.03, 1.2, 6]} />
        <meshStandardMaterial 
          color={selectedPart === 'leftArm' ? '#ffffff' : '#ddd'} 
          transparent 
          opacity={0.8}
        />
      </mesh>
      
      <mesh
        position={[0.8, 1.8, 0]}
        rotation={[0, 0, Math.PI / 4]}
        onClick={() => onPartClick('rightArm')}
      >
        <cylinderGeometry args={[0.03, 0.03, 1.2, 6]} />
        <meshStandardMaterial 
          color={selectedPart === 'rightArm' ? '#ffffff' : '#ddd'} 
          transparent 
          opacity={0.8}
        />
      </mesh>
      
      {/* Legs */}
      <mesh
        position={[-0.2, 0.2, 0]}
        onClick={() => onPartClick('leftLeg')}
      >
        <cylinderGeometry args={[0.04, 0.04, 1.5, 6]} />
        <meshStandardMaterial 
          color={selectedPart === 'leftLeg' ? '#ffffff' : '#ddd'} 
          transparent 
          opacity={0.8}
        />
      </mesh>
      
      <mesh
        position={[0.2, 0.2, 0]}
        onClick={() => onPartClick('rightLeg')}
      >
        <cylinderGeometry args={[0.04, 0.04, 1.5, 6]} />
        <meshStandardMaterial 
          color={selectedPart === 'rightLeg' ? '#ffffff' : '#ddd'} 
          transparent 
          opacity={0.8}
        />
      </mesh>
    </group>
  );
};

const AnatomyExplorer = () => {
  const navigate = useNavigate();
  const [selectedModel, setSelectedModel] = useState('heart');
  const [selectedPart, setSelectedPart] = useState(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [viewMode, setViewMode] = useState('3d');

  const models = [
    { id: 'heart', name: 'Cardiovascular System', icon: '❤️' },
    { id: 'skeleton', name: 'Skeletal System', icon: '🦴' },
    { id: 'brain', name: 'Nervous System', icon: '🧠' },
    { id: 'lungs', name: 'Respiratory System', icon: '🫁' }
  ];

  const anatomyInfo = {
    // Heart parts
    heart: {
      name: 'Heart',
      description: 'The heart is a muscular organ that pumps blood throughout the body via the cardiovascular system.',
      function: 'Pumps oxygenated blood to body tissues and returns deoxygenated blood to the lungs.',
      facts: ['Beats about 100,000 times per day', 'Weighs between 8-12 ounces', 'Size of a fist']
    },
    leftVentricle: {
      name: 'Left Ventricle',
      description: 'The left ventricle is the heart\'s main pumping chamber.',
      function: 'Pumps oxygen-rich blood to the rest of the body through the aorta.',
      facts: ['Thickest chamber wall', 'Generates highest pressure', 'Most muscular part']
    },
    rightVentricle: {
      name: 'Right Ventricle',
      description: 'The right ventricle pumps blood to the lungs.',
      function: 'Sends deoxygenated blood to the lungs for oxygenation.',
      facts: ['Thinner walls than left ventricle', 'Crescent-shaped', 'Lower pressure system']
    },
    leftAtrium: {
      name: 'Left Atrium',
      description: 'The left atrium receives oxygenated blood from the lungs.',
      function: 'Collects oxygen-rich blood from pulmonary veins and sends it to left ventricle.',
      facts: ['Smooth-walled chamber', 'Contains pulmonary veins', 'Higher oxygen content']
    },
    rightAtrium: {
      name: 'Right Atrium',
      description: 'The right atrium receives deoxygenated blood from the body.',
      function: 'Collects blood from superior and inferior vena cava.',
      facts: ['Contains sinoatrial node', 'Natural pacemaker location', 'Rough-walled chamber']
    },
    aorta: {
      name: 'Aorta',
      description: 'The aorta is the largest artery in the human body.',
      function: 'Carries oxygenated blood from the left ventricle to all parts of the body.',
      facts: ['About 1 inch in diameter', 'Can stretch to accommodate blood flow', '3 main sections']
    },
    pulmonaryArtery: {
      name: 'Pulmonary Artery',
      description: 'The pulmonary artery carries blood to the lungs.',
      function: 'Transports deoxygenated blood from right ventricle to lungs.',
      facts: ['Only artery carrying deoxygenated blood', 'Splits into left and right branches', 'Lower pressure than aorta']
    },
    // Skeleton parts
    skull: {
      name: 'Skull',
      description: 'The skull protects the brain and forms the structure of the face.',
      function: 'Houses and protects the brain, supports facial structures.',
      facts: ['22 bones total', '8 cranial bones', '14 facial bones']
    },
    spine: {
      name: 'Spine',
      description: 'The spine provides structural support and protects the spinal cord.',
      function: 'Supports body weight, enables movement, protects spinal cord.',
      facts: ['33 vertebrae total', 'Natural S-curve', 'Contains spinal cord']
    },
    ribs: {
      name: 'Rib Cage',
      description: 'The rib cage protects vital organs in the chest.',
      function: 'Protects heart, lungs, and other organs; assists in breathing.',
      facts: ['12 pairs of ribs', 'True and false ribs', 'Expandable for breathing']
    },
    leftArm: {
      name: 'Left Arm',
      description: 'The arm bones provide structure for upper limb movement.',
      function: 'Enables complex hand and arm movements.',
      facts: ['Humerus, radius, ulna', 'Multiple joints', 'Complex range of motion']
    },
    rightArm: {
      name: 'Right Arm',
      description: 'The arm bones provide structure for upper limb movement.',
      function: 'Enables complex hand and arm movements.',
      facts: ['Humerus, radius, ulna', 'Multiple joints', 'Complex range of motion']
    },
    leftLeg: {
      name: 'Left Leg',
      description: 'The leg bones support body weight and enable locomotion.',
      function: 'Supports body weight, enables walking and running.',
      facts: ['Femur, tibia, fibula', 'Strongest bones in body', 'Weight-bearing function']
    },
    rightLeg: {
      name: 'Right Leg',
      description: 'The leg bones support body weight and enable locomotion.',
      function: 'Supports body weight, enables walking and running.',
      facts: ['Femur, tibia, fibula', 'Strongest bones in body', 'Weight-bearing function']
    }
  };

  const handlePartClick = (partId) => {
    setSelectedPart(partId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white hover:text-cyan-300 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Home
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            3D <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Anatomy Explorer</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Model Selection */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <CubeIcon className="w-8 h-8 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Body Systems</h2>
            </div>

            <div className="space-y-3">
              {models.map((model) => (
                <motion.button
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model.id);
                    setSelectedPart(null);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    selectedModel === model.id
                      ? 'bg-cyan-500/20 border border-cyan-400/50'
                      : 'bg-white/5 border border-white/10 hover:border-white/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-2xl">{model.icon}</span>
                  <span className="text-white font-medium text-sm">{model.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Controls */}
            <div className="mt-6 space-y-3">
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className="w-full flex items-center justify-center gap-2 bg-purple-500/20 border border-purple-400/50 text-purple-300 py-2 px-4 rounded-xl hover:bg-purple-500/30 transition-colors"
              >
                {isAnimating ? 'Pause Animation' : 'Start Animation'}
              </button>
              
              <button
                onClick={() => setViewMode(viewMode === '3d' ? 'xray' : '3d')}
                className="w-full flex items-center justify-center gap-2 bg-blue-500/20 border border-blue-400/50 text-blue-300 py-2 px-4 rounded-xl hover:bg-blue-500/30 transition-colors"
              >
                <EyeIcon className="w-4 h-4" />
                {viewMode === '3d' ? 'X-Ray View' : '3D View'}
              </button>
            </div>
          </div>

          {/* 3D Viewer */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Interactive 3D Model</h2>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <MagnifyingGlassIcon className="w-4 h-4" />
                Click parts to explore
              </div>
            </div>

            <div className="h-96 bg-black/20 rounded-xl overflow-hidden">
              <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.3} />
                <spotLight
                  position={[0, 10, 0]}
                  angle={0.3}
                  penumbra={1}
                  intensity={1}
                  castShadow
                />
                
                <Suspense fallback={null}>
                  {selectedModel === 'heart' && (
                    <Heart 
                      isAnimating={isAnimating} 
                      selectedPart={selectedPart}
                      onPartClick={handlePartClick}
                    />
                  )}
                  {selectedModel === 'skeleton' && (
                    <Skeleton 
                      selectedPart={selectedPart}
                      onPartClick={handlePartClick}
                    />
                  )}
                  
                  <Environment preset="studio" />
                </Suspense>
                
                <OrbitControls
                  enableZoom={true}
                  enablePan={true}
                  enableRotate={true}
                  minDistance={2}
                  maxDistance={10}
                />
              </Canvas>
            </div>

            <div className="mt-4 text-center text-gray-400 text-sm">
              Drag to rotate • Scroll to zoom • Click parts for details
            </div>
          </div>

          {/* Information Panel */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <InformationCircleIcon className="w-8 h-8 text-green-400" />
              <h2 className="text-xl font-bold text-white">Information</h2>
            </div>

            <AnimatePresence mode="wait">
              {selectedPart && anatomyInfo[selectedPart] ? (
                <motion.div
                  key={selectedPart}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-bold text-cyan-300">
                    {anatomyInfo[selectedPart].name}
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-1">Description</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {anatomyInfo[selectedPart].description}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-1">Function</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {anatomyInfo[selectedPart].function}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">Key Facts</h4>
                      <ul className="space-y-1">
                        {anatomyInfo[selectedPart].facts.map((fact, index) => (
                          <li key={index} className="text-gray-400 text-sm flex items-start gap-2">
                            <span className="text-cyan-400 mt-1">•</span>
                            {fact}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <CpuChipIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-sm">
                    Click on parts of the 3D model to learn more about them
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Body Systems', value: '11+', icon: '🔬' },
            { label: 'Organs', value: '78+', icon: '🫀' },
            { label: 'Bones', value: '206', icon: '🦴' },
            { label: 'Muscles', value: '600+', icon: '💪' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnatomyExplorer;
