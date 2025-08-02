// models/CollaborativeNote.js
const mongoose = require('mongoose');

const collaborativeNoteSchema = new mongoose.Schema({
  groupId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Group', 
    required: true 
  },
  playlistId: { 
    type: String, 
    required: true 
  },
  videoId: { 
    type: String, 
    required: true 
  },
  authorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

// Index for fast lookups of notes for a specific video
collaborativeNoteSchema.index({ groupId: 1, playlistId: 1, videoId: 1 });

module.exports = mongoose.model('CollaborativeNote', collaborativeNoteSchema);