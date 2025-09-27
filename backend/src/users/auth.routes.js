const express = require('express');
const router = express.Router();
const { login } = require('./auth.controller');  // Ensure you're importing the right controller function

// Admin login route
router.post('/admin', login);  // POST request for admin login

module.exports = router;
