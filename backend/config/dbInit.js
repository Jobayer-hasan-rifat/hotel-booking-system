const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const Booking = require('../models/Booking');

const initializeDatabase = async () => {
    try {
        // Check if admin user exists
        let adminUser = await User.findOne({ email: 'admin@mybook.com' });
        
        if (!adminUser) {
            // Create default admin user
            adminUser = new User({
                name: 'Admin',
                email: 'admin@mybook.com',
                passwordHash: 'admin123', // Will be hashed by the User model's pre-save middleware
                phone: '1234567890',
                isAdmin: true,
                isActive: true
            });

            await adminUser.save();
            console.log('Default admin user created successfully');
        }

        // Check if sample hotels exist
        const hotelCount = await Hotel.countDocuments();
        if (hotelCount === 0) {
            // Create sample hotels
            const sampleHotels = [
                {
                    name: 'Grand Palace Hotel',
                    description: 'Luxury hotel in the heart of the city',
                    location: {
                        address: '123 Main Street',
                        city: 'New York',
                        state: 'NY',
                        country: 'USA',
                        zipCode: '10001'
                    },
                    amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Spa'],
                    images: [{ url: 'hotel1.jpg', alt: 'Grand Palace Hotel' }],
                    rating: { average: 4.5, count: 120 },
                    priceRange: { min: 150, max: 500 },
                    isActive: true,
                    createdBy: adminUser._id
                },
                {
                    name: 'Seaside Resort',
                    description: 'Beautiful beachfront resort',
                    location: {
                        address: '456 Ocean Drive',
                        city: 'Miami',
                        state: 'FL',
                        country: 'USA',
                        zipCode: '33139'
                    },
                    amenities: ['WiFi', 'Pool', 'Restaurant', 'Bar'],
                    images: [{ url: 'hotel2.jpg', alt: 'Seaside Resort' }],
                    rating: { average: 4.2, count: 85 },
                    priceRange: { min: 200, max: 800 },
                    isActive: true,
                    createdBy: adminUser._id
                }
            ];

            const createdHotels = await Hotel.insertMany(sampleHotels);
            console.log('Sample hotels created successfully');

            // Create sample rooms for each hotel
            const sampleRooms = [];
            createdHotels.forEach((hotel, hotelIndex) => {
                for (let i = 1; i <= 3; i++) {
                    sampleRooms.push({
                        hotelId: hotel._id,
                        roomNumber: `${hotelIndex + 1}0${i}`,
                        type: i === 1 ? 'Single' : i === 2 ? 'Deluxe' : 'Suite',
                        description: `Comfortable ${i === 1 ? 'standard' : i === 2 ? 'deluxe' : 'suite'} room`,
                        capacity: { adults: i + 1, children: i },
                        pricePerNight: 100 + (i * 50) + (hotelIndex * 25),
                        amenities: ['WiFi', 'TV', 'AC'],
                        images: [{ url: `room${i}.jpg`, alt: `Room ${hotelIndex + 1}0${i}` }],
                        isActive: true
                    });
                }
            });

            await Room.insertMany(sampleRooms);
            console.log('Sample rooms created successfully');
        }

        // Create a sample regular user if none exists
        const regularUserExists = await User.findOne({ email: 'user@example.com' });
        if (!regularUserExists) {
            const regularUser = new User({
                name: 'John Doe',
                email: 'user@example.com',
                passwordHash: 'password123',
                phone: '9876543210',
                isAdmin: false,
                isActive: true
            });

            await regularUser.save();
            console.log('Sample regular user created successfully');
        }

    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

module.exports = initializeDatabase;
