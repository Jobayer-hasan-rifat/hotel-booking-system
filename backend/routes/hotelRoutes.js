const express = require('express');
const router = express.Router();
const hotelService = require('../services/hotelService');
const { authenticateToken } = require('../middleware/auth');

// Get all hotels
router.get('/', async (req, res) => {
    try {
        const result = await hotelService.getAllHotels();
        // For dashboard stats, return just the hotels array
        // For paginated responses, return the full object
        if (req.query.stats === 'true') {
            res.json(result.hotels || []);
        } else {
            res.json(result);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get hotel by ID
router.get('/:id', async (req, res) => {
    try {
        const hotel = await hotelService.getHotelById(req.params.id);
        res.json(hotel);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Create new hotel (admin only)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const hotel = await hotelService.createHotel(req.body);
        res.status(201).json(hotel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
