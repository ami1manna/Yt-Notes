const mongoose = require('mongoose');

const groupMemberSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['admin', 'moderator', 'member'], default: 'member' },
  joinedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'pending', 'banned'], default: 'active' }
});

module.exports = mongoose.model('GroupMember', groupMemberSchema); 