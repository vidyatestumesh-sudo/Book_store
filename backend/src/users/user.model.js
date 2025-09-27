const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  uid: { type: String, unique: true, sparse: true },  // Use for Auth0 `sub` if needed
  username: { type: String, required: true },
  password: {
    type: String,
    required: function () {
      return this.role === 'admin';  // Password only required for admin users
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    required: true,
    default: 'user',
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  address: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLoginAt: Date,
});

// Hash password for admin users if password is modified
userSchema.pre('save', async function (next) {
  if (this.role === 'admin' && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10); // Hashing the password
  }
  next();
});

// Compare password for admin login
userSchema.methods.comparePassword = async function (candidate) {
  if (this.role !== 'admin') return false;  // Don't allow password comparison for non-admins
  return bcrypt.compare(candidate, this.password); // Compare hashed password with candidate
};

const User = mongoose.model('User', userSchema);

module.exports = User;
