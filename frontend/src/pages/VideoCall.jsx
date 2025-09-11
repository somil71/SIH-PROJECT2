import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import {
  MicrophoneIcon,
  VideoCameraIcon,
  PhoneXMarkIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  PauseIcon,
  PlayIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ComputerDesktopIcon,
  ClockIcon,
  UserIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import {
  MicrophoneIcon as MicrophoneIconSolid,
  VideoCameraIcon as VideoCameraIconSolid
} from '@heroicons/react/24/solid';
import { dummyVideoCallSessions } from '../data/dummyData';

const socket = io('http://localhost:5000');

const VideoCall = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const [roomId, setRoomId] = useState('video-room-1');
  const [muted, setMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [connected, setConnected] = useState(false);
  const [callStartTime, setCallStartTime] = useState(null);
  const [callDuration, setCallDuration] = useState('00:00');
  const [isRecording, setIsRecording] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [speakerOn, setSpeakerOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callStatus, setCallStatus] = useState('waiting'); // waiting, connecting, connected, ended

  // Mock session data (in real app, get from props or API)
  const currentSession = {
    doctor: {
      name: 'Dr. Rajesh Kumar',
      specialization: 'Cardiologist',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
    },
    patient: {
      name: 'Amit Sharma',
      age: 45,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    appointmentType: 'Follow-up Consultation',
    scheduledTime: '10:00 AM - 10:30 AM'
  };

  // Timer effect for call duration
  useEffect(() => {
    let interval;
    if (callStartTime && callStatus === 'connected') {
      interval = setInterval(() => {
        const now = new Date();
        const diff = now - callStartTime;
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setCallDuration(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStartTime, callStatus]);

  useEffect(() => {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    pcRef.current = pc;
    
    pc.onicecandidate = (e) => {
      if (e.candidate) socket.emit('webrtc_ice_candidate', { roomId, candidate: e.candidate });
    };
    
    pc.ontrack = (e) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = e.streams[0];
        setCallStatus('connected');
        if (!callStartTime) {
          setCallStartTime(new Date());
        }
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        setCallStatus('connected');
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setCallStatus('ended');
      }
    };

    socket.emit('join_room', roomId);
    
    socket.on('webrtc_offer', async ({ sdp }) => {
      setCallStatus('connecting');
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('webrtc_answer', { roomId, sdp: pc.localDescription });
    });
    
    socket.on('webrtc_answer', async ({ sdp }) => {
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    });
    
    socket.on('webrtc_ice_candidate', async ({ candidate }) => {
      try { 
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    });

    return () => {
      socket.off('webrtc_offer');
      socket.off('webrtc_answer');
      socket.off('webrtc_ice_candidate');
      try { 
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach(track => track.stop());
        }
        pc.close(); 
      } catch (error) {
        console.error('Error cleaning up WebRTC:', error);
      }
    };
  }, [roomId, callStartTime]);

  const startCall = async () => {
    try {
      setCallStatus('connecting');
      const pc = pcRef.current;
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('webrtc_offer', { roomId, sdp: pc.localDescription });
      setConnected(true);
      setCallStartTime(new Date());
    } catch (error) {
      console.error('Error starting call:', error);
      alert('Failed to start call. Please check your camera and microphone permissions.');
    }
  };

  const toggleMute = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getAudioTracks().forEach(tr => tr.enabled = !tr.enabled);
    setMuted(prev => !prev);
  };

  const toggleCamera = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getVideoTracks().forEach(tr => tr.enabled = !tr.enabled);
    setCameraOn(prev => !prev);
  };

  const toggleSpeaker = () => {
    setSpeakerOn(prev => !prev);
    // In a real implementation, you'd control audio output routing
  };

  const toggleRecording = () => {
    setIsRecording(prev => !prev);
    // In a real implementation, you'd start/stop recording
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = pcRef.current.getSenders().find(s => s.track && s.track.kind === 'video');
        if (sender) {
          await sender.replaceTrack(videoTrack);
        }
        setIsScreenSharing(true);
        
        videoTrack.onended = () => {
          setIsScreenSharing(false);
          // Switch back to camera
          if (localStreamRef.current) {
            const cameraTrack = localStreamRef.current.getVideoTracks()[0];
            if (sender && cameraTrack) {
              sender.replaceTrack(cameraTrack);
            }
          }
        };
      } else {
        // Switch back to camera
        if (localStreamRef.current) {
          const cameraTrack = localStreamRef.current.getVideoTracks()[0];
          const sender = pcRef.current.getSenders().find(s => s.track && s.track.kind === 'video');
          if (sender && cameraTrack) {
            await sender.replaceTrack(cameraTrack);
          }
        }
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  };

  const endCall = () => {
    const pc = pcRef.current;
    const stream = localStreamRef.current;
    if (stream) stream.getTracks().forEach(t => t.stop());
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    try { pc.close(); } catch {}
    pcRef.current = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    setConnected(false);
    setMuted(false);
    setCameraOn(true);
    setCallStatus('ended');
    setCallStartTime(null);
    setCallDuration('00:00');
    setIsRecording(false);
  };

  const saveNotes = () => {
    // In a real implementation, save notes to database
    console.log('Saving consultation notes:', notes);
    alert('Consultation notes saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img
                  src={currentSession.doctor.avatar}
                  alt={currentSession.doctor.name}
                  className="w-12 h-12 rounded-full border-2 border-blue-200"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{currentSession.doctor.name}</h1>
                  <p className="text-blue-600 font-medium">{currentSession.doctor.specialization}</p>
                </div>
              </div>
              <div className="hidden md:block w-px h-12 bg-gray-200"></div>
              <div className="hidden md:block">
                <p className="text-sm text-gray-600">Patient: <span className="font-medium">{currentSession.patient.name}</span></p>
                <p className="text-sm text-gray-600">Type: <span className="font-medium">{currentSession.appointmentType}</span></p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {callStatus === 'connected' && (
                <div className="flex items-center space-x-2 bg-green-100 px-3 py-2 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <ClockIcon className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 font-medium text-sm">{callDuration}</span>
                </div>
              )}
              
              {isRecording && (
                <div className="flex items-center space-x-2 bg-red-100 px-3 py-2 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-700 font-medium text-sm">Recording</span>
                </div>
              )}
              
              <div className={`px-3 py-2 rounded-full text-sm font-medium ${
                callStatus === 'connected' ? 'bg-green-100 text-green-700' :
                callStatus === 'connecting' ? 'bg-yellow-100 text-yellow-700' :
                callStatus === 'ended' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {callStatus === 'connected' ? 'Connected' :
                 callStatus === 'connecting' ? 'Connecting...' :
                 callStatus === 'ended' ? 'Call Ended' :
                 'Waiting'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Video Area */}
          <div className="xl:col-span-3 space-y-6">
            {/* Remote Video */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black shadow-2xl">
              <div className="aspect-video relative">
                <video 
                  ref={remoteVideoRef} 
                  className="w-full h-full object-cover" 
                  playsInline 
                  autoPlay 
                />
                
                {/* Overlay for waiting state */}
                {callStatus !== 'connected' && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-indigo-900/80 flex items-center justify-center">
                    <div className="text-center text-white">
                      <UserIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-2xl font-semibold mb-2">
                        {callStatus === 'connecting' ? 'Connecting to Doctor...' :
                         callStatus === 'ended' ? 'Call Ended' :
                         `Waiting for ${currentSession.doctor.name}`}
                      </h3>
                      <p className="text-blue-200">
                        {callStatus === 'connecting' ? 'Please wait while we establish the connection' :
                         callStatus === 'ended' ? 'The consultation has ended' :
                         'The doctor will join shortly'}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Doctor info overlay */}
                {callStatus === 'connected' && (
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white">
                    <div className="flex items-center space-x-2">
                      <HeartIcon className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-medium">{currentSession.doctor.name}</span>
                    </div>
                  </div>
                )}
                
                {/* Call controls overlay */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center space-x-3 bg-black/50 backdrop-blur-sm rounded-2xl px-6 py-3">
                    <button
                      onClick={toggleMute}
                      className={`p-3 rounded-full transition-all duration-200 ${
                        muted 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                      title={muted ? 'Unmute' : 'Mute'}
                    >
                      {muted ? <MicrophoneIconSolid className="w-5 h-5" /> : <MicrophoneIcon className="w-5 h-5" />}
                    </button>
                    
                    <button
                      onClick={toggleCamera}
                      className={`p-3 rounded-full transition-all duration-200 ${
                        !cameraOn 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                      title={cameraOn ? 'Turn off camera' : 'Turn on camera'}
                    >
                      {cameraOn ? <VideoCameraIcon className="w-5 h-5" /> : <VideoCameraIconSolid className="w-5 h-5" />}
                    </button>
                    
                    <button
                      onClick={toggleSpeaker}
                      className={`p-3 rounded-full transition-all duration-200 ${
                        speakerOn 
                          ? 'bg-white/20 text-white hover:bg-white/30' 
                          : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                      title={speakerOn ? 'Mute speaker' : 'Unmute speaker'}
                    >
                      {speakerOn ? <SpeakerWaveIcon className="w-5 h-5" /> : <SpeakerXMarkIcon className="w-5 h-5" />}
                    </button>
                    
                    <button
                      onClick={toggleScreenShare}
                      className={`p-3 rounded-full transition-all duration-200 ${
                        isScreenSharing 
                          ? 'bg-blue-500 text-white hover:bg-blue-600' 
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                      title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
                    >
                      <ComputerDesktopIcon className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={toggleRecording}
                      className={`p-3 rounded-full transition-all duration-200 ${
                        isRecording 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                      title={isRecording ? 'Stop recording' : 'Start recording'}
                    >
                      {isRecording ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                    </button>
                    
                    <button
                      onClick={endCall}
                      className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
                      title="End call"
                    >
                      <PhoneXMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Start Call Button (when not connected) */}
            {!connected && callStatus === 'waiting' && (
              <div className="text-center">
                <button
                  onClick={startCall}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
                >
                  Start Consultation
                </button>
                <p className="text-gray-600 mt-3 text-sm">
                  Click to begin your video consultation with {currentSession.doctor.name}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Local Video Preview */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <VideoCameraIcon className="w-5 h-5 mr-2 text-blue-600" />
                Your Video
              </h3>
              <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video">
                <video 
                  ref={localVideoRef} 
                  className="w-full h-full object-cover" 
                  playsInline 
                  autoPlay 
                  muted 
                />
                {!cameraOn && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <UserIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                This is how you appear to the doctor
              </p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="w-full flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center">
                    <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                    <span>Chat</span>
                  </div>
                  <span className="text-xs bg-blue-200 px-2 py-1 rounded-full">New</span>
                </button>
                
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="w-full flex items-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <DocumentTextIcon className="w-5 h-5 mr-2" />
                  <span>Consultation Notes</span>
                </button>
              </div>
            </div>

            {/* Consultation Notes */}
            {showNotes && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Consultation Notes</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Add notes about the consultation..."
                />
                <button
                  onClick={saveNotes}
                  className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Save Notes
                </button>
              </div>
            )}

            {/* Patient Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Patient Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={currentSession.patient.avatar}
                    alt={currentSession.patient.name}
                    className="w-10 h-10 rounded-full border-2 border-gray-200"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{currentSession.patient.name}</p>
                    <p className="text-sm text-gray-500">Age: {currentSession.patient.age}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p><span className="font-medium">Appointment:</span> {currentSession.scheduledTime}</p>
                  <p><span className="font-medium">Type:</span> {currentSession.appointmentType}</p>
                </div>
              </div>
            </div>

            {/* Connection Quality */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Connection Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Video Quality:</span>
                  <span className="text-sm font-medium text-green-600">HD</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Audio Quality:</span>
                  <span className="text-sm font-medium text-green-600">Clear</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Network:</span>
                  <span className="text-sm font-medium text-green-600">Stable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCall


