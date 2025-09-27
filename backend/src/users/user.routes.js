const express = require('express');
const router = express.Router();
const { getUserProfile } = require('./user.controller');
const verifyToken = require('./auth.middleware');  // Protect routes with token verification

// Route to get user profile
router.get('/:uid', verifyToken, getUserProfile);

module.exports = router;
