const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const deliverItemSchema = new mongoose.Schema({
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending',
    required: true,
  },
});

// Hash the OTP before saving
deliverItemSchema.pre('save', async function (next) {
  if (!this.isModified('otp')) return next();
  this.otp = await bcrypt.hash(this.otp, 10);
  next();
});

const DeliverItem = mongoose.model('DeliverItem', deliverItemSchema);
module.exports = DeliverItem;