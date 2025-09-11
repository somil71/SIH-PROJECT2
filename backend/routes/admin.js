import express from 'express'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'
import User from '../models/User.js'
import Doctor from '../models/Doctor.js'
import Appointment from '../models/Appointment.js'

const router = express.Router()

router.get('/analytics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [totalUsers, totalDoctors, activeDoctors, verifiedDoctors, totalAppointments] = await Promise.all([
      User.countDocuments({}),
      Doctor.countDocuments({}),
      Doctor.countDocuments({ isActive: true }),
      Doctor.countDocuments({ isVerified: true }),
      Appointment.countDocuments({})
    ])

    const startOfToday = new Date(); startOfToday.setHours(0,0,0,0)
    const endOfToday = new Date(); endOfToday.setHours(23,59,59,999)
    const todayAppointments = await Appointment.countDocuments({ appointmentDate: { $gte: startOfToday, $lte: endOfToday } })

    const startOfMonth = new Date(); startOfMonth.setDate(1); startOfMonth.setHours(0,0,0,0)
    const revenueAgg = await Appointment.aggregate([
      { $match: { status: 'completed', appointmentDate: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$payment.amount' } } }
    ])
    const revenueThisMonth = revenueAgg[0]?.total || 0

    res.json({
      totals: { totalUsers, totalDoctors, activeDoctors, verifiedDoctors, totalAppointments, todayAppointments, revenueThisMonth }
    })
  } catch (e) {
    res.status(500).json({ message: 'Failed to load analytics' })
  }
})

export default router


