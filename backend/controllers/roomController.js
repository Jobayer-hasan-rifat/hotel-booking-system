const roomService = require('../services/roomService');

class RoomController {
    // Get all rooms
    async getAllRooms(req, res) {
        try {
            const rooms = await roomService.getAllRooms();
            res.json(rooms);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get room by ID
    async getRoomById(req, res) {
        try {
            const room = await roomService.getRoomById(req.params.id);
            res.json(room);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    // Create new room (admin only)
    async createRoom(req, res) {
        try {
            const room = await roomService.createRoom(req.body);
            res.status(201).json(room);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new RoomController();
