const mongoose = require('mongoose');
const User = require('./user.model'); // Adjust path if needed
require('dotenv').config();  // Ensure you load environment variables

async function createAdmin() {
  try {
    // Connect to MongoDB using the URI from .env
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Check if an admin user already exists
    const existingAdmin = await User.findOne({ username: 'admin', role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create a new admin user
    const admin = new User({
      username: 'admin',
      password: 'admin',  // Note: This password will be hashed in the `pre-save` hook
      role: 'admin',
      name: 'Administrator',
      email: 'admin@example.com',
    });

    // Save the admin user to the database
    await admin.save();
    console.log('Admin user created successfully with hashed password');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();
