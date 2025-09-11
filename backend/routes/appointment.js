import express from 'express';
import {
  bookAppointment,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  getAllAppointments,
  addReview
} from '../controllers/appointmentController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { 
  validateAppointment, 
  validateAppointmentUpdate, 
  validatePagination, 
  validateObjectId 
} from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Appointment CRUD operations
router.post('/book', validateAppointment, bookAppointment);
router.get('/:id', validateObjectId, getAppointmentById);
router.put('/:id', validateObjectId, validateAppointmentUpdate, updateAppointment);
router.delete('/:id', validateObjectId, cancelAppointment);

// Review system
router.post('/:id/review', validateObjectId, addReview);

// Admin routes
router.get('/', requireAdmin, validatePagination, getAllAppointments);

export default router;
