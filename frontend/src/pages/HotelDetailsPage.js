import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  CircularProgress,
  ImageList,
  ImageListItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LocationOn,
  Hotel,
  AttachMoney,
  Person,
  Pool,
  Wifi,
  LocalParking,
  Restaurant,
  AcUnit,
} from '@mui/icons-material';
import { fetchHotelById } from '../store/slices/hotelSlice';

const HotelDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedHotel: hotel, loading, error } = useSelector((state) => state.hotels);

  useEffect(() => {
    dispatch(fetchHotelById(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" mt={4}>{error}</Typography>
      </Container>
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
    <Box sx={{ py: 4, backgroundColor: '#f5f5f5' }}>
      <Container>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <ImageList cols={2} rowHeight={300} gap={8}>
                {(hotel.images || ['https://source.unsplash.com/random/?hotel']).map((image, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={image}
                      alt={`Hotel view ${index + 1}`}
                      style={{ height: '100%', width: '100%', objectFit: 'cover', borderRadius: 8 }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Grid>
            
            <Grid item xs={12} md={5}>
              <Typography variant="h4" gutterBottom color="primary">
                {hotel.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn color="action" sx={{ mr: 1 }} />
                <Typography variant="subtitle1">
                  {hotel.location}
                </Typography>
              </Box>

              <Typography variant="h5" color="primary" sx={{ mt: 3, mb: 2 }}>
                ${hotel.pricePerNight} / night
              </Typography>

              <Typography variant="body1" paragraph>
                {hotel.description}
              </Typography>

              <List>
                {hotel.amenities?.map((amenity, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {amenity.toLowerCase().includes('wifi') ? <Wifi /> :
                       amenity.toLowerCase().includes('pool') ? <Pool /> :
                       amenity.toLowerCase().includes('parking') ? <LocalParking /> :
                       amenity.toLowerCase().includes('restaurant') ? <Restaurant /> :
                       amenity.toLowerCase().includes('ac') ? <AcUnit /> : <Hotel />}
                    </ListItemIcon>
                    <ListItemText primary={amenity} />
                  </ListItem>
                ))}
              </List>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => navigate(`/booking/${hotel._id}`)}
                sx={{ mt: 3 }}
              >
                Book Now
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default HotelDetailsPage;
