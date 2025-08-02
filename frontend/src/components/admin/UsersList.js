import React, { useState, useEffect } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { dashboardService } from '../../services/dashboardService';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await dashboardService.getUsers();
            setUsers(response);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = (user) => {
        setEditingUser({ ...user });
        setOpenDialog(true);
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            await dashboardService.deleteUser(userId);
            await fetchUsers(); // Refresh the list
        } catch (err) {
            setError(err.message || 'Failed to delete user');
        }
    };

    const handleSave = async () => {
        try {
            await dashboardService.updateUser(editingUser._id, editingUser);
            setOpenDialog(false);
            await fetchUsers(); // Refresh the list
        } catch (err) {
            setError(err.message || 'Failed to update user');
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell align="right">
                                        <IconButton 
                                            color="primary" 
                                            onClick={() => handleEdit(user)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton 
                                            color="error" 
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    {editingUser && (
                        <Box sx={{ pt: 2 }}>
                            <TextField
                                fullWidth
                                label="Name"
                                value={editingUser.name}
                                onChange={(e) => setEditingUser({ 
                                    ...editingUser, 
                                    name: e.target.value 
                                })}
                                margin="dense"
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                value={editingUser.email}
                                onChange={(e) => setEditingUser({ 
                                    ...editingUser, 
                                    email: e.target.value 
                                })}
                                margin="dense"
                            />
                            <TextField
                                fullWidth
                                select
                                label="Role"
                                value={editingUser.role}
                                onChange={(e) => setEditingUser({ 
                                    ...editingUser, 
                                    role: e.target.value 
                                })}
                                margin="dense"
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </TextField>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UsersList;
