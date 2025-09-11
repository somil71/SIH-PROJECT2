// Razorpay utility functions
import axios from 'axios';

// Load Razorpay script dynamically
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// Initialize Razorpay payment
export const initializeRazorpayPayment = async (orderData) => {
  const isScriptLoaded = await loadRazorpayScript();
  
  if (!isScriptLoaded) {
    alert('Razorpay SDK failed to load. Please check your internet connection.');
    return;
  }

  return new Promise((resolve, reject) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay key ID
      amount: orderData.amount, // Amount in paisa
      currency: orderData.currency || 'INR',
      name: orderData.name || 'Healthcare Appointment',
      description: orderData.description || 'Payment for medical consultation',
      order_id: orderData.orderId,
      handler: function (response) {
        // Payment successful
        resolve({
          success: true,
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
        });
      },
      prefill: {
        name: orderData.customerName || '',
        email: orderData.customerEmail || '',
        contact: orderData.customerPhone || '',
      },
      theme: {
        color: '#3B82F6', // Tailwind blue-500
      },
      modal: {
        ondismiss: function () {
          reject({
            success: false,
            error: 'Payment cancelled by user',
          });
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  });
};

// Create order on backend (you'll need to implement this endpoint)
export const createRazorpayOrder = async (amount, currency = 'INR') => {
  try {
    const response = await axios.post('/api/create-order', {
      amount: amount * 100, // Convert to paisa
      currency,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
};

// Verify payment on backend (you'll need to implement this endpoint)
export const verifyRazorpayPayment = async (paymentData) => {
  try {
    const response = await axios.post('/api/verify-payment', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw new Error('Failed to verify payment');
  }
};

// Format amount for display
export const formatAmount = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};
