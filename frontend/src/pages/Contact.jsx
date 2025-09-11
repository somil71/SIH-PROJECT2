import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  HeartIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  StarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

// 3D Floating Message Bubble
const MessageBubble = ({ position, color = "#3b82f6" }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={meshRef} position={position}>
        {/* Main bubble */}
        <mesh>
          <sphereGeometry args={[0.3]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
        </mesh>
        {/* Tail */}
        <mesh position={[-0.2, -0.2, 0]}>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
        </mesh>
      </group>
    </Float>
  );
};

// 3D Communication Network
const CommunicationNetwork = ({ position }) => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  const nodes = [
    { pos: [0, 0, 0], color: "#3b82f6" },
    { pos: [1, 0.5, 0], color: "#ef4444" },
    { pos: [-1, 0.5, 0], color: "#10b981" },
    { pos: [0.5, -0.5, 0.5], color: "#f59e0b" },
    { pos: [-0.5, -0.5, -0.5], color: "#8b5cf6" },
  ];

  return (
    <group ref={groupRef} position={position}>
      {/* Connection lines */}
      {nodes.map((node, i) => 
        nodes.slice(i + 1).map((otherNode, j) => {
          const start = new THREE.Vector3(...node.pos);
          const end = new THREE.Vector3(...otherNode.pos);
          const distance = start.distanceTo(end);
          const midpoint = start.clone().add(end).multiplyScalar(0.5);
          
          return (
            <mesh key={`${i}-${j}`} position={midpoint.toArray()}>
              <cylinderGeometry args={[0.01, 0.01, distance]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
            </mesh>
          );
        })
      )}
      
      {/* Nodes */}
      {nodes.map((node, index) => (
        <Float key={index} speed={1 + index * 0.2} rotationIntensity={0.2}>
          <mesh position={node.pos}>
            <sphereGeometry args={[0.1]} />
            <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.5} />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

// 3D Scene Component
const ContactScene3D = () => {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#3b82f6" />
      
      <MessageBubble position={[-1.5, 0, 0]} color="#3b82f6" />
      <MessageBubble position={[1.5, 0, 0]} color="#ef4444" />
      <MessageBubble position={[0, 1, 0]} color="#10b981" />
      
      <CommunicationNetwork position={[0, -0.5, 0]} />
      
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
    </>
  );
};

// Animated typing effect
const TypewriterText = ({ text, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let timeout;
    let index = 0;
    
    const typeChar = () => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
        timeout = setTimeout(typeChar, 100);
      }
    };
    
    const startTimeout = setTimeout(typeChar, delay);
    
    return () => {
      clearTimeout(timeout);
      clearTimeout(startTimeout);
    };
  }, [text, delay]);
  
  return <span>{displayText}<span className="animate-pulse">|</span></span>;
};

