import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  doctors: [],
  appointments: [],
  specializations: [],
  selectedDoctor: null,
  loading: false,
  error: null,
  filters: {
    specialization: '',
    search: '',
    minRating: '',
    maxFee: '',
    sortBy: 'newest'
  },
  payment: {
    currentPayment: null,
    paymentHistory: [],
    isProcessing: false,
    lastPaymentResult: null
  }
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'SET_DOCTORS':
      return {
        ...state,
        doctors: action.payload,
        loading: false
      };
    case 'SET_APPOINTMENTS':
      return {
        ...state,
        appointments: action.payload,
        loading: false
      };
    case 'SET_SPECIALIZATIONS':
      return {
        ...state,
        specializations: action.payload
      };
    case 'SET_SELECTED_DOCTOR':
      return {
        ...state,
        selectedDoctor: action.payload
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: {
          specialization: '',
          search: '',
          minRating: '',
          maxFee: '',
          sortBy: 'newest'
        }
      };
    case 'ADD_APPOINTMENT':
      return {
        ...state,
        appointments: [action.payload, ...state.appointments]
      };
    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(apt =>
          apt._id === action.payload._id ? action.payload : apt
        )
      };
    case 'CANCEL_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(apt =>
          apt._id === action.payload._id 
            ? { ...apt, status: 'cancelled', cancelledAt: action.payload.cancelledAt }
            : apt
        )
      };
    case 'SET_PAYMENT_PROCESSING':
      return {
        ...state,
        payment: {
          ...state.payment,
          isProcessing: action.payload
        }
      };
    case 'SET_CURRENT_PAYMENT':
      return {
        ...state,
        payment: {
          ...state.payment,
          currentPayment: action.payload
        }
      };
    case 'ADD_PAYMENT_TO_HISTORY':
      return {
        ...state,
        payment: {
          ...state.payment,
          paymentHistory: [action.payload, ...state.payment.paymentHistory],
          lastPaymentResult: action.payload
        }
      };
    case 'CLEAR_CURRENT_PAYMENT':
      return {
        ...state,
        payment: {
          ...state.payment,
          currentPayment: null
        }
      };
    case 'SET_LAST_PAYMENT_RESULT':
      return {
        ...state,
        payment: {
          ...state.payment,
          lastPaymentResult: action.payload
        }
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const setDoctors = (doctors) => {
    dispatch({ type: 'SET_DOCTORS', payload: doctors });
  };

  const setAppointments = (appointments) => {
    dispatch({ type: 'SET_APPOINTMENTS', payload: appointments });
  };

  const setSpecializations = (specializations) => {
    dispatch({ type: 'SET_SPECIALIZATIONS', payload: specializations });
  };

  const setSelectedDoctor = (doctor) => {
    dispatch({ type: 'SET_SELECTED_DOCTOR', payload: doctor });
  };

  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const addAppointment = (appointment) => {
    dispatch({ type: 'ADD_APPOINTMENT', payload: appointment });
  };

  const updateAppointment = (appointment) => {
    dispatch({ type: 'UPDATE_APPOINTMENT', payload: appointment });
  };

  const cancelAppointment = (appointmentId, cancelledAt) => {
    dispatch({ 
      type: 'CANCEL_APPOINTMENT', 
      payload: { _id: appointmentId, cancelledAt } 
    });
  };

  // Payment-related actions
  const setPaymentProcessing = (isProcessing) => {
    dispatch({ type: 'SET_PAYMENT_PROCESSING', payload: isProcessing });
  };

  const setCurrentPayment = (paymentData) => {
    dispatch({ type: 'SET_CURRENT_PAYMENT', payload: paymentData });
  };

  const addPaymentToHistory = (paymentResult) => {
    dispatch({ type: 'ADD_PAYMENT_TO_HISTORY', payload: paymentResult });
  };

  const clearCurrentPayment = () => {
    dispatch({ type: 'CLEAR_CURRENT_PAYMENT' });
  };

  const setLastPaymentResult = (result) => {
    dispatch({ type: 'SET_LAST_PAYMENT_RESULT', payload: result });
  };

  const value = {
    ...state,
    setLoading,
    setError,
    clearError,
    setDoctors,
    setAppointments,
    setSpecializations,
    setSelectedDoctor,
    setFilters,
    clearFilters,
    addAppointment,
    updateAppointment,
    cancelAppointment,
    // Payment functions
    setPaymentProcessing,
    setCurrentPayment,
    addPaymentToHistory,
    clearCurrentPayment,
    setLastPaymentResult
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
