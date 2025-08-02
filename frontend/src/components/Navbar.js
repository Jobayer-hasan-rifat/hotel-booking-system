import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <AppBar 
            position="static" 
            sx={{
                background: 'linear-gradient(to right, #1a237e, #0d47a1)',
                boxShadow: 3
            }}
        >
            <Toolbar>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ 
                        flexGrow: 1, 
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        letterSpacing: 1
                    }}
                    onClick={() => navigate('/')}
                >
                    MyBook
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {user ? (
                        <>
                            <Button
                                color="inherit"
                                onClick={() => navigate(user.isAdmin ? '/admin/dashboard' : '/dashboard')}
                            >
                                {user.isAdmin ? 'Admin Dashboard' : 'Dashboard'}
                            </Button>
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                color="inherit"
                                onClick={() => navigate('/login')}
                                sx={{ 
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                                }}
                            >
                                User Login
                            </Button>
                            <Button
                                color="inherit"
                                onClick={() => navigate('/admin/login')}
                                sx={{ 
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                                }}
                            >
                                Admin Login
                            </Button>
                            <Button
                                color="inherit"
                                onClick={() => navigate('/signup')}
                                variant="outlined"
                                sx={{ 
                                    borderColor: 'white',
                                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255, 255, 255, 0.1)' }
                                }}
                            >
                                Sign Up
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
