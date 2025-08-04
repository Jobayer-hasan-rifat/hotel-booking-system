const User = require('../models/User');

const initializeDatabase = async () => {
    try {
        // Check if admin user exists
        const adminExists = await User.findOne({ email: 'admin@gmail.com' });
        
        if (!adminExists) {
            // Create default admin user
            const adminUser = new User({
                name: 'Admin',
                email: 'admin@gmail.com',
                passwordHash: 'admin123', // Will be hashed by the User model's pre-save middleware
                phone: '1234567890',
                isAdmin: true,
                isActive: true
            });

            await adminUser.save();
            console.log('Default admin user created successfully');
        }
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

module.exports = initializeDatabase;
