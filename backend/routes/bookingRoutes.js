const express = require('express');
const router = express.Router();
const bookingService = require('../services/bookingService');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get all bookings (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await bookingService.getAllBookings();
        // For dashboard stats, return just the bookings array
        // For paginated responses, return the full object
        if (req.query.stats === 'true') {
            res.json(result.bookings || []);
        } else {
            res.json(result);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user's bookings
router.get('/my-bookings', authenticateToken, async (req, res) => {
    try {
        const bookings = await bookingService.getUserBookings(req.user.id);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new booking
router.post('/', authenticateToken, async (req, res) => {
    try {
        const booking = await bookingService.createBooking(req.user.id, req.body);
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Cancel booking
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await bookingService.cancelBooking(req.params.id, req.user.id);
        res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
