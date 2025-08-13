const mongoose = require('mongoose');

const videoProgressSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true
  },
  currentTime: {
    type: Number,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  lastWatched: {
    type: Date,
    default: Date.now
  },
  completionPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, { _id: false });

const sectionProgressSchema = new mongoose.Schema({
  sectionId: {
    type: String,
    required: true
  },
  completedVideos: [String], // Array of completed videoIds
  completionPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const playlistProgressSchema = new mongoose.Schema({
  playlistId: {
    type: String,
    required: true
  },
  videos: [videoProgressSchema],
  sections: [sectionProgressSchema],
  lastWatchedVideo: String,
  lastWatchedTime: Date,
  totalVideos: Number,
  completedVideos: Number,
  completionPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  totalDuration: Number,
  watchedDuration: {
    type: Number,
    default: 0
  }
}, { _id: false });

const groupMemberProgressSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  playlists: [playlistProgressSchema],
  lastActive: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Compound index for efficient querying
groupMemberProgressSchema.index(
  { groupId: 1, userId: 1 },
  { unique: true }
);

// Index for playlist progress querying
groupMemberProgressSchema.index(
  { 'playlists.playlistId': 1 }
);

module.exports = mongoose.model('GroupMemberProgress', groupMemberProgressSchema);
