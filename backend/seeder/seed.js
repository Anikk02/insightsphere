// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Post = require('../models/Post');

const seed = async () => {
  try {
    await connectDB();

    const dataPath = path.join(__dirname, '..', 'sample_data.json');
    const raw = fs.readFileSync(dataPath);
    const { users, categories, posts } = JSON.parse(raw);

    // clear
    await User.deleteMany({});
    await Category.deleteMany({});
    await Post.deleteMany({});

    // users
    const createdUsers = [];
    for (const u of users) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(u.password_plain || 'password123', salt);
      const user = await User.create({
        name: u.name,
        email: u.email,
        password: hashed,
        role: u.role || 'reader'
      });
      createdUsers.push(user);
    }

    // categories
    const createdCats = [];
    for (const c of categories) {
      const cat = await Category.create(c);
      createdCats.push(cat);
    }

    // posts
    for (const p of posts) {
      const author = createdUsers.find(u => u.email === p.authorEmail) || createdUsers[0];
      await Post.create({
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content,
        author: author._id,
        category: p.category,
        tags: p.tags,
        image: p.image,
        featured: p.featured,
        published: p.published
      });
    }

    console.log('Seed completed.');
    process.exit();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
