const mongoose = require('mongoose');

const groupInviteModel = new mongoose.Schema({
  groupId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Group', 
    required: true 
  },
  invitedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // The user who sent the invite
    required: true 
  },
  invitedUserId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // The user being invited
    required: true 
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'expired'],
    default: 'pending'
  }
}, { timestamps: true });

groupInviteModel.index({ createdAt: 1 }, { expireAfterSeconds: 604800 }); 

module.exports = mongoose.model('GroupInvitation', groupInviteModel); 