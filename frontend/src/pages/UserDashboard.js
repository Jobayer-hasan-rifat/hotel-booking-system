import React, { useEffect } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Button,
    CircularProgress,
    Card,
    CardContent,
    Divider,
    Avatar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Alert,
} from '@mui/material';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Hotel as HotelIcon,
    EventAvailable as EventIcon,
    CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBookings, cancelBooking } from '../store/slices/bookingSlice';

const BookingCard = ({ booking, onCancel }) => {
    return (
        <Paper 
            elevation={2} 
            sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: 2,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                }
            }}
        >
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Typography variant="h6" color="primary" gutterBottom>
                        {booking.hotel.name}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <HotelIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body1">
                                    Room {booking.room.roomNumber}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body1">
                                    {booking.guests} Guests
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body1">
                                    Check-in: {new Date(booking.checkIn).toLocaleDateString()}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body1">
                                    Check-out: {new Date(booking.checkOut).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: { xs: 'flex-start', md: 'flex-end' },
                        gap: 1
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={() => window.location.href = `/hotels/${booking.hotel._id}`}
                        sx={{ width: { xs: '100%', md: 'auto' } }}
                    >
                        View Hotel
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => onCancel(booking._id)}
                        sx={{ width: { xs: '100%', md: 'auto' } }}
                    >
                        Cancel Booking
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};

const UserDashboard = () => {
    const dispatch = useDispatch();
    const { bookings = [], loading, error } = useSelector((state) => state.bookings);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchUserBookings());
    }, [dispatch]);

    const handleCancelBooking = async (bookingId) => {
        try {
            await dispatch(cancelBooking(bookingId)).unwrap();
        } catch (error) {
            console.error('Failed to cancel booking:', error);
        }
    };

    if (loading) {
        return (
            <Container sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Box sx={{ 
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            pt: 4,
            pb: 6
        }}>
            <Container maxWidth="lg">
                {/* Welcome Section */}
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 3, 
                        mb: 4, 
                        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                        color: 'white'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                            sx={{ 
                                width: 64, 
                                height: 64, 
                                bgcolor: 'primary.light',
                                fontSize: '2rem'
                            }}
                        >
                            {user?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography variant="h4" gutterBottom>
                                Welcome back, {user?.name}!
                            </Typography>
                            <Typography variant="subtitle1">
                                Manage your bookings and profile
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                <Grid container spacing={4}>
                    {/* User Profile Card */}
                    <Grid item xs={12} md={4}>
                        <Card elevation={3}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Profile Information
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <List>
                                    <ListItem>
                                        <ListItemIcon>
                                            <PersonIcon />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Name"
                                            secondary={user?.name}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <EmailIcon />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Email"
                                            secondary={user?.email}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <PhoneIcon />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Phone"
                                            secondary={user?.phone || 'Not provided'}
                                        />
                                    </ListItem>
                                </List>
                                <Button 
                                    variant="outlined" 
                                    fullWidth 
                                    sx={{ mt: 2 }}
                                    onClick={() => {/* Add edit profile functionality */}}
                                >
                                    Edit Profile
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Bookings Section */}
                    <Grid item xs={12} md={8}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6">
                                    My Bookings
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<HotelIcon />}
                                    onClick={() => window.location.href = '/'}
                                >
                                    Book New Stay
                                </Button>
                            </Box>
                            
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                    <CircularProgress />
                                </Box>
                            ) : error ? (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {error}
                                </Alert>
                            ) : bookings.length === 0 ? (
                                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f8f9fa' }}>
                                    <EventIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        No Bookings Yet
                                    </Typography>
                                    <Typography color="text.secondary" paragraph>
                                        Start planning your next stay with us!
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        sx={{ mt: 2 }}
                                        onClick={() => window.location.href = '/'}
                                    >
                                        Browse Hotels
                                    </Button>
                                </Paper>
                            ) : (
                                bookings.map((booking) => (
                                    <BookingCard
                                        key={booking._id}
                                        booking={booking}
                                        onCancel={handleCancelBooking}
                                    />
                                ))
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default UserDashboard;
