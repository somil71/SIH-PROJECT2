const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Generic API request function
let accessToken = localStorage.getItem('token');

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    credentials: 'include',
    headers: getAuthHeaders(),
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (response.ok) return data;

    // If unauthorized, attempt refresh once
    if (response.status === 401) {
      try {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include'
        });
        const refreshData = await refreshRes.json();
        if (refreshRes.ok && refreshData.token) {
          localStorage.setItem('token', refreshData.token);
          // retry original request with new token
          const retry = await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
              ...(options.headers || {}),
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${refreshData.token}`
            }
          });
          const retryData = await retry.json();
          if (retry.ok) return retryData;
          throw new Error(retryData.message || 'Request failed');
        }
      } catch {}
    }

    throw new Error(data.message || 'Something went wrong');
  } catch (error) {
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (email, password) => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (userData) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  registerDoctor: (doctorData) =>
    apiRequest('/auth/register-doctor', {
      method: 'POST',
      body: JSON.stringify(doctorData)
    }),

  getCurrentUser: () =>
    apiRequest('/auth/me'),

  logout: () =>
    apiRequest('/auth/logout', { method: 'POST' })
};

// User API
export const userAPI = {
  getProfile: () =>
    apiRequest('/users/profile'),

  updateProfile: (userData) =>
    apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    }),

  uploadProfilePicture: (profilePicture) =>
    apiRequest('/users/profile/picture', {
      method: 'POST',
      body: JSON.stringify({ profilePicture })
    }),

  getAppointments: (page = 1, limit = 10) =>
    apiRequest(`/users/appointments?page=${page}&limit=${limit}`),

  getStats: () =>
    apiRequest('/users/stats'),

  deleteAccount: () =>
    apiRequest('/users/account', { method: 'DELETE' })
};

// Doctor API
export const doctorAPI = {
  getAllDoctors: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/doctors?${queryParams}`);
  },

  getDoctorById: (id) =>
    apiRequest(`/doctors/${id}`),

  getSpecializations: () =>
    apiRequest('/doctors/specializations'),

  getAvailableSlots: (doctorId, date) =>
    apiRequest(`/doctors/${doctorId}/available-slots?date=${date}`),

  getDoctorProfile: () =>
    apiRequest('/doctors/profile/me'),

  updateDoctorProfile: (doctorData) =>
    apiRequest('/doctors/profile/me', {
      method: 'PUT',
      body: JSON.stringify(doctorData)
    }),

  getDoctorAppointments: (page = 1, limit = 10, filters = {}) => {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    }).toString();
    return apiRequest(`/doctors/appointments/me?${queryParams}`);
  },

  getDoctorStats: () =>
    apiRequest('/doctors/stats/me')
};

// Appointment API
export const appointmentAPI = {
  bookAppointment: (appointmentData) =>
    apiRequest('/appointments/book', {
      method: 'POST',
      body: JSON.stringify(appointmentData)
    }),

  getAppointmentById: (id) =>
    apiRequest(`/appointments/${id}`),

  updateAppointment: (id, updateData) =>
    apiRequest(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    }),

  cancelAppointment: (id, cancellationReason) =>
    apiRequest(`/appointments/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ cancellationReason })
    }),

  addReview: (id, rating, comment) =>
    apiRequest(`/appointments/${id}/review`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment })
    }),

  getAllAppointments: (page = 1, limit = 10, filters = {}) => {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    }).toString();
    return apiRequest(`/appointments?${queryParams}`);
  }
};

// Payments API
export const paymentsAPI = {
  createOrder: (doctorId) =>
    apiRequest('/payments/create-order', { method: 'POST', body: JSON.stringify({ doctorId }) }),
  verify: (payload) =>
    apiRequest('/payments/verify', { method: 'POST', body: JSON.stringify(payload) })
};

// Utility functions
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (time) => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatDateTime = (date, time) => {
  const dateTime = new Date(`${date}T${time}`);
  return dateTime.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const getStatusColor = (status) => {
  const colors = {
    scheduled: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    'no-show': 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getStatusText = (status) => {
  const statusTexts = {
    scheduled: 'Scheduled',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    'no-show': 'No Show'
  };
  return statusTexts[status] || status;
};
