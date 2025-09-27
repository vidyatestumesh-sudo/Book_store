const admin = require('firebase-admin');
const serviceAccount = require('./book-store-mern-app-f2625-firebase-adminsdk-fbsvc-3a8a43a0a4.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
