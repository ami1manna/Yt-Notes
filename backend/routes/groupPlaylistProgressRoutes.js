const express = require('express');
const router = express.Router();
const groupPlaylistProgressController = require('../controllers/group/groupPlaylistProgressController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes with authentication
router.use(protect);

// Initialize or get member's progress for a playlist
router.get(
  '/groups/:groupId/playlists/:playlistId/progress',
  groupPlaylistProgressController.getMemberProgress
);

// Initialize progress for a playlist
router.post(
  '/groups/:groupId/playlists/:playlistId/initialize',
  groupPlaylistProgressController.initializeProgress
);

// Update video progress
router.put(
  '/groups/:groupId/playlists/:playlistId/videos/:videoId/progress',
  groupPlaylistProgressController.updateVideoProgress
);

// Get group-wide playlist statistics (admin only)
router.get(
  '/groups/:groupId/playlists/:playlistId/stats',
  groupPlaylistProgressController.getGroupPlaylistStats
);

// Get all members' progress for a playlist
router.get(
  '/groups/:groupId/playlists/:playlistId/members/progress',
  groupPlaylistProgressController.getMemberProgress
);

// Delete progress for a playlist
router.delete(
  '/groups/:groupId/playlists/:playlistId/delete',
  groupPlaylistProgressController.deleteProgress
);

// Reset progress for a playlist
router.put(
  '/groups/:groupId/playlists/:playlistId/reset',
  groupPlaylistProgressController.resetProgress
);

module.exports = router;
