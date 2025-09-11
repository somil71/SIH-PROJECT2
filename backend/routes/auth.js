import express from 'express';
import {
  registerUser,
  loginUser,
  registerDoctor,
  getCurrentUser,
  logoutUser,
  refreshToken
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import {
  validateUserRegistration,
  validateUserLogin,
  validateDoctorRegistration
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, registerUser);
router.post('/login', validateUserLogin, loginUser);
router.post('/register-doctor', validateDoctorRegistration, registerDoctor);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);
router.post('/logout', authenticateToken, logoutUser);
router.post('/refresh', refreshToken);

export default router;
