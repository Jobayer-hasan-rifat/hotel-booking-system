import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import store from './store';
import theme from './theme';

// Components
import Navbar from './components/Navbar';
import { PrivateRoute, AdminRoute, PublicOnlyRoute } from './components/ProtectedRoutes';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import HotelDetailsPage from './pages/HotelDetailsPage';
import BookingPage from './pages/BookingPage';

function App() {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                    <div>
                        <Navbar />
                        <Routes>
                            {/* Public routes */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/hotels/:id" element={<HotelDetailsPage />} />

                            {/* Auth routes (accessible only when not logged in) */}
                            <Route path="/signup" element={
                                <PublicOnlyRoute>
                                    <SignupPage />
                                </PublicOnlyRoute>
                            } />
                            <Route path="/login" element={
                                <PublicOnlyRoute>
                                    <LoginPage />
                                </PublicOnlyRoute>
                            } />
                            <Route path="/admin/login" element={
                                <PublicOnlyRoute>
                                    <AdminLoginPage />
                                </PublicOnlyRoute>
                            } />

                            {/* User protected routes */}
                            <Route path="/dashboard/*" element={
                                <PrivateRoute>
                                    <UserDashboard />
                                </PrivateRoute>
                            } />
                            <Route path="/booking/:hotelId" element={
                                <PrivateRoute>
                                    <BookingPage />
                                </PrivateRoute>
                            } />

                            {/* Admin protected routes */}
                            <Route path="/admin/dashboard" element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            } />
                            <Route path="/admin" element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            } />
                        </Routes>
                    </div>
                </Router>
            </ThemeProvider>
        </Provider>
    );
}

export default App;
