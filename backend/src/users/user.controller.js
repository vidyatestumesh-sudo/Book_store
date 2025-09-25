const User = require('./user.model');

exports.registerUser = async (req, res) => {
  try {
    const { username, name, email, phone, address, password } = req.body;
    let { role } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    if (!role) {
      role = 'user';  // default role if not provided
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({
      username,
      name,
      email,
      phone,
      address,
      role,
      password
    });

    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
