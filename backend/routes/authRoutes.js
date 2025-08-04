const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');

// Register route
router.post('/register', validateUserRegistration, authController.register);

// Login route
router.post('/login', validateUserLogin, authController.login);

module.exports = router;
