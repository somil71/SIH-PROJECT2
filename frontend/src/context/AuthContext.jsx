import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: true,
  error: null,
  doctor: null,
  isDoctor: false,
  isAdmin: false
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userData', JSON.stringify({
        user: action.payload.user,
        doctor: action.payload.doctor || null
      }));
      return {
        ...state,
        user: action.payload.user,
        doctor: action.payload.doctor || null,
        isDoctor: !!action.payload.doctor,
        isAdmin: action.payload.user?.role === 'admin',
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      return {
        ...state,
        user: null,
        doctor: null,
        isDoctor: false,
        isAdmin: false,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      return {
        ...state,
        user: null,
        doctor: null,
        isDoctor: false,
        isAdmin: false,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const refreshTimerRef = React.useRef(null);

  const scheduleRefresh = React.useCallback(() => {
    if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    // Refresh 12 minutes interval (access is 15m)
    refreshTimerRef.current = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/refresh', { method: 'POST', credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.token) localStorage.setItem('token', data.token);
        }
      } catch {}
    }, 12 * 60 * 1000);
  }, []);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Since we're using mock authentication, restore user data from token
          if (token.startsWith('mock_token_')) {
            // Extract user data from localStorage if available
            const userData = localStorage.getItem('userData');
            if (userData) {
              const parsedData = JSON.parse(userData);
              dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {
                  user: parsedData.user,
                  doctor: parsedData.doctor || null,
                  token
                }
              });
            } else {
              // Token exists but no user data, logout
              localStorage.removeItem('token');
              dispatch({ type: 'LOGOUT' });
            }
          } else {
            // For real API calls (when backend is connected)
            const response = await fetch('http://localhost:5000/api/auth/me', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {
                  user: data.user,
                  doctor: data.doctor || null,
                  token
                }
              });
              scheduleRefresh();
            } else {
              localStorage.removeItem('token');
              localStorage.removeItem('userData');
              dispatch({ type: 'LOGOUT' });
            }
          }
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Mock authentication - check predefined users
      const mockUsers = {
        'admin@healthcare.com': { role: 'admin', password: 'admin123', name: 'Healthcare Admin', id: 'admin_1' },
        'doctor@healthcare.com': { role: 'doctor', password: 'doctor123', name: 'Dr. John Smith', id: 'doctor_1' },
        'patient@healthcare.com': { role: 'patient', password: 'patient123', name: 'John Doe', id: 'patient_1' },
        'demo@demo.com': { role: 'patient', password: 'demo', name: 'Demo User', id: 'demo_1' }
      };
      
      const user = mockUsers[email];
      
      if (!user || user.password !== password) {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: 'Invalid email or password'
        });
        return { success: false, error: 'Invalid email or password' };
      }
      
      const userData = {
        user: {
          id: user.id,
          name: user.name,
          email: email,
          role: user.role
        },
        doctor: user.role === 'doctor' ? {
          specialization: 'General Medicine',
          experience: 10,
          consultationFee: 500
        } : null,
        token: `mock_token_${Date.now()}`
      };
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: userData
      });
      
      return { success: true, payload: userData };
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: 'Something went wrong. Please try again.'
      });
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'REGISTER_START' });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    try {
      // Mock registration - simulate successful registration
      const userId = `${userData.role}_${Date.now()}`;
      
      const registrationData = {
        user: {
          id: userId,
          name: userData.name,
          email: userData.email,
          role: userData.role || 'patient'
        },
        doctor: userData.role === 'doctor' ? {
          specialization: userData.specialization || 'General Medicine',
          experience: userData.experience || 0,
          consultationFee: userData.consultationFee || 500
        } : null,
        token: `mock_token_${Date.now()}`
      };
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: registrationData
      });
      
      return { success: true, payload: registrationData };
    } catch (error) {
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: 'Registration failed. Please try again.'
      });
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const registerDoctor = async (doctorData) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      const response = await fetch('http://localhost:5000/api/auth/register-doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(doctorData)
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({
          type: 'REGISTER_SUCCESS',
          payload: data
        });
        scheduleRefresh();
        return { success: true };
      } else {
        dispatch({
          type: 'REGISTER_FAILURE',
          payload: data.message || 'Doctor registration failed'
        });
        return { success: false, error: data.message };
      }
    } catch (error) {
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: 'Network error. Please try again.'
      });
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    localStorage.removeItem('adminRole');
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    dispatch({ type: 'LOGOUT' });
  };

  // Dev only: set an admin session without backend
  const devAdminLogin = () => {
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: { user: { role: 'admin', name: 'Dev Admin' }, doctor: null, token: 'dev-admin' }
    });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    registerDoctor,
    logout,
    clearError,
    devAdminLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
