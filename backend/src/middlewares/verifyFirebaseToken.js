const admin = require('../config/firebase');

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Access Denied. No token provided.' });

  const token = authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach user info to request
    next();
  } catch (err) {
    console.error('Firebase token verification failed:', err);
    res.status(403).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyFirebaseToken;
