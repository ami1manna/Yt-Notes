const mongoose = require('mongoose');

const sharedPlaylistStatsSchema = new mongoose.Schema({
  totalMembers: {
    type: Number,
    default: 0
  },
  averageCompletion: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  totalVideos: Number,
  totalDuration: Number,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

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
  },
  stats: sharedPlaylistStatsSchema,
  // Track which members have this playlist
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    lastActive: Date
  }]
}, { _id: false });

module.exports = sharedPlaylistSchema;