const User = require('./user.model');

// Get profile or create if not exists
exports.getOrCreateProfile = async (req, res) => {
  const { uid, email } = req.firebaseUser;

  try {
    let user = await User.findOne({ uid });

    // Create if doesn't exist
    if (!user) {
      user = new User({ uid, email });
      await user.save();
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update profile (except uid/email)
exports.updateProfile = async (req, res) => {
  const { uid } = req.firebaseUser;
  const updates = req.body;

  // Don't allow email or UID changes
  delete updates.email;
  delete updates.uid;

  try {
    const user = await User.findOneAndUpdate({ uid }, updates, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};
