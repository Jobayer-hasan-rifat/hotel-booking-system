const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');

// Register route
router.post('/register', validateUserRegistration, async (req, res) => {
    try {
        const result = await authService.registerUser(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login route
router.post('/login', validateUserLogin, async (req, res) => {
    try {
        const result = await authService.loginUser(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

module.exports = router;
