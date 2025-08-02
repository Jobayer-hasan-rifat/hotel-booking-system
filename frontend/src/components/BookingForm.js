import React, { useState } from 'react';
import {
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Grid,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { createBooking } from '../store/slices/bookingSlice';

const BookingForm = ({ room, hotelId, onSuccess }) => {
    const dispatch = useDispatch();
    const [bookingData, setBookingData] = useState({
        checkIn: '',
        checkOut: '',
        guests: 1,
    });

    const handleChange = (e) => {
        setBookingData({
            ...bookingData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(
                createBooking({
                    ...bookingData,
                    roomId: room._id,
                    hotelId,
                })
            ).unwrap();
            onSuccess();
        } catch (error) {
            console.error('Booking failed:', error);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
                Book Room
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Check-in Date"
                            type="date"
                            name="checkIn"
                            value={bookingData.checkIn}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Check-out Date"
                            type="date"
                            name="checkOut"
                            value={bookingData.checkOut}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Number of Guests"
                            type="number"
                            name="guests"
                            value={bookingData.guests}
                            onChange={handleChange}
                            InputProps={{ inputProps: { min: 1 } }}
                            required
                        />
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Book Now
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default BookingForm;