const Contact = () => {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    subject: '', 
    message: '',
    phone: '',
    company: '',
    priority: 'medium'
  });
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeContact, setActiveContact] = useState(0);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSent(true);
      setIsLoading(false);
      // Reset form after success message
      setTimeout(() => {
        setSent(false);
        setForm({ 
          name: '', 
          email: '', 
          subject: '', 
          message: '',
          phone: '',
          company: '',
          priority: 'medium'
        });
      }, 3000);
    }, 2000);
  };

  const contactMethods = [
    {
      icon: PhoneIcon,
      title: "Call Us",
      description: "Speak directly with our support team",
      contact: "+91-98765-43210",
      available: "24/7 Available",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      action: "Call Now"
    },
    {
      icon: EnvelopeIcon,
      title: "Email Support",
      description: "Send us your queries and concerns",
      contact: "support@healthconnect.com",
      available: "Response within 2 hours",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      action: "Send Email"
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Live Chat",
      description: "Chat with our AI assistant",
      contact: "healthbot@healthconnect.com",
      available: "Instant Response",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      action: "Start Chat"
    },
    {
      icon: QuestionMarkCircleIcon,
      title: "Help Center",
      description: "Browse our comprehensive FAQ",
      contact: "help.healthconnect.com",
      available: "Self-service 24/7",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      action: "Visit Help"
    }
  ];

  const officeLocations = [
    {
      city: "New Delhi",
      address: "A-123, Connaught Place, New Delhi - 110001",
      phone: "+91-11-4567-8900",
      email: "delhi@healthconnect.com",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM"
    },
    {
      city: "Mumbai",
      address: "Floor 15, Business Hub, Bandra East, Mumbai - 400051",
      phone: "+91-22-9876-5432",
      email: "mumbai@healthconnect.com",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM"
    },
    {
      city: "Bangalore",
      address: "Tech Park, Electronic City, Bangalore - 560100",
      phone: "+91-80-1234-5678",
      email: "bangalore@healthconnect.com",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 overflow-hidden">
      {/* Hero Section with 3D Animation */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background 3D Canvas */}
        <div className="absolute inset-0 z-0 opacity-30">
          <Canvas camera={{ position: [0, 0, 6], fov: 75 }}>
            <ContactScene3D />
          </Canvas>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 z-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
              animate={{
                x: [0, Math.random() * 100],
                y: [0, Math.random() * 100],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: Math.random() * 8 + 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              style={{
                left: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                top: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 mb-6">
              Get in Touch
            </h1>
            <div className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed h-16">
              <TypewriterText text="We're here to help you on your health journey" delay={800} />
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
                onClick={() => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })}
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                <span>Start Conversation</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/30 transition-all duration-300 flex items-center space-x-2"
                onClick={() => window.open('tel:+91-98765-43210')}
              >
                <PhoneIcon className="h-5 w-5" />
                <span>Call Us Now</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-20 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Preferred Way
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple ways to reach us - we're always ready to help
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className={`${method.bgColor} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group`}
                  onClick={() => setActiveContact(index)}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{method.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 text-center">{method.description}</p>
                  
                  <div className="text-center mb-4">
                    <p className="font-semibold text-gray-900">{method.contact}</p>
                    <p className="text-sm text-green-600">{method.available}</p>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full bg-gradient-to-r ${method.color} text-white py-3 px-4 rounded-full font-medium hover:shadow-lg transition-all duration-300`}
                  >
                    {method.action}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Office Info Section */}
      <section id="contact-form" className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-8"
            >
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                <EnvelopeIcon className="h-8 w-8 mr-3" />
                Send us a message
              </h2>
              
              {sent ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircleIcon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Message Sent!</h3>
                  <p className="text-blue-100">Thank you for reaching out. We'll get back to you within 2 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Full Name *</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        required
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:border-transparent outline-none backdrop-blur-sm transition-all duration-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white font-medium mb-2">Email Address *</label>
                      <input
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        type="email"
                        required
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:border-transparent outline-none backdrop-blur-sm transition-all duration-300"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Phone Number</label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={onChange}
                        type="tel"
                        placeholder="+91-98765-43210"
                        className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:border-transparent outline-none backdrop-blur-sm transition-all duration-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white font-medium mb-2">Company/Organization</label>
                      <input
                        name="company"
                        value={form.company}
                        onChange={onChange}
                        placeholder="Your Company"
                        className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:border-transparent outline-none backdrop-blur-sm transition-all duration-300"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Subject *</label>
                      <input
                        name="subject"
                        value={form.subject}
                        onChange={onChange}
                        required
                        placeholder="How can we help?"
                        className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:border-transparent outline-none backdrop-blur-sm transition-all duration-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white font-medium mb-2">Priority Level</label>
                      <select
                        name="priority"
                        value={form.priority}
                        onChange={onChange}
                        className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white focus:ring-2 focus:ring-white focus:border-transparent outline-none backdrop-blur-sm transition-all duration-300"
                      >
                        <option value="low" className="text-gray-900">Low Priority</option>
                        <option value="medium" className="text-gray-900">Medium Priority</option>
                        <option value="high" className="text-gray-900">High Priority</option>
                        <option value="urgent" className="text-gray-900">Urgent</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={onChange}
                      required
                      rows={5}
                      placeholder="Please describe your inquiry in detail..."
                      className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:border-transparent outline-none backdrop-blur-sm transition-all duration-300 resize-none"
                    />
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={!isLoading ? { scale: 1.05 } : {}}
                    whileTap={!isLoading ? { scale: 0.95 } : {}}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                      isLoading
                        ? 'bg-white/20 cursor-not-allowed'
                        : 'bg-white text-purple-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <ArrowRightIcon className="h-5 w-5" />
                      </>
                    )}
                  </motion.button>
                  
                  <p className="text-blue-100 text-sm text-center">
                    By submitting this form, you agree to our privacy policy and terms of service.
                  </p>
                </form>
              )}
            </motion.div>

            {/* Office Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Visit Our Offices</h2>
                <p className="text-blue-100 text-lg">Find us in major cities across India</p>
              </div>
              
              {officeLocations.map((office, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPinIcon className="h-6 w-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{office.city} Office</h3>
                      <p className="text-blue-100 mb-3">{office.address}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <PhoneIcon className="h-4 w-4 text-blue-200" />
                          <span className="text-blue-200">{office.phone}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <EnvelopeIcon className="h-4 w-4 text-blue-200" />
                          <span className="text-blue-200">{office.email}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <ClockIcon className="h-4 w-4 text-blue-200" />
                          <span className="text-blue-200">{office.hours}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Global Support */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GlobeAltIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">24/7 Global Support</h3>
                  <p className="text-blue-100 mb-4">
                    Our support team is available around the clock to assist you with any healthcare queries.
                  </p>
                  <div className="flex justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-blue-200 mt-2">Rated 4.9/5 by our users</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Quick Answers to Common Questions
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Before reaching out, you might find your answer in our comprehensive FAQ section
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { q: "How do I book an appointment?", a: "Simply search for doctors, select a time slot, and confirm your booking." },
                { q: "Is my data secure?", a: "Yes, we use bank-level encryption to protect all your personal and medical data." },
                { q: "Can I cancel appointments?", a: "You can cancel appointments up to 2 hours before the scheduled time." }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <QuestionMarkCircleIcon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3">{faq.q}</h3>
                  <p className="text-gray-600 text-sm">{faq.a}</p>
                </motion.div>
              ))}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              onClick={() => window.location.href = '/help'}
            >
              View All FAQs
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
