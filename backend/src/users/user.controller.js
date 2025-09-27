const admin = require('../config/firebase'); // Firebase Admin SDK
const User = require('./user.model');

exports.syncUser = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: 'ID token is required' });
  }

  try {
    // Decode token from Firebase
    const decoded = await admin.auth().verifyIdToken(idToken);
    console.log('✅ Firebase token decoded:', decoded);

    const uid = decoded.uid;
    const email = decoded.email || '';
    const name = decoded.name || 'Firebase User';
    const phone = decoded.phone_number || '';

    if (!uid || !email) {
      console.error('❌ Missing uid or email from Firebase token.');
      return res.status(400).json({ message: 'UID or email missing in token' });
    }

    // Fetch existing user to preserve values
    const existingUser = await User.findOne({ uid });

    const updatedUserData = {
      uid,
      email,
      role: 'user',
      lastLoginAt: new Date(),
    };

    // Only set name/username/phone if not already in DB
    if (!existingUser?.name) updatedUserData.name = name;
    if (!existingUser?.username) updatedUserData.username = name;
    if (!existingUser?.phone) updatedUserData.phone = phone;

    // Sync or insert into MongoDB
    const user = await User.findOneAndUpdate(
      { uid },
      { $set: updatedUserData },
      { upsert: true, new: true, runValidators: true }
    );

    console.log('✅ User synced to MongoDB:', user);

    res.status(200).json({ message: 'User synced successfully', user });
  } catch (err) {
    console.error('❌ syncUser error:', err.message);
    res.status(500).json({ message: 'Failed to sync user', error: err.message });
  }
};

exports.getUserProfile = async (req, res) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({ message: 'UID is required' });
  }

  try {
    const user = await User.findOne({ uid });

    if (!user) {
      console.warn(`⚠️ User not found for UID: ${uid}`);
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('❌ getUserProfile error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
