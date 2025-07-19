const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  role: { 
    type: String, 
    enum: ['admin', 'member'], 
    default: 'member' 
  },
  joinedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { _id: false });

module.exports = memberSchema; 