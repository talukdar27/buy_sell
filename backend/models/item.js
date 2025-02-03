const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['Sale', 'Pending', 'Sold'],
    default: 'Sale',
    required: true,
  },
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;