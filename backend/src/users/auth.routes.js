const express = require('express');
const router = express.Router();
const { adminLogin } = require('./auth.controller');

router.post('/admin', adminLogin); // now it's POST /api/admin-auth/admin

module.exports = router;
