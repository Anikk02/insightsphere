// In your uploadController.js
exports.uploadImage = (req, res) => {
  try {
    console.log('📥 UPLOAD - Request received');
    console.log('📥 UPLOAD - File exists:', !!req.file);
    console.log('📥 UPLOAD - File info:', req.file ? {
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path,
      filename: req.file.filename
    } : 'No file');

    if (!req.file) {
      console.log('❌ UPLOAD - No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('✅ UPLOAD - File processed successfully');
    console.log('✅ UPLOAD - Cloudinary URL:', req.file.path);
    
    return res.status(201).json({
      message: 'File uploaded successfully',
      url: req.file.path,
      filename: req.file.originalname,
      size: req.file.size
    });
    
  } catch (err) {
    console.error('❌ UPLOAD - Error:', err);
    res.status(500).json({ 
      message: 'Upload failed: ' + err.message 
    });
  }
};