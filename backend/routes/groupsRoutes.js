const express = require('express');
const {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  inviteToGroup,
  respondToInvite,
  getMyInvites
} = require('../controllers/groups/groupsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new group
router.post('/', protect, createGroup);
// Get all groups
router.get('/', protect, getGroups);
// Get a single group by ID
router.get('/:id', protect, getGroupById);
// Update a group
router.put('/:id', protect, updateGroup);
// Delete a group
router.delete('/:id', protect, deleteGroup);
// Invite a user to a group (by email)
router.post('/:groupId/invite', protect, inviteToGroup);
// Respond to a group invite
router.post('/invites/:inviteId/respond', protect, respondToInvite);
// Get current user's invites
router.get('/invites/mine', protect, getMyInvites);

module.exports = router; 