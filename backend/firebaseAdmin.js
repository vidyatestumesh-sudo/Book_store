const admin = require("firebase-admin");

// You can generate this from Firebase Console > Project Settings > Service accounts > Generate new private key
const serviceAccount = require("./path/to/your-firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
