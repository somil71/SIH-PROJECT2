import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  ShieldCheckIcon,
  HeartIcon,
  StarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Emergency Banner */}
      <div className="bg-red-600 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-6 text-white">
            <div className="flex items-center space-x-2">
              <PhoneIcon className="h-5 w-5" />
              <span className="font-semibold">Emergency: 911</span>
            </div>
            <div className="hidden md:block h-4 w-px bg-red-400" />
            <div className="flex items-center space-x-2">
              <PhoneIcon className="h-5 w-5" />
              <span className="font-semibold">24/7 Medical Helpline: +1 (800) 123-4567</span>
            </div>
            <div className="hidden lg:block h-4 w-px bg-red-400" />
            <div className="hidden lg:flex items-center space-x-2">
              <HeartIcon className="h-5 w-5" />
              <span className="font-semibold">Poison Control: +1 (800) 222-1222</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-600 p-2 rounded-lg">
                <span className="text-2xl">🏥</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">HealthCare+</h3>
                <p className="text-blue-200 text-sm">Trusted Medical Platform</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your trusted healthcare companion providing 24/7 access to certified doctors, 
              secure consultations, and comprehensive medical services. 
              HIPAA-compliant and FDA-approved platform.
            </p>
            
            {/* Certifications */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white mb-3">Certifications & Compliance</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center space-x-2 bg-green-600/20 px-3 py-1 rounded-full">
                  <ShieldCheckIcon className="h-4 w-4 text-green-400" />
                  <span className="text-green-200 text-xs font-medium">HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2 bg-blue-600/20 px-3 py-1 rounded-full">
                  <ShieldCheckIcon className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-200 text-xs font-medium">FDA Approved</span>
                </div>
                <div className="flex items-center space-x-2 bg-purple-600/20 px-3 py-1 rounded-full">
                  <StarIcon className="h-4 w-4 text-purple-400" />
                  <span className="text-purple-200 text-xs font-medium">Joint Commission</span>
                </div>
                <div className="flex items-center space-x-2 bg-orange-600/20 px-3 py-1 rounded-full">
                  <GlobeAltIcon className="h-4 w-4 text-orange-400" />
                  <span className="text-orange-200 text-xs font-medium">ISO 27001</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><button onClick={() => navigate('/')} className="text-gray-300 hover:text-white transition-colors">Home</button></li>
              <li><button onClick={() => navigate('/doctors')} className="text-gray-300 hover:text-white transition-colors">Find Doctors</button></li>
              <li><button onClick={() => navigate('/about')} className="text-gray-300 hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => navigate('/contact')} className="text-gray-300 hover:text-white transition-colors">Contact</button></li>
              <li><button onClick={() => navigate('/patient/dashboard')} className="text-gray-300 hover:text-white transition-colors">Patient Portal</button></li>
              <li><button onClick={() => navigate('/doctor/dashboard')} className="text-gray-300 hover:text-white transition-colors">Doctor Portal</button></li>
            </ul>
          </div>

          {/* Medical Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Medical Services</h4>
            <ul className="space-y-3">
              <li><span className="text-gray-300">Telemedicine</span></li>
              <li><span className="text-gray-300">Specialist Consultations</span></li>
              <li><span className="text-gray-300">Prescription Management</span></li>
              <li><span className="text-gray-300">Lab Results</span></li>
              <li><span className="text-gray-300">Health Monitoring</span></li>
              <li><span className="text-gray-300">Mental Health Support</span></li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">123 Medical Center Drive</p>
                  <p className="text-gray-300 text-sm">Healthcare City, HC 12345</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">+1 (555) 123-4567</p>
                  <p className="text-gray-400 text-xs">Mon-Fri 8AM-6PM</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-purple-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">support@healthcare.com</p>
                  <p className="text-gray-400 text-xs">24/7 Email Support</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <ClockIcon className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium text-sm mb-1">Operating Hours</p>
                  <p className="text-gray-300 text-xs">24/7 Emergency Care</p>
                  <p className="text-gray-300 text-xs">Mon-Fri: 6AM-10PM</p>
                  <p className="text-gray-300 text-xs">Sat-Sun: 8AM-8PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legal & Compliance Footer */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-300">
              <button className="hover:text-white transition-colors">Privacy Policy</button>
              <button className="hover:text-white transition-colors">Terms of Service</button>
              <button className="hover:text-white transition-colors">HIPAA Notice</button>
              <button className="hover:text-white transition-colors">Patient Rights</button>
              <button className="hover:text-white transition-colors">Accessibility</button>
              <button className="hover:text-white transition-colors">Non-Discrimination</button>
            </div>
            
            <div className="text-center lg:text-right">
              <p className="text-gray-400 text-sm">
                © {currentYear} HealthCare+ Medical Platform. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Licensed Healthcare Provider • NPI: 1234567890
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="bg-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-gray-400 leading-relaxed">
            <strong className="text-gray-300">Medical Disclaimer:</strong> 
            The information provided on this platform is for educational purposes only and is not intended as a substitute for 
            professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified 
            health provider with any questions you may have regarding a medical condition. 
            <strong className="text-red-300">In case of emergency, call 911 immediately.</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


