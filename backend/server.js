require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
const morgan = require('morgan');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs')
// routes
const postsRoute = require('./routes/posts');
const usersRoute = require('./routes/users');
const categoriesRoute = require('./routes/categories');

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/posts', postsRoute);
app.use('/api/users', usersRoute);
app.use('/api/categories', categoriesRoute);
// Add this line with your other route imports
app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => res.send({ status: 'ok', msg: 'InsightSphere API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// after: app.use('/api/categories', categoriesRoute);
const uploadsRoute = require('./routes/uploads');
app.use('/api/uploads', uploadsRoute);

app.get('/', (req, res) => {
  res.send('InsightSphere backend is running!');
});

// Add this to your server.js, app.js, or index.js
app.get('/api/generate-hash', async (req, res) => {
  try {
    const hash = await bcrypt.hash('Aniket02082021@#', 12);
    res.json({ hashedPassword: hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add to your server.js or routes
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