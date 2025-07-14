const mongoose = require('mongoose');

const groupPlaylistSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  playlistId: { type: String, required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GroupPlaylist', groupPlaylistSchema); 