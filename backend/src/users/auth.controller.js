// backend/auth.controller.js
const User = require('./user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username and password are required" });

  try {
    const adminUser = await User.findOne({ username, role: 'admin' });

    if (!adminUser)
      return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: adminUser._id, role: adminUser.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: "Authentication successful",
      token,
      user: {
        username: adminUser.username,
        role: adminUser.role,
      },
    });

  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};
