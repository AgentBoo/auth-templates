// NOTE: Model definition
const mongoose = require('mongoose'),
      argon2 = require('argon2');

const userSchema = new mongoose.Schema({
  username   : { type: String, required: true },
  email      : { type: String, required: true, unique: true },
  password   : { type: String, required: true }
});

// does not work with arrow functions
userSchema.pre('save', function(next){
  let user = this;

  argon2.hash(user.password)
        .then(hash => {
          user.password = hash;
          next(null)
        })
        .catch(err => {
          console.error(err)
          next(err)
        })
})

userSchema.methods.verify = function(password, next){
  argon2.verify(this.password, password)
        .then(match => next(match))
        .catch(err => {
          console.error(err)
          next(err)
        })
}

const User = mongoose.model('User', userSchema);

module.exports = User;
