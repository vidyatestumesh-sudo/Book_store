const mongoose = require('mongoose');
const Admin = require('./admin.model');
require('dotenv').config();

async function createOrUpdateAdmin() {
  await mongoose.connect(process.env.DB_URL);

  const existingAdmin = await Admin.findOne({ username: 'admin' });
  if (existingAdmin) {
    console.log('Admin user already exists');
  } else {
    const newAdmin = new Admin({
      username: 'admin',
      password: 'admin' // will be hashed automatically by pre-save hook
    });
    await newAdmin.save();
    console.log('Admin user created with username: admin and password: admin');
  }

  mongoose.disconnect();
}

createOrUpdateAdmin().catch(console.error);
