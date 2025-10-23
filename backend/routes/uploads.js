// routes/uploads.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadImage } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');

// Add error handling for multer
const uploadMiddleware = (req, res, next) => {
  upload.single('image')(req, res, function (err) {
    if (err) {
      console.error('❌ Upload middleware error:', err.message);
      return res.status(400).json({ 
        message: 'Upload failed: ' + err.message 
      });
    }
    next();
  });
};

router.post('/', protect, authorize('author','admin'), uploadMiddleware, uploadImage);

module.exports = router;