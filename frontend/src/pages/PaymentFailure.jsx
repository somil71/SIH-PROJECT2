import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatAmount } from '../utils/razorpay';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addPaymentToHistory, clearCurrentPayment } = useApp();

  // Extract payment data from location state
  const paymentData = location.state?.paymentData;
  const errorMessage = location.state?.error || 'Payment failed. Please try again.';

  useEffect(() => {
    // If payment data exists, add it to history with failed status
    if (paymentData) {
      addPaymentToHistory({
        ...paymentData,
        timestamp: new Date().toISOString(),
        status: 'failed',
        error: errorMessage
      });
      clearCurrentPayment();
    }
  }, [paymentData, addPaymentToHistory, clearCurrentPayment, errorMessage]);

  const handleRetryPayment = () => {
    // Navigate back to the appointment page to retry payment
    if (paymentData?.appointmentId) {
      navigate(`/appointment/${paymentData.appointmentId}`);
    } else {
      navigate('/doctors');
    }
  };

  const handleContactSupport = () => {
    // Navigate to contact page or open support chat
    navigate('/contact');
  };

  const handleViewAppointments = () => {
    navigate('/my-appointments');
  };

  // Common failure reasons and solutions
  const troubleshootingTips = [
    {
      icon: '💳',
      title: 'Check your payment method',
      description: 'Ensure your card details are correct and you have sufficient balance.'
    },
    {
      icon: '🌐',
      title: 'Internet connectivity',
      description: 'Make sure you have a stable internet connection.'
    },
    {
      icon: '🏦',
      title: 'Bank restrictions',
      description: 'Some banks may block online transactions. Contact your bank if needed.'
    },
    {
      icon: '🔒',
      title: 'Enable online payments',
      description: 'Ensure online/international payments are enabled on your card.'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-red-500 text-white p-6 text-center">
          <div className="text-6xl mb-2">❌</div>
          <h1 className="text-2xl font-bold">Payment Failed</h1>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">Unfortunately, your payment could not be processed</p>
            {paymentData?.amount && (
              <div className="text-2xl font-bold text-red-600">
                {formatAmount(paymentData.amount)}
              </div>
            )}
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="text-red-500 text-xl mr-3">⚠️</div>
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Error Details</h3>
                <p className="text-sm text-red-700">
                  {errorMessage}
                </p>
              </div>
            </div>
          </div>

          {paymentData && (
            <div className="space-y-2 mb-6 text-sm">
              {paymentData.orderId && (
                <div className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono text-gray-900">
                    {paymentData.orderId}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-600">Attempted on:</span>
                <span className="text-gray-900">
                  {new Date().toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-3 mb-6">
            <button
              onClick={handleRetryPayment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
            
            <button
              onClick={handleViewAppointments}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              View My Appointments
            </button>
            
            <button
              onClick={handleContactSupport}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Contact Support
            </button>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <span className="text-blue-500 mr-2">💡</span>
              Troubleshooting Tips
            </h3>
            <div className="space-y-3">
              {troubleshootingTips.map((tip, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-lg mr-2 mt-0.5">{tip.icon}</span>
                  <div>
                    <h4 className="font-medium text-blue-900 text-sm">{tip.title}</h4>
                    <p className="text-xs text-blue-700 mt-0.5">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-3 bg-gray-100 rounded-lg text-center">
            <p className="text-xs text-gray-600">
              <strong>Note:</strong> No amount has been deducted from your account. 
              If you see any deduction, it will be auto-reversed within 5-7 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
