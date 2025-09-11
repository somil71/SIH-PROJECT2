import React, { useState } from 'react';
import { initializeRazorpayPayment, createRazorpayOrder, verifyRazorpayPayment, formatAmount } from '../utils/razorpay';

const Payment = ({ 
  amount, 
  description, 
  customerData, 
  onSuccess, 
  onError,
  buttonText = "Pay Now",
  disabled = false,
  className = ""
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Step 1: Create order on backend
      const order = await createRazorpayOrder(amount);
      
      // Step 2: Initialize Razorpay payment
      const orderData = {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        name: "Healthcare Services",
        description: description,
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerPhone: customerData.phone,
      };

      const paymentResult = await initializeRazorpayPayment(orderData);
      
      // Step 3: Verify payment on backend
      if (paymentResult.success) {
        const verificationResult = await verifyRazorpayPayment({
          razorpay_payment_id: paymentResult.paymentId,
          razorpay_order_id: paymentResult.orderId,
          razorpay_signature: paymentResult.signature,
        });

        if (verificationResult.success) {
          onSuccess({
            paymentId: paymentResult.paymentId,
            orderId: paymentResult.orderId,
            amount: amount,
          });
        } else {
          throw new Error('Payment verification failed');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      onError(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`payment-component ${className}`}>
      <div className="payment-details mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Amount to Pay:</span>
          <span className="text-2xl font-bold text-blue-600">
            {formatAmount(amount)}
          </span>
        </div>
        {description && (
          <div className="text-sm text-gray-600 mt-2">
            {description}
          </div>
        )}
      </div>
      
      <button
        onClick={handlePayment}
        disabled={disabled || isProcessing}
        className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
          disabled || isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          buttonText
        )}
      </button>
      
      <div className="mt-3 text-center">
        <div className="flex items-center justify-center space-x-2">
          <img 
            src="https://razorpay.com/assets/razorpay-glyph.svg" 
            alt="Razorpay" 
            className="h-4"
          />
          <span className="text-sm text-gray-500">Secured by Razorpay</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          We accept UPI, Cards, Net Banking & Wallets
        </div>
      </div>
    </div>
  );
};

export default Payment;
