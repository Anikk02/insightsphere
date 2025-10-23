const Category = require('../models/Category');

exports.list = async (req, res) => {
  try {
    const cats = await Category.find({});
    res.json(cats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const cat = await Category.create(req.body);
    res.status(201).json(cat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    // return posts in this category
    const posts = await require('../models/Post').find({ category: new RegExp(`^${slug}$`, 'i'), published: true }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
