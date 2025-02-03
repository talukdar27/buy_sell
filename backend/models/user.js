const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  contactNumber: { type: String, required: true },
  password: { type: String, required: true },
  item_cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }], // Add item_cart field
  deliver_items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }], // Add deliver_items field
  boughtItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }], // Add boughtItems field
});

//Hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
