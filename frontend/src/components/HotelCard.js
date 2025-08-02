import React from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HotelCard = ({ hotel }) => {
    const navigate = useNavigate();

    return (
        <Card sx={{ maxWidth: 345, m: 2 }}>
            <CardMedia
                component="img"
                height="140"
                image={hotel.image || 'https://via.placeholder.com/300x200'}
                alt={hotel.name}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {hotel.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {hotel.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {hotel.description.substring(0, 100)}...
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <Button
                        variant="contained"
                        onClick={() => navigate(`/hotels/${hotel._id}`)}
                    >
                        View Details
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default HotelCard;
