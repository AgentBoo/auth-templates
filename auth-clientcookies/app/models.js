// NOTE: Model definition
const mongoose = require('mongoose'),
      argon2 = require('argon2');

const userSchema = new mongoose.Schema({
  username   : { type: String, required: true },
  email      : { type: String, required: true, unique: true },
  password   : { type: String, required: true }
});

// do not use arrow functions and their -this-
// mongoose issues #3333, #3379 ...
userSchema.pre('save', function(next){
  let user = this;

    argon2.hash(user.password)
          .then(hash => {
            user.password = hash
            next()
        })
          .catch(err => {
            console.error(err)
            next(err)
        })
});

// check if password is valid
userSchema.methods.verify = function(password, next){
    argon2.verify(this.password, password)
          .then(match => next(match))
          .catch(err => {
            console.error(err)
            next(err)
          })
};

const User = mongoose.model('User', userSchema);

module.exports = User;
