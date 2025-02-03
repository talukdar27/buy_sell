const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticateToken } = require('./auth'); // Import only the authenticateToken function

// Define your routes here
// router.post('/', authenticateToken, chatController.handleChat);
// //router.use(authMiddleware);

// router.post('/chat', chatController.handleChat);
// router.get('/history', chatController.getChatHistory);

// module.exports = router;

router.use(authenticateToken);

// Define routes
router.post('/', chatController.handleChat);
router.get('/history', chatController.getChatHistory);

module.exports = router;


