import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/api';

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authService.login(credentials);
            const { token, user } = response.data;
            
            if (!token || !user) {
                return rejectWithValue('Invalid response from server');
            }

            // For admin login, verify admin status
            if (credentials.isAdmin && !user.isAdmin) {
                return rejectWithValue('Access denied: Admin privileges required');
            }

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Login failed';
            return rejectWithValue(message);
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (userData) => {
        const response = await authService.register(userData);
        localStorage.setItem('token', response.data.token);
        return response.data.user;
    }
);

// Get initial user state from localStorage
const getUserFromStorage = () => {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: getUserFromStorage(),
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
