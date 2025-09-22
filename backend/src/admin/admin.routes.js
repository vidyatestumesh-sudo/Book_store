// src/admin/admin.routes.js

const express = require('express');
const router = express.Router();

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Hardcoded admin credentials (for quick testing)
  if (username === 'admin' && password === 'admin') {
    // Generate a dummy token or use real JWT
    const token = 'dummy-token-for-admin';

    return res.json({ token });
  } else {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
});

module.exports = router;
