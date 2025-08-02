import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotelById } from '../store/slices/hotelSlice';
import { createBooking } from '../store/slices/bookingSlice';

const BookingPage = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { selectedHotel: hotel, loading: hotelLoading } = useSelector((state) => state.hotels);
  const { loading: bookingLoading, error } = useSelector((state) => state.bookings);
  
  const [formData, setFormData] = useState({
    checkIn: null,
    checkOut: null,
    guests: 1,
    specialRequests: '',
  });

  useEffect(() => {
    if (hotelId) {
      dispatch(fetchHotelById(hotelId));
    }
  }, [dispatch, hotelId]);

  const calculateTotalPrice = () => {
    if (!formData.checkIn || !formData.checkOut || !hotel) return 0;
    const days = Math.ceil(
      (formData.checkOut - formData.checkIn) / (1000 * 60 * 60 * 24)
    );
    return days * hotel.pricePerNight;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createBooking({
        hotelId,
        ...formData,
        totalPrice: calculateTotalPrice(),
      })).unwrap();
      navigate('/dashboard');
    } catch (err) {
      console.error('Booking failed:', err);
    }
  };

  if (hotelLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!hotel) {
    return (
      <Container>
        <Typography mt={4}>Hotel not found</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom color="primary">
            Book Your Stay
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              {hotel.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {hotel.location}
            </Typography>
            <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
              ${hotel.pricePerNight} / night
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Check-in Date"
                  value={formData.checkIn}
                  onChange={(newValue) => setFormData({ ...formData, checkIn: newValue })}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                  minDate={new Date()}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Check-out Date"
                  value={formData.checkOut}
                  onChange={(newValue) => setFormData({ ...formData, checkOut: newValue })}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                  minDate={formData.checkIn || new Date()}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Number of Guests"
                  type="number"
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                  inputProps={{ min: 1, max: 10 }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Special Requests"
                  multiline
                  rows={4}
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Booking Summary
              </Typography>
              <Typography>
                Total Price: ${calculateTotalPrice()}
              </Typography>
            </Box>

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/hotels/${hotelId}`)}
              >
                Back to Hotel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={bookingLoading}
              >
                {bookingLoading ? <CircularProgress size={24} /> : 'Confirm Booking'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default BookingPage;
