const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const { authenticateToken } = require('./auth'); // Ensure this path is correct

// Add new item
router.post('/', authenticateToken, async (req, res) => {
  const { itemName, price, description, category, status } = req.body;
  const userId = req.user.userId;

  try {
    const newItem = new Item({
      itemName,
      price,
      description,
      category,
      userId,
      status, // Include status in the new item
    });

    await newItem.save();
    res.status(201).json({ message: 'Item added successfully', item: newItem });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get items for the current user
router.get('/my-items', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const items = await Item.find({ userId });
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get items excluding current user's items
router.get('/other-items', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const items = await Item.find({ userId: { $ne: userId } });
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get item details by item ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const itemId = req.params.id;
    
    // Log the item ID being requested
    console.log('Requesting item with ID:', itemId);

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    console.log('Item details:', item); // Print item details in the terminal
    res.json(item);
  } catch (error) {
    console.error('Error fetching item details:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid item ID format' });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update item status
router.put('/:id/status', authenticateToken, async (req, res) => {
  const { status } = req.body;
  const itemId = req.params.id;

  try {
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.status = status;
    await item.save();
    res.status(200).json({ message: 'Item status updated successfully', item });
  } catch (error) {
    console.error('Error updating item status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;