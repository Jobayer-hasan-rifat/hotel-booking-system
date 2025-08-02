import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookingService } from '../../services/api';

export const fetchUserBookings = createAsyncThunk(
    'bookings/fetchUserBookings',
    async (_, { rejectWithValue }) => {
        try {
            const response = await bookingService.getUserBookings();
            // Ensure we always return an array
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                'Failed to fetch bookings'
            );
        }
    }
);

export const createBooking = createAsyncThunk(
    'bookings/create',
    async (bookingData) => {
        const response = await bookingService.createBooking(bookingData);
        return response.data;
    }
);

export const cancelBooking = createAsyncThunk(
    'bookings/cancel',
    async (id, { rejectWithValue }) => {
        try {
            await bookingService.cancelBooking(id);
            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                'Failed to cancel booking'
            );
        }
    }
);

const bookingSlice = createSlice({
    name: 'bookings',
    initialState: {
        bookings: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserBookings.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload;
            })
            .addCase(fetchUserBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createBooking.pending, (state) => {
                state.loading = true;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings.push(action.payload);
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(cancelBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelBooking.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.bookings = state.bookings.filter(
                    (booking) => booking._id !== action.payload
                );
            })
            .addCase(cancelBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default bookingSlice.reducer;
