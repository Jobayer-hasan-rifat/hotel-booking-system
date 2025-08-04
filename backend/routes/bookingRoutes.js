const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get all bookings (admin only)
router.get('/', authenticateToken, requireAdmin, bookingController.getAllBookings);

// Get user's bookings
router.get('/my-bookings', authenticateToken, bookingController.getUserBookings);

// Create new booking
router.post('/', authenticateToken, bookingController.createBooking);

// Cancel booking
router.delete('/:id', authenticateToken, bookingController.cancelBooking);

module.exports = router;
