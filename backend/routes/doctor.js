import express from 'express';
import {
  getAllDoctors,
  getDoctorById,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorAppointments,
  getDoctorStats,
  getAvailableSlots,
  getSpecializations
} from '../controllers/doctorController.js';
import { authenticateToken, requireDoctor, optionalAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/auth.js';
import { validateDoctorUpdate, validatePagination, validateObjectId } from '../middleware/validation.js';
import { adminUpdateDoctorStatus, adminDeleteDoctor } from '../controllers/doctorController.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, validatePagination, getAllDoctors);
router.get('/specializations', getSpecializations);
router.get('/:id', validateObjectId, getDoctorById);
router.get('/:id/available-slots', validateObjectId, getAvailableSlots);

// Protected routes for doctors
router.use(authenticateToken);

// Doctor profile routes
router.get('/profile/me', requireDoctor, getDoctorProfile);
router.put('/profile/me', requireDoctor, validateDoctorUpdate, updateDoctorProfile);

// Doctor appointments and stats
router.get('/appointments/me', requireDoctor, validatePagination, getDoctorAppointments);
router.get('/stats/me', requireDoctor, getDoctorStats);

// Admin controls
router.put('/:id/admin', authenticateToken, requireAdmin, validateObjectId, adminUpdateDoctorStatus);
router.delete('/:id', authenticateToken, requireAdmin, validateObjectId, adminDeleteDoctor);

export default router;
