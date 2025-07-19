const mongoose = require('mongoose');
const memberSchema = require('./MemberSchema');
const sharedPlaylistSchema = require('./SharedPlaylistSchema');

const groupModel = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  privacy: {
    type: String,
    enum: ['public', 'private'],
    default: 'private'
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Links to the user who created the group
    required: true 
  },
  members: [memberSchema],
  sharedPlaylists: [sharedPlaylistSchema]
}, { timestamps: true });

module.exports = mongoose.model('Group', groupModel); 