const authService = require('../services/authService');

class AuthController {
    // Register new user
    async register(req, res) {
        try {
            const result = await authService.registerUser(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Login user
    async login(req, res) {
        try {
            const result = await authService.loginUser(req.body);
            res.status(200).json(result);
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
}

module.exports = new AuthController();
