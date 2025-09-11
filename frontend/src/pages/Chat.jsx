import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { 
  PaperAirplaneIcon, 
  PaperClipIcon, 
  FaceSmileIcon, 
  VideoCameraIcon,
  PhoneIcon,
  InformationCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';
import { dummyChatMessages, getDoctorById } from '../data/dummyData';

const socket = io('http://localhost:5000');

const Chat = () => {
  const [roomId, setRoomId] = useState('room1');
  const [messages, setMessages] = useState(dummyChatMessages.filter(msg => msg.roomId === 'room1'));
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(['Dr. Rajesh Kumar']);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Mock current user (in real app, get from auth context)
  const currentUser = {
    id: 'patient1',
    name: 'Amit Sharma',
    type: 'patient',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  };

  const chatPartner = {
    id: 'user1',
    name: 'Dr. Rajesh Kumar',
    type: 'doctor',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=40&h=40&fit=crop&crop=face',
    specialization: 'Cardiologist',
    status: 'online'
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket.emit('join_room', roomId);
    const onMsg = (payload) => setMessages((prev) => [...prev, payload]);
    socket.on('chat_message', onMsg);
    socket.on('user_typing', () => setIsTyping(true));
    socket.on('user_stop_typing', () => setIsTyping(false));
    
    return () => {
      socket.off('chat_message', onMsg);
      socket.off('user_typing');
      socket.off('user_stop_typing');
    };
  }, [roomId]);

  const send = () => {
    if (!input.trim() && !selectedFile) return;
    
    const newMessage = {
      id: Date.now().toString(),
      roomId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderType: currentUser.type,
      message: input,
      timestamp: new Date().toISOString(),
      type: selectedFile ? 'file' : 'text',
      fileName: selectedFile?.name,
      read: false
    };

    socket.emit('chat_message', newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setSelectedFile(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getMessageIcon = (message) => {
    if (message.type === 'file') {
      return <PaperClipIcon className="w-4 h-4" />;
    }
    if (message.senderType === 'doctor') {
      return <HeartIcon className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  const MessageBubble = ({ message, isOwn }) => {
    const isFile = message.type === 'file';
    const isUrgent = message.message?.toLowerCase().includes('urgent') || message.message?.toLowerCase().includes('emergency');
    
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end max-w-xs lg:max-w-md`}>
          {!isOwn && (
            <img
              src={chatPartner.avatar}
              alt={message.senderName}
              className="w-8 h-8 rounded-full mr-2"
            />
          )}
          <div className={`relative px-4 py-2 rounded-2xl ${
            isOwn 
              ? 'bg-blue-600 text-white rounded-br-sm' 
              : 'bg-gray-100 text-gray-900 rounded-bl-sm'
          } ${isUrgent ? 'ring-2 ring-red-500 ring-opacity-50' : ''}`}>
            {isUrgent && (
              <ExclamationTriangleIcon className="w-4 h-4 text-red-500 inline mr-1" />
            )}
            {isFile ? (
              <div className="flex items-center space-x-2">
                <PaperClipIcon className="w-4 h-4" />
                <span className="text-sm font-medium">{message.fileName}</span>
                <button className="text-xs underline hover:no-underline">
                  Download
                </button>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap">{message.message}</p>
            )}
            <div className={`flex items-center mt-1 space-x-1 ${
              isOwn ? 'text-blue-200' : 'text-gray-500'
            }`}>
              <ClockIcon className="w-3 h-3" />
              <span className="text-xs">{formatTime(message.timestamp)}</span>
              {isOwn && message.read && (
                <CheckCircleIcon className="w-3 h-3 text-green-400" />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={chatPartner.avatar}
                    alt={chatPartner.name}
                    className="w-12 h-12 rounded-full border-2 border-white/20"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{chatPartner.name}</h2>
                  <p className="text-blue-100 text-sm">{chatPartner.specialization}</p>
                  <p className="text-blue-200 text-xs flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                    Online now
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <PhoneIcon className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <VideoCameraIcon className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <InformationCircleIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-amber-400 mr-2" />
              <p className="text-sm text-amber-700">
                <span className="font-medium">Medical Consultation Notice:</span> This chat is for medical consultation purposes. 
                For emergencies, please call 108 or visit your nearest emergency room.
              </p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-96 lg:h-[500px] overflow-y-auto p-6 bg-gray-50">
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id || index}
                message={message}
                isOwn={message.senderId === currentUser.id}
              />
            ))}
            
            {isTyping && (
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src={chatPartner.avatar}
                  alt="Doctor"
                  className="w-8 h-8 rounded-full"
                />
                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* File Preview */}
          {selectedFile && (
            <div className="px-6 py-3 bg-blue-50 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <PaperClipIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-700">{selectedFile.name}</span>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 bg-white border-t">
            <div className="flex items-end space-x-4">
              {/* File Upload */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <PaperClipIcon className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />

              {/* Message Input */}
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                  rows={1}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
                
                {/* Emoji Picker Button */}
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute right-3 bottom-3 p-1 text-gray-400 hover:text-gray-600"
                >
                  <FaceSmileIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Send Button */}
              <button
                onClick={send}
                disabled={!input.trim() && !selectedFile}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  input.trim() || selectedFile
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors">
                  Request Prescription
                </button>
                <button className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors">
                  Schedule Follow-up
                </button>
                <button className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors">
                  Share Reports
                </button>
              </div>
              
              <div className="text-xs text-gray-500">
                End-to-end encrypted • HIPAA compliant
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat


