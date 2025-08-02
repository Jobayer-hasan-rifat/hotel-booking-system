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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';

const UsersSection = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users');
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setEditUser(user);
        setOpenDialog(true);
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message);
            }

            setUsers(users.filter(user => user._id !== userId));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/users/${editUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editUser),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message);
            }

            setUsers(users.map(user => 
                user._id === editUser._id ? editUser : user
            ));
            setOpenDialog(false);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <>
            <TableContainer component={Paper} sx={{ bgcolor: '#f5f5f5' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(user)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(user._id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    {editUser && (
                        <>
                            <TextField
                                fullWidth
                                label="Name"
                                value={editUser.name}
                                onChange={(e) => setEditUser({...editUser, name: e.target.value})}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                value={editUser.email}
                                onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Role"
                                value={editUser.role}
                                onChange={(e) => setEditUser({...editUser, role: e.target.value})}
                                margin="normal"
                                select
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </TextField>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UsersSection;
