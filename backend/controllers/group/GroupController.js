
const GroupInviteModel = require('@/models/groups/GroupInviteModel');
const GroupModel = require('@/models/groups/GroupModel');
const User = require('@/models/users/userModel');

const { genAIModel } = require('@/genAi/AiModel');
const axios = require('axios');
const {fetchPlaylistFromYouTube } = require('@/utils/VideoUtils');
const { createGroupService, getGroupsService, getGroupByIdService, updateGroupService, deleteGroupService, inviteToGroupService, respondToInviteService, getMyInvitesService, sharePlaylistWithGroupService } = require('@/services/group/groupService');
 
// Create a new group
exports.createGroup = async (req, res) => {
  try {
    const result = await createGroupService(req.body, req.user);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// Get all groups (optionally filter by user membership)
exports.getGroups = async (req, res) => {
  try {
    const result = await getGroupsService(req.user);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// Get a single group by ID
exports.getGroupById = async (req, res) => {
  try {
    const result = await getGroupByIdService(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// Update a group (admin only)
exports.updateGroup = async (req, res) => {
  try {
    const result = await updateGroupService(req.params.id, req.user, req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// Delete a group (admin only)
exports.deleteGroup = async (req, res) => {
  try {
    const result = await deleteGroupService(req.params.id, req.user);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// Invite a user to a group (admin only)
exports.inviteToGroup = async (req, res) => {
  try {
    const result = await inviteToGroupService(req.params.groupId, req.user, req.body.email);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// Accept or decline a group invite
exports.respondToInvite = async (req, res) => {
  try {
    const result = await respondToInviteService(req.params.inviteId, req.user, req.body.action);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// List invites for the current user
exports.getMyInvites = async (req, res) => {
  try {
    const result = await getMyInvitesService(req.user);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// Share a playlist with a group (any member)
exports.sharePlaylistWithGroup = async (req, res) => {
  try {
    const result = await sharePlaylistWithGroupService(req.params.groupId, req.user, req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// Fetch all shared playlists for a group
exports.getSharedPlaylistsForGroup = async (req, res) => {
  try {
    const group = await require('@/models/groups/GroupModel').findById(req.params.groupId).populate('sharedPlaylists.playlistId');
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }
    res.json({ success: true, sharedPlaylists: group.sharedPlaylists });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 


