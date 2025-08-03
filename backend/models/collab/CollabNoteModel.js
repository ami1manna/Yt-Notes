// models/collaborativeNote.model.js
const mongoose = require('mongoose');

const collaborativeNoteModel = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  playlistId: { type: String, required: true },
  videoId: { type: String, required: true },
  title: { type: String, required: true, default: 'Untitled Note' },
  
  // The most important field: always holds the latest version of the note
  content: { type: String, default: '' },

  // Metadata to track creation and the last edit
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

}, { 
  // Automatically adds `createdAt` and `updatedAt` fields
  timestamps: true 
});


// Add this line to enforce one note per video within a group/playlist
collaborativeNoteModel.index(
  { groupId: 1, playlistId: 1, videoId: 1 }, 
  { unique: true }
);

module.exports = mongoose.model('CollaborativeNote', collaborativeNoteModel);
