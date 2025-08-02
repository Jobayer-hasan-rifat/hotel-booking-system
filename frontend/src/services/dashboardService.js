import api from './api';

export const dashboardService = {
    async getStats() {
        try {
            console.log('Fetching dashboard stats...');
            
            // Fetch each endpoint individually to identify which one fails
            let hotels, bookings, users;
            
            try {
                console.log('Fetching hotels...');
                hotels = await api.get('/hotels?stats=true');
                console.log('Hotels response:', hotels.data);
                console.log('Hotels data type:', typeof hotels.data);
                console.log('Hotels is array:', Array.isArray(hotels.data));
                if (Array.isArray(hotels.data)) {
                    console.log('Hotels fetched:', hotels.data.length);
                } else {
                    console.log('Hotels data structure:', Object.keys(hotels.data || {}));
                }
            } catch (error) {
                console.error('Hotels API failed:', error);
                throw new Error(`Hotels API failed: ${error.message}`);
            }
            
            try {
                console.log('Fetching bookings...');
                bookings = await api.get('/bookings?stats=true');
                console.log('Bookings response:', bookings.data);
                console.log('Bookings is array:', Array.isArray(bookings.data));
                if (Array.isArray(bookings.data)) {
                    console.log('Bookings fetched:', bookings.data.length);
                }
            } catch (error) {
                console.error('Bookings API failed:', error);
                throw new Error(`Bookings API failed: ${error.message}`);
            }
            
            try {
                console.log('Fetching users...');
                users = await api.get('/users');
                console.log('Users response:', users.data);
                console.log('Users is array:', Array.isArray(users.data));
                if (Array.isArray(users.data)) {
                    console.log('Users fetched:', users.data.length);
                }
            } catch (error) {
                console.error('Users API failed:', error);
                throw new Error(`Users API failed: ${error.message}`);
            }

            // Handle different response formats
            const hotelsArray = Array.isArray(hotels.data) ? hotels.data : 
                               (hotels.data.hotels ? hotels.data.hotels : []);
            const bookingsArray = Array.isArray(bookings.data) ? bookings.data : 
                                 (bookings.data.bookings ? bookings.data.bookings : []);
            const usersArray = Array.isArray(users.data) ? users.data : 
                              (users.data.users ? users.data.users : []);
            
            console.log('Processed arrays:', {
                hotels: hotelsArray.length,
                bookings: bookingsArray.length,
                users: usersArray.length
            });
            
            const hotelCount = hotelsArray.length;
            const roomCount = hotelsArray.reduce((total, hotel) => 
                total + (hotel.rooms ? hotel.rooms.length : 0), 0);
            const bookingCount = bookingsArray.length;
            const userCount = usersArray.length;

            const stats = {
                hotels: hotelCount,
                rooms: roomCount,
                bookings: bookingCount,
                users: userCount
            };
            
            console.log('Final stats:', stats);
            return stats;
        } catch (error) {
            console.error('Dashboard stats error:', error);
            throw new Error(error.message || 'Failed to fetch dashboard statistics');
        }
    },

    async getUsers() {
        try {
            const response = await api.get('/users');
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch users');
        }
    },

    async updateUser(userId, userData) {
        try {
            const response = await api.put(`/users/${userId}`, userData);
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Failed to update user');
        }
    },

    async deleteUser(userId) {
        try {
            await api.delete(`/users/${userId}`);
        } catch (error) {
            throw new Error(error.message || 'Failed to delete user');
        }
    }
};
