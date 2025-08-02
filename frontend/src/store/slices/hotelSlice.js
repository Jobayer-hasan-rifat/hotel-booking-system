import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hotelService } from '../../services/api';

export const fetchHotels = createAsyncThunk(
    'hotels/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await hotelService.getAllHotels();
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                'Failed to fetch hotels'
            );
        }
    }
);

export const fetchHotelById = createAsyncThunk(
    'hotels/fetchById',
    async (id) => {
        const response = await hotelService.getHotelById(id);
        return response.data;
    }
);

const hotelSlice = createSlice({
    name: 'hotels',
    initialState: {
        hotels: [],
        selectedHotel: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearSelectedHotel: (state) => {
            state.selectedHotel = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHotels.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchHotels.fulfilled, (state, action) => {
                state.loading = false;
                state.hotels = action.payload;
            })
            .addCase(fetchHotels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'An error occurred';
                state.hotels = [];
            })
            .addCase(fetchHotelById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchHotelById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedHotel = action.payload;
            })
            .addCase(fetchHotelById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearSelectedHotel } = hotelSlice.actions;
export default hotelSlice.reducer;
