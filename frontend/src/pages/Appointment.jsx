import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Payment from '../components/Payment';
import { formatAmount } from '../utils/razorpay';

const Appointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedDoctor, setCurrentPayment, addAppointment } = useApp();
  
  const [appointmentData, setAppointmentData] = useState({
    selectedDate: '',
    selectedTime: '',
    appointmentType: 'consultation',
    symptoms: '',
    medicalHistory: '',
    file: null
  });
  const [showPayment, setShowPayment] = useState(false);
  const [step, setStep] = useState(1); // 1: Appointment Details, 2: Payment

  // Mock doctor data (in real app, fetch from API using doctorId)
  const doctor = selectedDoctor || {
    _id: doctorId,
    name: 'Dr. Sample Doctor',
    speciality: 'General Medicine',
    experience: '10 years',
    fees: 500,
    image: '/placeholder-doctor.jpg'
  };

  // Generate available time slots
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM'
  ];

  const handleInputChange = (field, value) => {
    setAppointmentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setAppointmentData(prev => ({
      ...prev,
      file
    }));
  };

  const validateAppointmentData = () => {
    if (!appointmentData.selectedDate) {
      alert('Please select an appointment date');
      return false;
    }
    if (!appointmentData.selectedTime) {
      alert('Please select an appointment time');
      return false;
    }
    if (!user) {
      alert('Please login to book an appointment');
      navigate('/login');
      return false;
    }
    return true;
  };

  const handleProceedToPayment = () => {
    if (validateAppointmentData()) {
      setCurrentPayment({
        doctorId: doctor._id,
        doctorName: doctor.name,
        amount: doctor.fees,
        appointmentData,
        timestamp: new Date().toISOString()
      });
      setStep(2);
      setShowPayment(true);
    }
  };

  const handlePaymentSuccess = (paymentResult) => {
    // Create appointment record
    const newAppointment = {
      _id: Date.now().toString(), // Mock ID
      doctorId: doctor._id,
      doctorName: doctor.name,
      patientId: user._id,
      patientName: user.name,
      date: appointmentData.selectedDate,
      time: appointmentData.selectedTime,
      type: appointmentData.appointmentType,
      symptoms: appointmentData.symptoms,
      medicalHistory: appointmentData.medicalHistory,
      status: 'confirmed',
      paymentId: paymentResult.paymentId,
      amount: paymentResult.amount,
      createdAt: new Date().toISOString()
    };

    // Add to appointments
    addAppointment(newAppointment);

    // Navigate to success page
    navigate('/payment/success', {
      state: {
        paymentData: {
          ...paymentResult,
          doctorName: doctor.name,
          appointmentDate: appointmentData.selectedDate,
          appointmentTime: appointmentData.selectedTime
        }
      }
    });
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    navigate('/payment/failure', {
      state: {
        error,
        paymentData: {
          doctorName: doctor.name,
          amount: doctor.fees,
          appointmentId: doctorId
        }
      }
    });
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get maximum date (30 days from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  if (showPayment) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Complete Your Payment
              </h2>
              <p className="text-gray-600">
                Appointment with {doctor.name}
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Appointment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Doctor:</span>
                  <span className="text-blue-900 font-medium">{doctor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Date:</span>
                  <span className="text-blue-900 font-medium">                  {new Date(appointmentData.selectedDate).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Time:</span>
                  <span className="text-blue-900 font-medium">{appointmentData.selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Type:</span>
                  <span className="text-blue-900 font-medium capitalize">{appointmentData.appointmentType}</span>
                </div>
              </div>
            </div>

            <Payment
              amount={doctor.fees}
              description={`Consultation with ${doctor.name} - ${appointmentData.appointmentType}`}
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
              onClick={() => setStep(1)}
              className="w-full mt-4 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              ← Back to Appointment Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-3xl font-bold">Book Appointment</h1>
            <p className="mt-2 opacity-90">Schedule your consultation with {doctor.name}</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Doctor Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/64/64';
                  }}
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-gray-600">{doctor.speciality}</p>
                  <p className="text-sm text-gray-500">{doctor.experience} experience</p>
                  <p className="text-lg font-bold text-blue-600 mt-1">
                    Consultation Fee: {formatAmount(doctor.fees)}
                  </p>
                </div>
              </div>
            </div>

            {/* Appointment Form */}
            <form className="space-y-6">
              {/* Date Selection */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date *
                  </label>
                  <input
                    type="date"
                    value={appointmentData.selectedDate}
                    min={getMinDate()}
                    max={getMaxDate()}
                    onChange={(e) => handleInputChange('selectedDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time *
                  </label>
                  <select
                    value={appointmentData.selectedTime}
                    onChange={(e) => handleInputChange('selectedTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose time slot</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Appointment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'consultation', label: 'General Consultation' },
                    { value: 'followup', label: 'Follow-up Visit' },
                    { value: 'emergency', label: 'Emergency' },
                    { value: 'checkup', label: 'Routine Check-up' }
                  ].map((type) => (
                    <label key={type.value} className="flex items-center">
                      <input
                        type="radio"
                        name="appointmentType"
                        value={type.value}
                        checked={appointmentData.appointmentType === type.value}
                        onChange={(e) => handleInputChange('appointmentType', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Symptoms/Chief Complaint
                </label>
                <textarea
                  value={appointmentData.symptoms}
                  onChange={(e) => handleInputChange('symptoms', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your current symptoms or reason for visit"
                />
              </div>

              {/* Medical History */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relevant Medical History
                </label>
                <textarea
                  value={appointmentData.medicalHistory}
                  onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Previous surgeries, medications, allergies, chronic conditions, etc."
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Medical Reports (Optional)
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Accepted formats: PDF, JPG, PNG (Max 5MB)
                </p>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6 border-t">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleProceedToPayment}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Appointment