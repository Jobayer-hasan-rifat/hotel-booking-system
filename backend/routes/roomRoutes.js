const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authenticateToken } = require('../middleware/auth');

// Get all rooms
router.get('/', roomController.getAllRooms);

// Get room by ID
router.get('/:id', roomController.getRoomById);

// Create new room (admin only)
router.post('/', authenticateToken, roomController.createRoom);

module.exports = router;
