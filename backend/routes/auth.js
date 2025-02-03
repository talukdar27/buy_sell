const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');

// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  console.log('Received token:', token); // Debug log
  if (!token)
    { console.log('No token provided');
      return res.status(401).json({ message: 'Access denied. No token provided.' });

}
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.log('Token verification failed:', error); 
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// Signup route
router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, age, contactNumber, password } = req.body;
  if (!firstName || !lastName || !email || !age || !contactNumber || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    // console.log('Hashed password:', hashedPassword);
    // console.log('Plain password:', password);

    const user = new User({ firstName, lastName, email, age, contactNumber, password });
    await user.save();

    // Verify that the password and hashed password match
    // const isMatch = await bcrypt.compare(password, user.password);
    // console.log('Password matches after signup:', isMatch);

    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Email received:', email);
  console.log('Password received:', password);

  if (!email || !password) {
    console.log('Error: Missing email or password');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    console.log('User found:', user);
    if (!user) {
      console.log('Error: No user found with the given email');
      return res.status(400).json({ message: 'Invalid email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password matches:', isMatch);

    if (!isMatch) {
      console.log('Error: Password mismatch');
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token });
    console.log('Generated Token:', token);

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user details by user ID
router.get('/user/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('firstName lastName');
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user details
router.put('/user', authenticateToken, async (req, res) => {
  const { firstName, lastName, email, age, contactNumber } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { firstName, lastName, email, age, contactNumber },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// In routes/auth.js, modify the change-password route:
router.put('/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  try {
    // Find the user
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password - don't hash it here, let the pre-save middleware handle it
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Export the authenticateToken function
module.exports = {
  router,
  authenticateToken,
};
