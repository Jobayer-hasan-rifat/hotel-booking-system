const User = require('../models/User');

class UserController {
    // Get user profile
    async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.id).select('-password');
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Update user profile
    async updateProfile(req, res) {
        try {
            const user = await User.findByIdAndUpdate(
                req.user.id,
                { $set: req.body },
                { new: true }
            ).select('-password');
            res.json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Get all users (admin only)
    async getAllUsers(req, res) {
        try {
            const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Update any user (admin only)
    async updateUser(req, res) {
        try {
            const updateData = { ...req.body };
            
            // Convert role to isAdmin if role is provided
            if (updateData.role) {
                updateData.isAdmin = updateData.role === 'admin';
                delete updateData.role;
            }
            
            const user = await User.findByIdAndUpdate(
                req.params.id,
                { $set: updateData },
                { new: true }
            ).select('-passwordHash');
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            res.json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Delete user (admin only)
    async deleteUser(req, res) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new UserController();
