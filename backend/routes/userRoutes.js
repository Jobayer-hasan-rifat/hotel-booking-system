const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get user profile
router.get('/profile', authenticateToken, userController.getProfile);

// Update user profile
router.put('/profile', authenticateToken, userController.updateProfile);

// Admin routes
// Get all users (admin only)
router.get('/', authenticateToken, requireAdmin, userController.getAllUsers);

// Update any user (admin only)
router.put('/:id', authenticateToken, requireAdmin, userController.updateUser);

// Delete user (admin only)
router.delete('/:id', authenticateToken, requireAdmin, userController.deleteUser);

module.exports = router;
