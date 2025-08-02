const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  // Generate JWT token
  generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
  }

  // Register new user
  async registerUser(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Create new user
      const user = new User({
        name: userData.name,
        email: userData.email,
        passwordHash: userData.password, // Will be hashed by pre-save middleware
        phone: userData.phone,
        isAdmin: userData.isAdmin || false
      });

      await user.save();

      // Generate token
      const token = this.generateToken(user._id);

      return {
        user: user.toJSON(),
        token
      };
    } catch (error) {
      throw error;
    }
  }

  // Login user
  async loginUser({ email, password, isAdmin }) {
    try {
      // Find user by email and admin status if specified
      const query = { email, isActive: true };
      if (isAdmin !== undefined) {
        query.isAdmin = isAdmin;
      }
      const user = await User.findOne(query);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Generate token
      const token = this.generateToken(user._id);

      return {
        user: user.toJSON(),
        token
      };
    } catch (error) {
      throw error;
    }
  }

  // Get user profile
  async getUserProfile(userId) {
    try {
      const user = await User.findById(userId).select('-passwordHash');
      if (!user || !user.isActive) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(userId, updateData) {
    try {
      const allowedUpdates = ['name', 'phone', 'avatar'];
      const updates = {};
      
      // Filter allowed updates
      Object.keys(updateData).forEach(key => {
        if (allowedUpdates.includes(key)) {
          updates[key] = updateData[key];
        }
      });

      const user = await User.findByIdAndUpdate(
        userId,
        updates,
        { new: true, runValidators: true }
      ).select('-passwordHash');

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      user.passwordHash = newPassword; // Will be hashed by pre-save middleware
      await user.save();

      return { message: 'Password changed successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Verify token
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-passwordHash');
      
      if (!user || !user.isActive) {
        throw new Error('Invalid token');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}

// Export the service instance directly
const authService = new AuthService();
module.exports = authService;
