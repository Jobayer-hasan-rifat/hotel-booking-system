const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
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
const validateUserRegistration = [
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
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Please provide a valid phone number'),
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Hotel validation rules
const validateHotel = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Hotel name must be between 2 and 100 characters'),
  body('location.address')
    .notEmpty()
    .withMessage('Address is required'),
  body('location.city')
    .notEmpty()
    .withMessage('City is required'),
  body('location.state')
    .notEmpty()
    .withMessage('State is required'),
  body('location.country')
    .notEmpty()
    .withMessage('Country is required'),
  body('location.zipCode')
    .notEmpty()
    .withMessage('Zip code is required'),
  body('description')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('priceRange.min')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  body('priceRange.max')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  handleValidationErrors
];

// Room validation rules
const validateRoom = [
  body('roomNumber')
    .trim()
    .notEmpty()
    .withMessage('Room number is required'),
  body('type')
    .isIn(['Single', 'Double', 'Twin', 'Suite', 'Deluxe', 'Presidential'])
    .withMessage('Invalid room type'),
  body('pricePerNight')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Price per night must be a positive number'),
  body('capacity.adults')
    .isInt({ min: 1 })
    .withMessage('Adult capacity must be at least 1'),
  body('capacity.children')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Children capacity must be 0 or more'),
  handleValidationErrors
];

// Booking validation rules
const validateBooking = [
  body('roomId')
    .isMongoId()
    .withMessage('Invalid room ID'),
  body('checkIn')
    .isISO8601()
    .toDate()
    .custom((value) => {
      if (value < new Date().setHours(0, 0, 0, 0)) {
        throw new Error('Check-in date cannot be in the past');
      }
      return true;
    }),
  body('checkOut')
    .isISO8601()
    .toDate()
    .custom((value, { req }) => {
      if (value <= new Date(req.body.checkIn)) {
        throw new Error('Check-out date must be after check-in date');
      }
      return true;
    }),
  body('guests.adults')
    .isInt({ min: 1 })
    .withMessage('At least one adult is required'),
  body('guests.children')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Number of children must be 0 or more'),
  body('contactInfo.phone')
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Please provide a valid phone number'),
  body('contactInfo.email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  handleValidationErrors
];

// Parameter validation
const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName}`),
  handleValidationErrors
];

// Query validation
const validatePagination = [
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

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateHotel,
  validateRoom,
  validateBooking,
  validateObjectId,
  validatePagination,
  handleValidationErrors
};
