const mongoose = require('mongoose');
const User = require('./user.model'); // Adjust path if needed

const mongoURI = 'mongodb+srv://vidyatestumesh_db_user:BJMWO0WncAlYOXWb@book-cluster.ufi2wnq.mongodb.net/test?retryWrites=true&w=majority&appName=book-cluster'; // Replace with your MongoDB URI

async function createAdmin() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existingAdmin = await User.findOne({ username: 'admin', role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const admin = new User({
      username: 'admin',
      password: 'admin',  // plaintext password; will be hashed by pre-save hook
      role: 'admin',
      name: 'Administrator',
      email: 'admin@example.com',
    });

    await admin.save();
    console.log('Admin user created successfully with hashed password');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();
