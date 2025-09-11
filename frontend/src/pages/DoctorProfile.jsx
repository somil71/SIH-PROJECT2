import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doctorAPI, appointmentAPI, paymentsAPI } from '../utils/api';
import { formatDate, formatTime, getStatusColor, getStatusText } from '../utils/api';
import groupProfile from '../assets/assets_frontend/group_profiles.png';
import {
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  ClockIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  CheckBadgeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { dummyDoctors, generateAvailableSlots } from '../data/dummyData';
import Payment from '../components/Payment';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [isFavorite, setIsFavorite] = useState(false);
  const [bookingStep, setBookingStep] = useState(1); // 1: Details, 2: Payment
  const [bookingData, setBookingData] = useState({
    reason: '',
    symptoms: '',
    medicalHistory: '',
    currentMedications: '',
    allergies: '',
    consultationType: 'in-person'
  });

  // Initialize with dummy data
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        // In real app: const doctorData = await doctorAPI.getDoctorById(id);
        // Using dummy data for prototype
        const foundDoctor = dummyDoctors.find(d => d._id === id);
        if (foundDoctor) {
          setDoctor(foundDoctor);
        } else {
          setError('Doctor not found');
        }
      } catch (error) {
        setError('Failed to load doctor profile');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  useEffect(() => {
    if (selectedDate && doctor) {
      const slots = generateAvailableSlots(doctor._id, selectedDate);
      setAvailableSlots(slots);
    }
  }, [selectedDate, doctor]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert('Please select date and time');
      return;
    }

    // Move to payment step
    setBookingStep(2);
    setShowPayment(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentSuccess = (paymentResult) => {
    // In real app, save appointment to backend
    alert('Appointment booked successfully!');
    navigate('/my-appointments');
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    alert('Payment failed. Please try again.');
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <StarIconSolid
        key={index}
        className={`w-5 h-5 ${
          index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Doctor Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/doctors')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Back to Doctors
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/doctors')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Doctors
        </button>

        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete Payment</h3>
                  <p className="text-gray-600">Consultation with {doctor.user?.name}</p>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Doctor:</span>
                      <span className="text-blue-900 font-medium">{doctor.user?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Date:</span>
                      <span className="text-blue-900 font-medium">
                        {new Date(selectedDate).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Time:</span>
                      <span className="text-blue-900 font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Type:</span>
                      <span className="text-blue-900 font-medium capitalize">{bookingData.consultationType}</span>
                    </div>
                  </div>
                </div>

                <Payment
                  amount={doctor.consultationFee}
                  description={`Consultation with ${doctor.user?.name}`}
                  customerData={{
                    name: user?.name || '',
                    email: user?.email || '',
                    phone: user?.phone || ''
                  }}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  buttonText="Pay & Book Appointment"
                />

                <button
                  onClick={() => {
                    setShowPayment(false);
                    setBookingStep(1);
                  }}
                  className="w-full mt-4 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back to Appointment Details
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Doctor Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <img
              src={doctor.user?.profilePicture || groupProfile}
              alt={doctor.user?.name}
              className="w-32 h-32 rounded-full object-cover"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dr. {doctor.user?.name}
              </h1>
              <p className="text-xl text-blue-600 font-medium mb-2">
                {doctor.specialization}
              </p>
              <p className="text-gray-600 mb-4">
                {doctor.experience} years of experience
              </p>
              
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(doctor.rating?.average || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {doctor.rating?.average || 0} ({doctor.rating?.count || 0} reviews)
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-gray-900">
                  ₹{doctor.consultationFee}
                </div>
                <div className="text-gray-600">per consultation</div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <button onClick={() => setShowBookingForm(!showBookingForm)} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Book Appointment</button>
              <button onClick={async () => {
                try {
                  setShowPayment(true)
                  const o = await paymentsAPI.createOrder(doctor._id)
                  setOrder(o)
                } catch {}
              }} className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">Pay Fee</button>
              <a href={`tel:${doctor.user?.phone || ''}`} className="bg-emerald-600 text-white px-6 py-3 rounded-lg text-center hover:bg-emerald-700">Call</a>
              <a href={`https://wa.me/${doctor.user?.phone || ''}`} target="_blank" rel="noreferrer" className="bg-green-500 text-white px-6 py-3 rounded-lg text-center hover:bg-green-600">WhatsApp</a>
              <a href="#" className="bg-purple-600 text-white px-6 py-3 rounded-lg text-center hover:bg-purple-700">Video Call</a>
              <button
                onClick={() => navigate('/doctors')}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Back to Doctors
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Modal */}
          {showPayment && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">Pay Consultation Fee</h3>
                <p className="mb-4">Amount: ₹{doctor.consultationFee}</p>
                {order ? (
                  <div className="space-y-3">
                    <button
                      className="w-full bg-black text-white py-2 rounded"
                      onClick={() => {
                        const options = {
                          key: order.key,
                          amount: order.amount,
                          currency: order.currency,
                          name: 'Consultation Fee',
                          order_id: order.orderId,
                          handler: async function (resp) {
                            await paymentsAPI.verify(resp)
                            alert('Payment successful')
                            setShowPayment(false)
                          }
                        }
                        const rzp = new window.Razorpay(options)
                        rzp.open()
                      }}
                    >Pay with Razorpay</button>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Creating order...</div>
                )}
                <button onClick={() => setShowPayment(false)} className="mt-4 w-full bg-gray-100 py-2 rounded">Close</button>
              </div>
            </div>
          )}
          {/* Doctor Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            {doctor.bio && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-600 leading-relaxed">{doctor.bio}</p>
              </div>
            )}

            {/* Education */}
            {doctor.education && doctor.education.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Education</h2>
                <div className="space-y-4">
                  {doctor.education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.institution}</p>
                      <p className="text-sm text-gray-500">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {doctor.certifications && doctor.certifications.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Certifications</h2>
                <div className="space-y-3">
                  {doctor.certifications.map((cert, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                        <p className="text-gray-600">{cert.issuingOrganization}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {cert.date ? new Date(cert.date).getFullYear() : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {doctor.languages && doctor.languages.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Languages</h2>
                <div className="flex flex-wrap gap-2">
                  {doctor.languages.map((language, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {doctor.reviews && doctor.reviews.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews</h2>
                <div className="space-y-4">
                  {doctor.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 font-semibold text-gray-900">
                            {review.user?.name || 'Anonymous'}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(review.date)}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-gray-600">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            {showBookingForm && (
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Appointment</h2>
                
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {selectedDate && availableSlots.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Time Slots
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {availableSlots.map((slot, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setSelectedTime(slot.startTime)}
                            className={`p-2 text-sm rounded-lg border ${
                              selectedTime === slot.startTime
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {formatTime(slot.startTime)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consultation Type
                    </label>
                    <select
                      name="consultationType"
                      value={bookingData.consultationType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="in-person">In-Person</option>
                      <option value="video">Video Call</option>
                      <option value="phone">Phone Call</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Visit *
                    </label>
                    <textarea
                      name="reason"
                      value={bookingData.reason}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      placeholder="Please describe your symptoms or reason for the appointment"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Symptoms
                    </label>
                    <textarea
                      name="symptoms"
                      value={bookingData.symptoms}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Describe your symptoms in detail"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical History
                    </label>
                    <textarea
                      name="medicalHistory"
                      value={bookingData.medicalHistory}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Any relevant medical history"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Medications
                    </label>
                    <textarea
                      name="currentMedications"
                      value={bookingData.currentMedications}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="List any medications you're currently taking"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allergies
                    </label>
                    <textarea
                      name="allergies"
                      value={bookingData.allergies}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Any known allergies"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedDate || !selectedTime}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Book Appointment - ₹{doctor.consultationFee}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
