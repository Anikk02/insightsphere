require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// routes
const postsRoute = require('./routes/posts');
const usersRoute = require('./routes/users');
const categoriesRoute = require('./routes/categories');
const authRoute = require('./routes/auth');
const uploadsRoute = require('./routes/uploads');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes - define ALL routes in one place
app.use('/api/posts', postsRoute);
app.use('/api/users', usersRoute);
app.use('/api/categories', categoriesRoute);
app.use('/api/auth', authRoute);
app.use('/api/uploads', uploadsRoute);

// Health check route (only one definition)
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    msg: 'InsightSphere API running',
    timestamp: new Date().toISOString()
  });
});

// Cloudinary check route
app.get('/api/cloudinary-check', async (req, res) => {
  try {
    const cloudinary = require('./config/cloudinary');
    
    // Test Cloudinary configuration
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary ping result:', result);
    
    res.json({ 
      success: true, 
      message: 'Cloudinary is configured correctly',
      cloudName: cloudinary.config().cloud_name
    });
  } catch (error) {
    console.error('❌ Cloudinary check failed:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Cloudinary configuration error: ' + error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});