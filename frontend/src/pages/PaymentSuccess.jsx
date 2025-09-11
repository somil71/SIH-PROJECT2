import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatAmount } from '../utils/razorpay';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addPaymentToHistory, clearCurrentPayment } = useApp();

  // Extract payment data from location state
  const paymentData = location.state?.paymentData;

  useEffect(() => {
    // If payment data exists, add it to history and clear current payment
    if (paymentData) {
      addPaymentToHistory({
        ...paymentData,
        timestamp: new Date().toISOString(),
        status: 'completed'
      });
      clearCurrentPayment();
    }

    // Redirect to appointments page after 5 seconds
    const timer = setTimeout(() => {
      navigate('/my-appointments');
    }, 5000);

    return () => clearTimeout(timer);
  }, [paymentData, addPaymentToHistory, clearCurrentPayment, navigate]);

  const handleViewAppointments = () => {
    navigate('/my-appointments');
  };

  const handleDownloadReceipt = () => {
    // Implement receipt download functionality
    const receiptData = {
      paymentId: paymentData?.paymentId,
      orderId: paymentData?.orderId,
      amount: paymentData?.amount,
      timestamp: new Date().toISOString(),
      status: 'Completed'
    };

    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payment_receipt_${paymentData?.paymentId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Access</h1>
          <p className="text-gray-600 mb-6">
            No payment information found. Please try making a payment again.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-green-500 text-white p-6 text-center">
          <div className="text-6xl mb-2">✅</div>
          <h1 className="text-2xl font-bold">Payment Successful!</h1>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">Your payment has been processed successfully</p>
            <div className="text-3xl font-bold text-green-600">
              {formatAmount(paymentData.amount)}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Payment ID:</span>
              <span className="font-mono text-sm text-gray-900">
                {paymentData.paymentId}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-mono text-sm text-gray-900">
                {paymentData.orderId}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Status:</span>
              <span className="text-green-600 font-semibold">Completed</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Date:</span>
              <span className="text-gray-900">
                {new Date().toLocaleDateString('en-IN')}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleViewAppointments}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              View My Appointments
            </button>
            
            <button
              onClick={handleDownloadReceipt}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Download Receipt
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <div className="text-blue-500 text-xl mr-3">💡</div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">What's Next?</h3>
                <p className="text-sm text-blue-700">
                  You will receive a confirmation email shortly. You can view and manage 
                  your appointment from the "My Appointments" section.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-6 text-sm text-gray-500">
            Redirecting to appointments in 5 seconds...
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
