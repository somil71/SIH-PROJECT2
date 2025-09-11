import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  getUserAppointments,
  getUserStats,
  deleteUserAccount
} from '../controllers/userController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { adminListUsers, adminUpdateUserStatus } from '../controllers/userController.js';
import { validateUserUpdate, validatePagination } from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// User profile routes
router.get('/profile', getUserProfile);
router.put('/profile', validateUserUpdate, updateUserProfile);
router.post('/profile/picture', uploadProfilePicture);

// User appointments
router.get('/appointments', validatePagination, getUserAppointments);
router.get('/stats', getUserStats);

// Account management
router.delete('/account', deleteUserAccount);

// Admin endpoints
router.get('/admin', authenticateToken, requireAdmin, adminListUsers);
router.put('/admin/:id', authenticateToken, requireAdmin, adminUpdateUserStatus);

export default router;
