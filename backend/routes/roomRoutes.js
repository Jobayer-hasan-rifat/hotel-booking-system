const express = require('express');
const router = express.Router();
const roomService = require('../services/roomService');
const { authenticateToken } = require('../middleware/auth');

// Get all rooms
router.get('/', async (req, res) => {
    try {
        const rooms = await roomService.getAllRooms();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get room by ID
router.get('/:id', async (req, res) => {
    try {
        const room = await roomService.getRoomById(req.params.id);
        res.json(room);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Create new room (admin only)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const room = await roomService.createRoom(req.body);
        res.status(201).json(room);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
