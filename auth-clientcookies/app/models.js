// NOTE: Model definition
const mongoose = require('mongoose'),
      argon2 = require('argon2');

const userSchema = new mongoose.Schema({
  name       : { type: String, required: true },
  email      : { type: String, required: true, unique: true },
  password   : { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;


userSchema.methods.encrypt = function(password, callback) {
    argon2.hash(password).then(hash => callback(hash))
                         .catch(err => callback(err))
};

// checking if password is valid
userSchema.methods.validPassword = function(password, callback) {
    argon2.verify(password, this.password).then(match => callback(match))
                                          .catch(err => callback(err))
};
