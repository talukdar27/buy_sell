const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');
const Item = require('../models/item');
const User = require('../models/user');
const DeliverItem = require('../models/deliver_items');

// Get order history for the current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const soldItems = await Item.find({ userId, status: 'Sold' });

    const user = await User.findById(userId).populate('boughtItems');
    const boughtItems = user.boughtItems;

    const pendingOrders = await DeliverItem.find({ buyerId: userId, status: 'Pending' })
      .populate({
        path: 'itemId', 
        select: 'itemName description price category status'
      });

    res.json({ soldItems, boughtItems, pendingOrders });
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;