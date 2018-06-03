// NOTE: Model definition
const mongoose = require('mongoose'),
      argon2 = require('argon2');

const userSchema = new mongoose.Schema({
  username   : { type: String, required: true },
  email      : { type: String, required: true, unique: true },
  password   : { type: String, required: true }
});

// does not work with arrow function u6
userSchema.pre('save', function(next){
  let user = this;
  argon2.hash(user.password)
        .then(hash => {
          user.password = hash;
          next(null)
        })
        .catch(err => next(err))
})

userSchema.methods.validPassword = function(password){
  return argon2.verify(this.password, password)
               .then(match => resolve(match))
               .catch(err => console.error(err))
}

const User = mongoose.model('User', userSchema);

module.exports = User;
