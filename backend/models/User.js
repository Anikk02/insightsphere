const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  role: { 
    type: String, 
    enum: ['reader','author','admin'], 
    default: 'reader' 
  },
  avatar: { 
    type: String 
  },
  gender: { 
    type: String, 
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    default: 'prefer-not-to-say'
  },
  age: { 
    type: Number,
    min: 1,
    max: 120
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('User', UserSchema);