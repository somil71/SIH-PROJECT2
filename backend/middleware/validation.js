import { body, param, query, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
export const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone must be a valid 10-digit number'),
  body('gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
  handleValidationErrors
];

export const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

export const validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone must be a valid 10-digit number'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
  handleValidationErrors
];

// Doctor validation rules
export const validateDoctorRegistration = [
  body('specialization')
    .isIn([
      'General Physician', 'Cardiologist', 'Dermatologist', 'Gastroenterologist',
      'Gynecologist', 'Neurologist', 'Pediatrician', 'Psychiatrist', 'Orthopedist',
      'Ophthalmologist', 'ENT Specialist', 'Urologist', 'Oncologist', 'Radiologist',
      'Anesthesiologist'
    ])
    .withMessage('Please provide a valid specialization'),
  body('experience')
    .isInt({ min: 0 })
    .withMessage('Experience must be a non-negative integer'),
  body('consultationFee')
    .isFloat({ min: 0 })
    .withMessage('Consultation fee must be a non-negative number'),
  body('education')
    .isArray({ min: 1 })
    .withMessage('At least one education record is required'),
  body('education.*.degree')
    .notEmpty()
    .withMessage('Degree is required for each education record'),
  body('education.*.institution')
    .notEmpty()
    .withMessage('Institution is required for each education record'),
  body('education.*.year')
    .isInt({ min: 1950, max: new Date().getFullYear() })
    .withMessage('Please provide a valid year for education'),
  handleValidationErrors
];

export const validateDoctorUpdate = [
  body('specialization')
    .optional()
    .isIn([
      'General Physician', 'Cardiologist', 'Dermatologist', 'Gastroenterologist',
      'Gynecologist', 'Neurologist', 'Pediatrician', 'Psychiatrist', 'Orthopedist',
      'Ophthalmologist', 'ENT Specialist', 'Urologist', 'Oncologist', 'Radiologist',
      'Anesthesiologist'
    ])
    .withMessage('Please provide a valid specialization'),
  body('experience')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Experience must be a non-negative integer'),
  body('consultationFee')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Consultation fee must be a non-negative number'),
  body('bio')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Bio cannot be more than 1000 characters'),
  handleValidationErrors
];

// Appointment validation rules
export const validateAppointment = [
  body('doctorId')
    .isMongoId()
    .withMessage('Please provide a valid doctor ID'),
  body('appointmentDate')
    .isISO8601()
    .withMessage('Please provide a valid appointment date'),
  body('appointmentTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please provide a valid time in HH:MM format'),
  body('reason')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters'),
  body('consultationType')
    .optional()
    .isIn(['in-person', 'video', 'phone'])
    .withMessage('Consultation type must be in-person, video, or phone'),
  handleValidationErrors
];

export const validateAppointmentUpdate = [
  body('status')
    .optional()
    .isIn(['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'])
    .withMessage('Invalid appointment status'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot be more than 1000 characters'),
  handleValidationErrors
];

// Parameter validation
export const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  handleValidationErrors
];

// Query validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];
