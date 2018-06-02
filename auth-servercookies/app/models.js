// NOTE: Model definition
const mongoose = require('mongoose'),
      passportPlugin = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  name       : { type: String, required: true },
  email      : { type: String, required: true, unique: true },
  password   : { type: String, required: true }
});

// uses pbkdf2 implementation with sha256 digest algorithm
userSchema.plugin(passportPlugin);

const User = mongoose.model('User', userSchema);

module.exports = User;
