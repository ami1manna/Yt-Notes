
const GroupInviteModel = require('../../models/groups/GroupInviteModel');
const GroupModel = require('../../models/groups/GroupModel');
const User = require('../../models/users/userModel');


// Create a new group
exports.createGroup = async (req, res) => {
  try {
    const { name, description, privacy } = req.body;
    const createdBy = req.user._id;

    // Check for duplicate group name for this user
    const existingGroup = await GroupModel.findOne({ name, createdBy });
    if (existingGroup) {
      return res.status(400).json({ success: false, message: 'You already have a group with this name.' });
    }

    const group = await GroupModel.create({
      name,
      description,
      privacy,
      createdBy,
      members: [{ userId: createdBy, role: 'admin' }],
      sharedPlaylists: []
    });
    res.status(201).json({ success: true, group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all groups (optionally filter by user membership)
exports.getGroups = async (req, res) => {
  try {
    const userId = req.user._id;
    const groups = await GroupModel.find({
      $or: [
        { privacy: 'public' },
        { 'members.userId': userId }
      ]
    });
    res.json({ success: true, groups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single group by ID
exports.getGroupById = async (req, res) => {
  try {
    const group = await GroupModel.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    res.json({ success: true, group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a group (admin only)
exports.updateGroup = async (req, res) => {
  try {
    const group = await GroupModel.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    // Only admin can update
    const isAdmin = group.members.some(m => m.userId.equals(req.user._id) && m.role === 'admin');
    if (!isAdmin) return res.status(403).json({ success: false, message: 'Only admin can update group' });
    const { name, description, privacy } = req.body;
    if (name) group.name = name;
    if (description) group.description = description;
    if (privacy) group.privacy = privacy;
    await group.save();
    res.json({ success: true, group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a group (admin only)
exports.deleteGroup = async (req, res) => {
  try {
    const group = await GroupModel.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    const isAdmin = group.members.some(m => m.userId.equals(req.user._id) && m.role === 'admin');
    if (!isAdmin) return res.status(403).json({ success: false, message: 'Only admin can delete group' });
    await group.deleteOne();
    res.json({ success: true, message: 'Group deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Invite a user to a group (admin only)
exports.inviteToGroup = async (req, res) => {
  try {
    const { email } = req.body;
    const groupId = req.params.groupId;
    // Prevent inviting yourself
    if (email.toLowerCase() === req.user.email.toLowerCase()) {
      return res.status(400).json({ success: false, message: 'You cannot invite yourself to the group.' });
    }
    const group = await GroupModel.findById(groupId);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    const isAdmin = group.members.some(m => m.userId.equals(req.user._id) && m.role === 'admin');
    if (!isAdmin) return res.status(403).json({ success: false, message: 'Only admin can invite' });
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const invitedUserId = user._id;
    // Prevent duplicate invites
    const existingInvite = await GroupInviteModel.findOne({ groupId, invitedUserId, status: 'pending' });
    if (existingInvite) return res.status(400).json({ success: false, message: 'Invite already sent' });
    const invite = await GroupInviteModel.create({
      groupId,
      invitedBy: req.user._id,
      invitedUserId
    });
    res.status(201).json({ success: true, invite });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Accept or decline a group invite
exports.respondToInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const { action } = req.body; // 'accept' or 'decline'
    const invite = await GroupInviteModel.findById(inviteId);
    if (!invite) return res.status(404).json({ success: false, message: 'Invite not found' });
    if (!invite.invitedUserId.equals(req.user._id)) return res.status(403).json({ success: false, message: 'Not your invite' });
    if (invite.status !== 'pending') return res.status(400).json({ success: false, message: 'Invite already responded' });
    if (action === 'accept') {
      invite.status = 'accepted';
      await invite.save();
      // Add user to group as member
      await GroupModel.findByIdAndUpdate(invite.groupId, {
        $addToSet: { members: { userId: req.user._id, role: 'member' } }
      });
    } else if (action === 'decline') {
      invite.status = 'declined';
      await invite.save();
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action' });
    }
    res.json({ success: true, invite });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// List invites for the current user
exports.getMyInvites = async (req, res) => {
  try {
    const invites = await GroupInviteModel.find({ invitedUserId: req.user._id, status: 'pending' }).populate('groupId');
    res.json({ success: true, invites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 