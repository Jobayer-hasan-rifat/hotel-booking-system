import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    CircularProgress,
    Alert,
    Toolbar,
    Button,
} from '@mui/material';
import {
    Hotel as HotelIcon,
    MeetingRoom as RoomIcon,
    BookOnline as BookingIcon,
    People as UserIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import UsersList from '../components/admin/UsersList';
import { dashboardService } from '../services/dashboardService';
import Sidebar from '../components/admin/Sidebar';
import Header from '../components/admin/Header';

const StatCard = ({ title, value, icon, color }) => (
    <Paper
        elevation={2}
        sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            height: 160,
            borderRadius: '16px',
            background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
            color: 'white',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
            },
        }}
    >
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
            }}
        >
            <Box
                sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {React.cloneElement(icon, { sx: { fontSize: 32 } })}
            </Box>
        </Box>
        <Box sx={{ mt: 'auto' }}>
            <Typography 
                component="h2" 
                variant="h3" 
                sx={{ 
                    fontWeight: 'bold',
                    fontSize: '2.5rem',
                    lineHeight: 1.2,
                    letterSpacing: '-0.02em'
                }}
            >
                {value}
            </Typography>
            <Typography 
                component="p" 
                sx={{ 
                    fontSize: '1.1rem',
                    opacity: 0.9,
                    mt: 0.5
                }}
            >
                {title}
            </Typography>
        </Box>
    </Paper>
);

const AdminDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [stats, setStats] = useState({
        hotels: 0,
        rooms: 0,
        bookings: 0,
        users: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                console.log('Current user:', user);
                console.log('Token in localStorage:', localStorage.getItem('token'));
                
                const stats = await dashboardService.getStats();
                console.log('Fetched stats:', stats);
                setStats(stats);
                setError(null);
            } catch (err) {
                console.error('Error fetching dashboard stats:', err);
                console.error('Error details:', {
                    message: err.message,
                    response: err.response,
                    status: err.response?.status,
                    data: err.response?.data
                });
                setError(`Failed to load dashboard statistics: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            );
        }

        if (error) {
            return (
                <Box>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                    <Paper sx={{ p: 2, mb: 2 }}>
                        <Typography variant="h6" gutterBottom>Debug Information:</Typography>
                        <Typography variant="body2">User: {user ? JSON.stringify(user, null, 2) : 'Not logged in'}</Typography>
                        <Typography variant="body2">Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}</Typography>
                        <Button 
                            variant="contained" 
                            onClick={async () => {
                                setLoading(true);
                                setError(null);
                                try {
                                    const stats = await dashboardService.getStats();
                                    setStats(stats);
                                    setError(null);
                                } catch (err) {
                                    console.error('Retry error:', err);
                                    setError(`Retry failed: ${err.message}`);
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            sx={{ mt: 1 }}
                        >
                            Retry
                        </Button>
                    </Paper>
                </Box>
            );
        }

        switch (activeSection) {
            case 'dashboard':
                return (
                    <>
                        <Typography variant="h4" gutterBottom>
                            Dashboard
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard
                                    title="Total Hotels"
                                    value={stats.hotels}
                                    icon={<HotelIcon />}
                                    color="#1976d2"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard
                                    title="Total Rooms"
                                    value={stats.rooms}
                                    icon={<RoomIcon />}
                                    color="#2e7d32"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard
                                    title="Active Bookings"
                                    value={stats.bookings}
                                    icon={<BookingIcon />}
                                    color="#ed6c02"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard
                                    title="Registered Users"
                                    value={stats.users}
                                    icon={<UserIcon />}
                                    color="#9c27b0"
                                />
                            </Grid>
                        </Grid>
                    </>
                );
            case 'users':
                return (
                    <>
                        <Typography variant="h4" gutterBottom>
                            Users Management
                        </Typography>
                        <UsersList />
                    </>
                );
            case 'hotels':
                return (
                    <>
                        <Typography variant="h4" gutterBottom>
                            Hotels Management
                        </Typography>
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">
                                Hotels management feature coming soon...
                            </Typography>
                        </Paper>
                    </>
                );
            case 'rooms':
                return (
                    <>
                        <Typography variant="h4" gutterBottom>
                            Rooms Management
                        </Typography>
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">
                                Rooms management feature coming soon...
                            </Typography>
                        </Paper>
                    </>
                );
            case 'bookings':
                return (
                    <>
                        <Typography variant="h4" gutterBottom>
                            Bookings Management
                        </Typography>
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">
                                Bookings management feature coming soon...
                            </Typography>
                        </Paper>
                    </>
                );
            case 'settings':
                return (
                    <>
                        <Typography variant="h4" gutterBottom>
                            Settings
                        </Typography>
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">
                                Settings feature coming soon...
                            </Typography>
                        </Paper>
                    </>
                );
            default:
                return (
                    <Typography variant="h4" gutterBottom>
                        Dashboard
                    </Typography>
                );
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                    ml: '240px', // Same as sidebar width
                    p: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    minHeight: '100vh',
                }}
            >
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    {renderContent()}
                </Container>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
