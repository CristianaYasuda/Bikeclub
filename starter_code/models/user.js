const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  user: { type: String, required: true, unique: true },
  email: String,
  password: String,
  isMember: { type: Boolean, default: false }
  // isLaunderer: { type: Boolean, default: false },
  // fee: { type: Number, default: null }
});

userSchema.set('timestamps', true);

const User = mongoose.model('User', userSchema);

module.exports = User;
