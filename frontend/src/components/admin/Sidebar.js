import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Box,
    Divider,
    useTheme,
    useMediaQuery,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Hotel as HotelIcon,
    MeetingRoom as RoomIcon,
    BookOnline as BookingIcon,
    People as UserIcon,
    Settings as SettingsIcon,
    Menu as MenuIcon,
} from '@mui/icons-material';
const Sidebar = ({ width = 240, activeSection, onSectionChange }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const isActive = (section) => {
        return activeSection === section;
    };

    const drawerStyle = {
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
            width,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #1976d2 0%, #1565c0 100%)',
            color: 'white',
            borderRight: 'none',
        },
    };

    const menuItems = [
        {
            text: 'Dashboard',
            icon: <DashboardIcon />,
            section: 'dashboard',
            implemented: true
        },
        {
            text: 'Hotels',
            icon: <HotelIcon />,
            section: 'hotels',
            implemented: false
        },
        {
            text: 'Rooms',
            icon: <RoomIcon />,
            section: 'rooms',
            implemented: false
        },
        {
            text: 'Bookings',
            icon: <BookingIcon />,
            section: 'bookings',
            implemented: false
        },
        {
            text: 'Users',
            icon: <UserIcon />,
            section: 'users',
            implemented: true
        },
        {
            text: 'Settings',
            icon: <SettingsIcon />,
            section: 'settings',
            implemented: false
        },
    ];

    const drawer = (
        <>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: '1.2rem', fontWeight: 600 }}>
                    Admin Panel
                </Typography>
                {isMobile && (
                    <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
                        <MenuIcon />
                    </IconButton>
                )}
            </Box>
            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
            <List>
                {menuItems.map((item) => (
                    <Tooltip 
                        key={item.text}
                        title={!item.implemented ? 'Coming Soon' : ''} 
                        placement="right"
                    >
                        <ListItem
                            button
                            onClick={() => {
                                if (item.implemented && onSectionChange) {
                                    onSectionChange(item.section);
                                    if (isMobile) {
                                        setMobileOpen(false);
                                    }
                                }
                            }}
                            sx={{
                                bgcolor: isActive(item.section) ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.08)'
                                },
                                opacity: item.implemented ? 1 : 0.6,
                                transition: 'all 0.2s ease',
                                position: 'relative',
                                borderLeft: isActive(item.section) ? '4px solid #ffffff' : '4px solid transparent',
                                '&::after': item.implemented ? {} : {
                                    content: '"Coming Soon"',
                                    position: 'absolute',
                                    right: '8px',
                                    bottom: '4px',
                                    fontSize: '0.65rem',
                                    color: 'rgba(255, 255, 255, 0.7)'
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText 
                                primary={item.text} 
                                sx={{
                                    '& .MuiTypography-root': {
                                        fontWeight: isActive(item.section) ? 600 : 400
                                    }
                                }}
                            />
                        </ListItem>
                    </Tooltip>
                ))}
            </List>
        </>
    );

    return (
        <>
            {isMobile && (
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{
                        position: 'fixed',
                        left: 16,
                        top: 16,
                        zIndex: (theme) => theme.zIndex.drawer + 2,
                        bgcolor: '#1976d2',
                        '&:hover': {
                            bgcolor: '#1565c0'
                        }
                    }}
                >
                    <MenuIcon />
                </IconButton>
            )}
            <Box
                component="nav"
                sx={{
                    width: { sm: width },
                    flexShrink: { sm: 0 }
                }}
            >
                {isMobile ? (
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true // Better mobile performance
                        }}
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': {
                                width,
                                boxSizing: 'border-box',
                                background: 'linear-gradient(180deg, #1976d2 0%, #1565c0 100%)',
                                color: 'white',
                                borderRight: 'none',
                                marginTop: '64px', // Height of the AppBar
                                height: 'calc(100% - 64px)'
                            }
                        }}
                    >
                        {drawer}
                    </Drawer>
                ) : (
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            '& .MuiDrawer-paper': {
                                width,
                                boxSizing: 'border-box',
                                background: 'linear-gradient(180deg, #1976d2 0%, #1565c0 100%)',
                                color: 'white',
                                borderRight: 'none',
                                marginTop: '64px', // Height of the AppBar
                                height: 'calc(100% - 64px)'
                            }
                        }}
                        open
                    >
                        {drawer}
                    </Drawer>
                )}
            </Box>
        </>
    );
};

export default Sidebar;
