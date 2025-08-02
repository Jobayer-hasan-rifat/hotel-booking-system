import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  CircularProgress,
} from '@mui/material';
import { Search, LocationOn, DateRange, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotels } from '../store/slices/hotelSlice';

const HomePage = () => {
  const [searchParams, setSearchParams] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: '',
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { hotels, loading, error } = useSelector((state) => state.hotels);

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  const handleSearch = () => {
    dispatch(fetchHotels(searchParams));
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
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        pt: 4 
      }}>
        <Container>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4,
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: 2,
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" color="error" gutterBottom>
              {error}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => dispatch(fetchHotels())}
              sx={{ mt: 2 }}
            >
              Try Again
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
            pt: 4 
        }}>
            <Container>
                {/* Hero Section */}
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 4, 
                        mb: 4, 
                        background: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: 2
                    }}
                >
                    <Typography variant="h3" align="center" gutterBottom color="primary">
                        Welcome to MyBook
                    </Typography>
                    <Typography variant="h6" align="center" color="text.secondary" paragraph>
                        Book your perfect stay with MyBook - Hotels, resorts, and vacation homes at the best prices
                    </Typography>

                    {/* Search Bar */}
                    <Grid container spacing={2} sx={{ mt: 3 }}>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                label="Location"
                                value={searchParams.location}
                                onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationOn color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Check In"
                                value={searchParams.checkIn}
                                onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DateRange color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Check Out"
                                value={searchParams.checkOut}
                                onChange={(e) => setSearchParams({ ...searchParams, checkOut: e.target.value })}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DateRange color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={handleSearch}
                                startIcon={<Search />}
                                sx={{ height: '56px' }}
                            >
                                Search
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Featured Categories */}
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    {['Luxury', 'Business', 'Resort', 'Family'].map((category) => (
                        <Grid item xs={12} sm={6} md={3} key={category}>
                            <Paper
                                sx={{
                                    p: 3,
                                    textAlign: 'center',
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: 2,
                                    transition: 'transform 0.2s',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                    }
                                }}
                                onClick={() => setSearchParams({ ...searchParams, category: category.toLowerCase() })}
                            >
                                <Typography variant="h6" color="primary" gutterBottom>
                                    {category}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Explore {category.toLowerCase()} hotels
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Popular Amenities */}
                <Paper sx={{ p: 4, mb: 6, background: 'rgba(255, 255, 255, 0.9)', borderRadius: 2 }}>
                    <Typography variant="h5" gutterBottom align="center" color="primary" sx={{ mb: 4 }}>
                        Popular Amenities
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        {['Swimming Pool', 'Free WiFi', 'Spa', 'Restaurant', 'Gym', 'Room Service'].map((amenity) => (
                            <Grid item xs={6} sm={4} md={2} key={amenity}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                                        color: 'white',
                                        borderRadius: 2
                                    }}
                                >
                                    <Typography variant="body1">{amenity}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>

                {/* Hotel Cards Section */}
                <Typography variant="h4" sx={{ mb: 4, color: 'white', textAlign: 'center' }}>
                    Featured Hotels
                </Typography>
                <Grid container spacing={3}>
                    {Array.isArray(hotels) && hotels.length > 0 ? (
                        hotels.map((hotel) => (
                            <Grid item xs={12} sm={6} md={4} key={hotel._id}>
                                <Card 
                                    sx={{ 
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'all 0.3s ease',
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'translateY(-10px)',
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                                        }
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={hotel.images?.[0] || 'https://source.unsplash.com/random/?hotel'}
                                        alt={hotel.name}
                                        sx={{
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.1)',
                                            }
                                        }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                        <Typography gutterBottom variant="h5" component="h2" color="primary">
                                            {hotel.name}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <LocationOn color="action" sx={{ mr: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {hotel.location}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            {hotel.description}
                                        </Typography>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            mt: 2
                                        }}>
                                            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                                ${hotel.pricePerNight}
                                            </Typography>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                per night
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                    <CardActions sx={{ p: 2, pt: 0 }}>
                                        <Button 
                                            fullWidth
                                            variant="outlined" 
                                            color="primary"
                                            onClick={() => navigate(`/hotels/${hotel._id}`)}
                                            sx={{ mr: 1 }}
                                        >
                                            View Details
                                        </Button>
                                        <Button 
                                            fullWidth
                                            variant="contained" 
                                            color="primary"
                                            onClick={() => navigate(`/booking/${hotel._id}`)}
                                            sx={{
                                                background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                                                '&:hover': {
                                                    background: 'linear-gradient(45deg, #1976d2 30%, #1ea7f0 90%)',
                                                }
                                            }}
                                        >
                                            Book Now
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Paper 
                                sx={{ 
                                    p: 4, 
                                    textAlign: 'center',
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: 2
                                }}
                            >
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    No hotels found
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Try adjusting your search criteria or check back later for new listings.
                                </Typography>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
};

export default HomePage;
