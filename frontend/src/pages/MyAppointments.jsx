import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI, appointmentAPI } from '../utils/api';
import { formatDate, formatTime, formatDateTime, getStatusColor, getStatusText } from '../utils/api';

const MyAppointments = () => {
  const { isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [filter, setFilter] = useState('all');

  // Check for development bypass
  const devBypass = localStorage.getItem('devBypass') === 'true';

  useEffect(() => {
    if (isAuthenticated || devBypass) {
      fetchAppointments();
    }
  }, [isAuthenticated, devBypass, currentPage, filter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getAppointments(currentPage, 10);
      setAppointments(data.appointments);
      setPagination(data.pagination);
    } catch (error) {
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await appointmentAPI.cancelAppointment(appointmentId, 'Patient requested cancellation');
      fetchAppointments(); // Refresh the list
      alert('Appointment cancelled successfully');
    } catch (error) {
      alert('Failed to cancel appointment: ' + error.message);
    }
  };

  const handleAddReview = async (appointmentId, rating, comment) => {
    try {
      await appointmentAPI.addReview(appointmentId, rating, comment);
      fetchAppointments(); // Refresh the list
      alert('Review added successfully');
    } catch (error) {
      alert('Failed to add review: ' + error.message);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') {
      return ['scheduled', 'confirmed'].includes(appointment.status) && 
             new Date(appointment.appointmentDate) >= new Date();
    }
    if (filter === 'completed') return appointment.status === 'completed';
    if (filter === 'cancelled') return appointment.status === 'cancelled';
    return true;
  });

  if (!isAuthenticated && !devBypass) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view your appointments.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            My Appointments
          </h1>
          <p className="text-xl text-gray-600">
            Manage your healthcare appointments
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Appointments' },
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'completed', label: 'Completed' },
              { key: 'cancelled', label: 'Cancelled' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length > 0 ? (
          <>
            <div className="space-y-6">
              {filteredAppointments.map((appointment) => (
                <div key={appointment._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <img
                          src={appointment.doctor?.user?.profilePicture || '/default-doctor.png'}
                          alt={appointment.doctor?.user?.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900">
                            Dr. {appointment.doctor?.user?.name}
                          </h3>
                          <p className="text-blue-600 font-medium">
                            {appointment.doctor?.specialization}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-gray-600">
                              {formatDateTime(appointment.appointmentDate, appointment.appointmentTime)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                              {getStatusText(appointment.status)}
                            </span>
                          </div>
                          {appointment.reason && (
                            <p className="text-gray-600 mt-2">
                              <strong>Reason:</strong> {appointment.reason}
                            </p>
                          )}
                          {appointment.consultationType && (
                            <p className="text-gray-600">
                              <strong>Type:</strong> {appointment.consultationType}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          ₹{appointment.payment?.amount}
                        </div>
                        <div className="text-sm text-gray-600">
                          {getStatusText(appointment.payment?.status)}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {appointment.status === 'scheduled' && (
                          <button
                            onClick={() => handleCancelAppointment(appointment._id)}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                        
                        {appointment.status === 'completed' && !appointment.reviews?.length && (
                          <ReviewModal
                            appointmentId={appointment._id}
                            doctorName={appointment.doctor?.user?.name}
                            onAddReview={handleAddReview}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  {(appointment.symptoms || appointment.notes) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      {appointment.symptoms && (
                        <div className="mb-2">
                          <strong className="text-gray-900">Symptoms:</strong>
                          <p className="text-gray-600">{appointment.symptoms}</p>
                        </div>
                      )}
                      {appointment.notes && (
                        <div>
                          <strong className="text-gray-900">Doctor's Notes:</strong>
                          <p className="text-gray-600">{appointment.notes}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Prescription */}
                  {appointment.prescription && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Prescription</h4>
                      {appointment.prescription.medications?.length > 0 && (
                        <div className="mb-4">
                          <h5 className="font-medium text-gray-700 mb-2">Medications:</h5>
                          <div className="space-y-2">
                            {appointment.prescription.medications.map((med, index) => (
                              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                <div className="font-medium">{med.name}</div>
                                <div className="text-sm text-gray-600">
                                  {med.dosage} - {med.frequency} - {med.duration}
                                </div>
                                {med.instructions && (
                                  <div className="text-sm text-gray-600 mt-1">
                                    Instructions: {med.instructions}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {appointment.prescription.instructions && (
                        <div className="mb-2">
                          <strong className="text-gray-900">Instructions:</strong>
                          <p className="text-gray-600">{appointment.prescription.instructions}</p>
                        </div>
                      )}
                      {appointment.prescription.followUpDate && (
                        <div>
                          <strong className="text-gray-900">Follow-up Date:</strong>
                          <p className="text-gray-600">{formatDate(appointment.prescription.followUpDate)}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={!pagination.hasPrev}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-2 border rounded-lg ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                    disabled={!pagination.hasNext}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              No appointments found.
            </div>
            <button
              onClick={() => window.location.href = '/doctors'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Book an Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Review Modal Component
const ReviewModal = ({ appointmentId, doctorName, onAddReview }) => {
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddReview(appointmentId, rating, comment);
    setShowModal(false);
    setRating(0);
    setComment('');
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
      >
        Add Review
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Review Dr. {doctorName}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`w-8 h-8 ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your experience..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rating === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MyAppointments;