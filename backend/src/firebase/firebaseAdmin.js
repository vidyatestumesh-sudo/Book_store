// firebaseAdmin.js
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(), // or use cert()
});

module.exports = admin;
