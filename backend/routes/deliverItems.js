const express = require('express');
const router = express.Router();
const DeliverItem = require('../models/deliver_items');
const Item = require('../models/item');
const User = require('../models/user'); // Import User model
const { authenticateToken } = require('./auth');
const bcrypt = require('bcryptjs');

// Get deliver items for the current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const deliverItems = await DeliverItem.find({ sellerId: req.user.userId, status: 'Pending' })
      .populate('buyerId', 'firstName lastName email')
      .populate('itemId', 'itemName description price');
    res.json(deliverItems);
  } catch (error) {
    console.error('Error fetching deliver items:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify OTP and complete transaction
router.post('/complete-transaction', authenticateToken, async (req, res) => {
  const { deliverItemId, otp } = req.body;

  console.log('Received verification request:', {
    deliverItemId,
    submittedOtp: otp
  });

  try {
    const deliverItem = await DeliverItem.findById(deliverItemId).populate('itemId');
    if (!deliverItem) {
      return res.status(404).json({ message: 'Deliver item not found' });
    }

    const isValidOTP = await bcrypt.compare(otp.toString().trim(), deliverItem.otp);
    
    if (!isValidOTP) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Update item status to Sold
    deliverItem.itemId.status = 'Sold';
    await deliverItem.itemId.save();

    // Update deliver item status to Completed
    deliverItem.status = 'Completed';
    await deliverItem.save();

    // Add item to buyer's boughtItems list
    const buyer = await User.findById(deliverItem.buyerId);
    if (buyer) {
      buyer.boughtItems = buyer.boughtItems || [];
      buyer.boughtItems.push(deliverItem.itemId);
      await buyer.save();
    }

    res.status(200).json({ message: 'Order successfully completed' });
  } catch (error) {
    console.error('Error completing transaction:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;