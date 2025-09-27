const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  uid: { type: String, unique: true, sparse: true },  // For Firebase users
  username: { type: String, required: true },
  password: {
    type: String,
    required: function () {
      return this.role === 'admin';
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

// Hash password if admin and password is modified
userSchema.pre('save', async function (next) {
  if (this.role === 'admin' && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password (for admin login)
userSchema.methods.comparePassword = async function (candidate) {
  if (this.role !== 'admin') return false;
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
