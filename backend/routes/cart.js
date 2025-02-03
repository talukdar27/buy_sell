const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Item = require('../models/item'); 
const DeliverItem = require('../models/deliver_items'); 
const { authenticateToken } = require('./auth');

// Add item to cart
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.body;
    console.log('Adding to cart - User ID:', req.user.userId);
    console.log('Item ID:', itemId);

    if (!itemId) {
      return res.status(400).json({ message: 'Item ID is required' });
    }

    // Check if item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.item_cart.includes(itemId)) {
      return res.status(400).json({ message: 'Item already in cart' });
    }

    user.item_cart.push(req.body.itemId);
    await user.save();
    res.json({ message: 'Item added to cart successfully', cart: user.item_cart });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid item ID format' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.delete('/remove', authenticateToken, async (req, res) => {
    console.log('===== REMOVE FROM CART REQUEST =====');
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    console.log('Authenticated User ID:', req.user.userId);
  
    try {
      const { itemId } = req.body;
      
      // Validate itemId
      if (!itemId) {
        console.log('Error: No Item ID provided');
        return res.status(400).json({ 
          message: 'Item ID is required',
          details: 'The request must include an itemId in the request body' 
        });
      }
  
      // Find user and validate
      const user = await User.findById(req.user.userId);
      if (!user) {
        console.log(`Error: User not found - ID: ${req.user.userId}`);
        return res.status(404).json({ 
          message: 'User not found',
          details: 'Could not locate user in the database' 
        });
      }
  
      // Find item index, using toString() for comparison
      const itemIndex = user.item_cart.findIndex(
        (cartItemId) => cartItemId.toString() === itemId
      );
  
      // Check if item is in cart
      if (itemIndex === -1) {
        console.log(`Error: Item not in cart - Item ID: ${itemId}`);
        return res.status(400).json({ 
          message: 'Item not in cart',
          details: 'The specified item was not found in the user\'s cart' 
        });
      }
  
      // Remove item from cart
      user.item_cart.splice(itemIndex, 1);
      await user.save();
  
      console.log(`Successfully removed item from cart - Item ID: ${itemId}`);
  
      // Populate cart items
      const updatedUser = await User.findById(req.user.userId)
        .populate('item_cart')
        .select('item_cart');
  
      res.status(200).json({
        message: 'Item removed from cart successfully',
        cart: updatedUser.item_cart
      });
  
    } catch (error) {
      console.error('Critical Error in Remove Cart Item:', error);
      
      // Comprehensive error response
      res.status(500).json({ 
        message: 'Server error during cart item removal',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });


  // Checkout items
router.post('/checkout', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('item_cart');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const itemsToDeliver = user.item_cart;
    const alreadyCheckedOutItems = [];

    // Check if any item has already been checked out by other users
    for (const item of itemsToDeliver) {
      const seller = await User.findById(item.userId);
      if (seller && seller.deliver_items.includes(item._id)) {
        alreadyCheckedOutItems.push(item);
      }
    }

    if (alreadyCheckedOutItems.length > 0) {
      return res.status(400).json({
        message: 'Some items have already been checked out by other users. Please remove these items from your cart.',
        alreadyCheckedOutItems,
      });
    }

    const generateOTP = () => {
      //return Math.floor(10000 + Math.random() * 90000).toString();
      const otp = Math.floor(10000 + Math.random() * 90000).toString();
      return otp.padStart(5, '0');
    };

    const otpGeneratedplain = generateOTP();


    user.item_cart = [];
    await user.save();


    // Add items to seller's deliver-items list
    for (const item of itemsToDeliver) {
      const seller = await User.findById(item.userId);
      if (seller) {
        seller.deliver_items = seller.deliver_items || [];
        seller.deliver_items.push(item._id);
        await seller.save();

        const deliverItem = new DeliverItem({
          sellerId: item.userId,
          buyerId: req.user.userId,
          itemId: item._id, 
          price: item.price,
          otp: otpGeneratedplain, // Replace with actual OTP generation logic
        });
        await deliverItem.save();
        item.status = 'Pending';
        await item.save();

      }
    }

    res.json({ message: 'Checkout successful', otp: otpGeneratedplain, itemsToDeliver });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get cart items for the current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('item_cart');
    res.json(user.item_cart);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;