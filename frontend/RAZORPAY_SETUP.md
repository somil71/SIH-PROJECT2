# Razorpay Integration Setup Guide

This guide explains how to set up and use Razorpay payment integration in your healthcare frontend application.

## 🚀 Quick Setup

### 1. Razorpay Account Setup
1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys)
2. Complete your KYC verification
3. Navigate to Settings → API Keys
4. Generate your Key ID and Key Secret

### 2. Environment Configuration
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Update the `.env` file with your Razorpay credentials:
   ```env
   VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
   ```

### 3. Backend Integration Required
You'll need to implement these API endpoints in your backend:

#### POST `/api/create-order`
```javascript
// Create Razorpay order
{
  "amount": 50000,  // Amount in paisa (₹500 = 50000 paisa)
  "currency": "INR"
}
```

Response:
```javascript
{
  "id": "order_xyz123",
  "amount": 50000,
  "currency": "INR",
  "status": "created"
}
```

#### POST `/api/verify-payment`
```javascript
// Verify payment signature
{
  "razorpay_payment_id": "pay_xyz123",
  "razorpay_order_id": "order_xyz123",
  "razorpay_signature": "signature_string"
}
```

Response:
```javascript
{
  "success": true,
  "message": "Payment verified successfully"
}
```

## 📱 Features Included

### ✅ Payment Component
- Reusable `<Payment />` component
- Built-in loading states
- Error handling
- Success/failure callbacks

### ✅ Appointment Integration
- Complete appointment booking flow
- Payment integrated into booking process
- Appointment data validation
- Payment history tracking

### ✅ Payment Pages
- Success page with receipt download
- Failure page with retry options
- Automatic redirects
- User-friendly error messages

### ✅ Context Management
- Payment state management
- Payment history
- Current payment tracking
- Integration with existing AppContext

## 🔧 Usage Examples

### Basic Payment Component
```jsx
import Payment from '../components/Payment';

<Payment
  amount={500}
  description="Consultation fee"
  customerData={{
    name: "John Doe",
    email: "john@example.com",
    phone: "9876543210"
  }}
  onSuccess={(paymentResult) => {
    console.log('Payment successful:', paymentResult);
  }}
  onError={(error) => {
    console.log('Payment failed:', error);
  }}
/>
```

### Using Payment Context
```jsx
import { useApp } from '../context/AppContext';

const MyComponent = () => {
  const { 
    payment, 
    setCurrentPayment, 
    addPaymentToHistory,
    clearCurrentPayment 
  } = useApp();

  // Access payment state
  const isProcessing = payment.isProcessing;
  const paymentHistory = payment.paymentHistory;
};
```

## 🛠️ Customization

### Styling
The components use Tailwind CSS classes. You can customize:
- Colors by changing `bg-blue-600` classes
- Sizes by modifying padding/margin classes
- Animations by updating transition classes

### Payment Flow
Modify `src/utils/razorpay.js` to customize:
- Payment options (UPI, Cards, etc.)
- Theme colors
- Prefill data
- Error handling

## 🔐 Security Notes

### Environment Variables
- Never commit `.env` file to version control
- Use different keys for test/production environments
- Rotate keys regularly

### Payment Verification
- Always verify payments on the backend
- Never trust frontend-only payment confirmations
- Implement webhook handling for reliability

## 📋 Testing

### Test Credentials
Razorpay provides test credentials:
- Test Key ID: Use your test key from dashboard
- Test payments: Use test card numbers from [Razorpay docs](https://razorpay.com/docs/payments/payments/test-card-upi-details/)

### Test Card Numbers
- Success: `4111 1111 1111 1111`
- Failure: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

## 🚨 Troubleshooting

### Common Issues

1. **Razorpay script not loading**
   - Check internet connection
   - Verify script URL accessibility

2. **Payment fails with "key not found"**
   - Ensure `VITE_RAZORPAY_KEY_ID` is set correctly
   - Check key format (should start with `rzp_`)

3. **Backend endpoints not working**
   - Verify backend server is running
   - Check API endpoint URLs in `razorpay.js`
   - Ensure CORS is configured properly

4. **Payment verification fails**
   - Check signature verification logic on backend
   - Ensure webhook secret is correct

### Debug Mode
Set environment variable for debugging:
```env
VITE_DEBUG_PAYMENTS=true
```

## 📞 Support

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Integration Guide](https://razorpay.com/docs/payments/payment-gateway/web-integration/)
- [API Reference](https://razorpay.com/docs/api/)

## 🔄 Updates

This integration supports:
- ✅ UPI payments
- ✅ Credit/Debit cards
- ✅ Net banking
- ✅ Wallets
- ✅ EMI options
- ✅ International cards (if enabled)

For the latest features, check the [Razorpay changelog](https://razorpay.com/docs/changelog/).
