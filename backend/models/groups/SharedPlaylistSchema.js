const mongoose = require('mongoose');

const sharedPlaylistSchema = new mongoose.Schema({
  playlistId: { 
    type: String, 
    required: true
  },
  sharedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  sharedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { _id: false });

module.exports = sharedPlaylistSchema; 