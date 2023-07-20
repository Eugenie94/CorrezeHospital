const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  }
}, {versionKey : false});

const User = mongoose.model('users', userSchema, 'users');

module.exports = User;
