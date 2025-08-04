const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const { authenticateToken } = require('../middleware/auth');

// Get all hotels
router.get('/', hotelController.getAllHotels);

// Get hotel by ID
router.get('/:id', hotelController.getHotelById);

// Create new hotel (admin only)
router.post('/', authenticateToken, hotelController.createHotel);

module.exports = router;
