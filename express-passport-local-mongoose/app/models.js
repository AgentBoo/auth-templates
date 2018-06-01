// NOTE: Model definition
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema{
  name       : { type: String, required: true },
  email      : { type: String, required: true, unique: true },
  password   : { type: String, required: true }
};

const User = mongoose.model('User', userSchema);

module.exports = User;


// methods ======================
// generating a hash
// userSchema.methods.generateHash = function(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };
//
// // checking if password is valid
// userSchema.methods.validPassword = function(password) {
//     return bcrypt.compareSync(password, this.local.password);
// };
