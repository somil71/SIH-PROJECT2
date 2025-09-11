import express from 'express'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { authenticateToken } from '../middleware/auth.js'
import Doctor from '../models/Doctor.js'

const router = express.Router()

const rzp = () => new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test', key_secret: process.env.RAZORPAY_KEY_SECRET || 'test' })

router.post('/create-order', authenticateToken, async (req, res) => {
  try {
    const { doctorId } = req.body
    const doctor = await Doctor.findById(doctorId)
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' })
    const amount = Math.max(1, Math.round(doctor.consultationFee * 100))
    const order = await rzp().orders.create({ amount, currency: 'INR', receipt: `doc-${doctorId}-${Date.now()}` })
    res.json({ orderId: order.id, amount, currency: 'INR', key: process.env.RAZORPAY_KEY_ID || 'rzp_test' })
  } catch (e) { res.status(500).json({ message: 'Order creation failed' }) }
})

router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test')
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id)
    const digest = hmac.digest('hex')
    if (digest !== razorpay_signature) return res.status(400).json({ message: 'Signature mismatch' })
    res.json({ message: 'Payment verified' })
  } catch (e) { res.status(400).json({ message: 'Verification failed' }) }
})

export default router


