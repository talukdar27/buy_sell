const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); 

//const authRoutes = require('./routes/auth');
const { router: authRouter } = require('./routes/auth');
const itemRoutes = require('./routes/items');
const cartRoutes = require('./routes/cart');
const deliverItemsRoutes = require('./routes/deliverItems');
const orderHistoryRoutes = require('./routes/order_history'); 
const supportRoutes = require('./routes/support'); 

const app = express();
const PORT =  5000;

// Enable CORS
app.use(cors( {
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}
));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB', err);
    process.exit(1);
  });

  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });


// Routes
app.use('/api/auth', authRouter);
app.use('/api/items', itemRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/deliver-items', deliverItemsRoutes);
app.use('/api/order-history', orderHistoryRoutes); 
app.use('/api/support', supportRoutes); 

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});



app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Enhanced server error handling
server.on('error', (err) => {
  console.error('Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  }
});


// Handle server errors
// server.on('error', (err) => {
//   console.error('Server error:', err);
// });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});