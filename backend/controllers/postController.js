const Post = require('../models/Post');

exports.list = async (req, res) => {
  const limit = parseInt(req.query.limit || '10');
  const page = parseInt(req.query.page || '1');
  const skip = (page - 1) * limit;
  try {
    const posts = await Post.find({ published: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name');
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.get = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');
    if (!post) return res.status(404).json({ message: 'Not found' });
    post.views = (post.views || 0) + 1;
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    console.log('📥 CREATE POST - Request received');
    console.log('📝 Request body:', req.body);
    console.log('👤 User making request:', {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role
    });

    const data = req.body;
    data.author = req.user._id;

    // Validate required fields
    if (!data.title || !data.slug || !data.content || !data.category) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields: title, slug, content, category' 
      });
    }

    console.log('📦 Data to create:', data);

    const post = await Post.create(data);
    
    console.log('✅ Post created successfully:', post._id);
    
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: post
    });

  } catch (err) {
    console.error('❌ CREATE POST ERROR:', err);
    
    // Handle duplicate slug error
    if (err.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'A post with this slug already exists' 
      });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ 
        success: false,
        message: messages.join(', ') 
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Server error: ' + err.message 
    });
  }
};

exports.update = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    if (String(post.author) !== String(req.user._id) && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden' });

    Object.assign(post, req.body);
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    if (String(post.author) !== String(req.user._id) && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden' });

    await post.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
