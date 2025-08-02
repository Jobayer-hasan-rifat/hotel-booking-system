import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Check if error has response
        if (error.response) {
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Check if we're on an admin route
                if (window.location.pathname.startsWith('/admin')) {
                    window.location.href = '/admin/login';
                } else {
                    window.location.href = '/login';
                }
            }
            return Promise.reject({
                ...error,
                message: error.response.data?.message || 'An error occurred'
            });
        }
        // Network error or other errors without response
        return Promise.reject({
            ...error,
            message: 'Network error or server is not responding'
        });
    }
);

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
};

export const hotelService = {
    getAllHotels: () => api.get('/hotels'),
    getHotelById: (id) => api.get(`/hotels/${id}`),
    createHotel: (hotelData) => api.post('/hotels', hotelData),
    updateHotel: (id, hotelData) => api.put(`/hotels/${id}`, hotelData),
    deleteHotel: (id) => api.delete(`/hotels/${id}`),
};

export const roomService = {
    getRoomsByHotel: (hotelId) => api.get(`/rooms/hotel/${hotelId}`),
    createRoom: (roomData) => api.post('/rooms', roomData),
    updateRoom: (id, roomData) => api.put(`/rooms/${id}`, roomData),
    deleteRoom: (id) => api.delete(`/rooms/${id}`),
};

export const bookingService = {
    createBooking: (bookingData) => api.post('/bookings', bookingData),
    getUserBookings: () => api.get('/bookings/my-bookings'),
    cancelBooking: (id) => api.delete(`/bookings/${id}`),
};

export default api;
