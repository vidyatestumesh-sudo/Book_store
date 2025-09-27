const jwt = require('jsonwebtoken');
const User = require('./user.model');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const adminUser = await User.findOne({ username, role: 'admin' });

    if (!adminUser) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await adminUser.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: adminUser._id, role: adminUser.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Authentication successful',
      token,
      user: { username: adminUser.username, role: adminUser.role },
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
