const groupPlaylistProgressService = require('../../services/group/groupPlaylistProgressService');
const GroupMemberProgress = require('../../models/groups/GroupMemberProgress');
const Group = require('../../models/groups/GroupModel');

class GroupPlaylistProgressController {
  // Initialize or get member's progress for a playlist
  async initializeProgress(req, res) {
    try {
      const { groupId, playlistId } = req.params;
      const userId = req.user._id;

      const progress = await groupPlaylistProgressService.initializeMemberProgress(
        groupId,
        userId,
        playlistId
      );

      res.json({
        success: true,
        data: progress
      });
    } catch (error) {
      console.error('Error initializing progress:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error initializing progress'
      });
    }
  }

  // Update video progress
  async updateVideoProgress(req, res) {
    try {
      const { groupId, playlistId, videoId } = req.params;
      const { currentTime, duration, isCompleted } = req.body;
      const userId = req.user._id;

      const progress = await groupPlaylistProgressService.updateVideoProgress(
        groupId,
        userId,
        playlistId,
        videoId,
        currentTime,
        duration,
        isCompleted
      );

      res.json({
        success: true,
        data: progress
      });
    } catch (error) {
      console.error('Error updating video progress:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error updating video progress'
      });
    }
  }

  // Get member's progress for a playlist
  async getMemberProgress(req, res) {
    try {
      const { groupId, playlistId } = req.params;
      const userId = req.user._id;

      const progress = await groupPlaylistProgressService.getMemberProgress(
        groupId,
        userId,
        playlistId
      );

      if (!progress) {
        // Initialize progress if not exists
        const newProgress = await groupPlaylistProgressService.initializeMemberProgress(
          groupId,
          userId,
          playlistId
        );
        return res.json({
          success: true,
          data: newProgress.playlists.find(p => p.playlistId === playlistId) || {}
        });
      }

      res.json({
        success: true,
        data: progress
      });
    } catch (error) {
      console.error('Error getting member progress:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error getting member progress'
      });
    }
  }

  // Get group-wide playlist statistics
  async getGroupPlaylistStats(req, res) {
    try {
      const { groupId, playlistId } = req.params;
      const userId = req.user._id;
      
      // Verify the user is an admin of this group
      const group = await Group.findOne({
        _id: groupId,
        'members.userId': userId,
        'members.role': 'admin'
      });

      if (!group) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: Only group admins can view group stats'
        });
      }

      const stats = await groupPlaylistProgressService.getGroupPlaylistStats(
        groupId,
        playlistId
      );

      if (!stats) {
        return res.status(404).json({
          success: false,
          message: 'No progress data found for this playlist'
        });
      }

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting group playlist stats:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error getting group playlist stats'
      });
    }
  }

  // Delete progress for a playlist
  async deleteProgress(req, res) {
    try {
      const { groupId, playlistId } = req.params;
      const userId = req.user._id;

      // Remove the playlist from member's progress
      await GroupMemberProgress.updateOne(
        { groupId, userId },
        { $pull: { playlists: { playlistId } } }
      );

      res.json({
        success: true,
        message: 'Playlist progress deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting playlist progress:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error deleting playlist progress'
      });
    }
  }

  // Reset progress for a playlist
  async resetProgress(req, res) {
    try {
      const { groupId, playlistId } = req.params;
      const userId = req.user._id;
      
      // Reset videos and sections progress
      await GroupMemberProgress.updateOne(
        { groupId, userId, 'playlists.playlistId': playlistId },
        {
          $set: {
            'playlists.$.videos': [],
            'playlists.$.sections.$[].completedVideos': [],
            'playlists.$.sections.$[].completionPercentage': 0,
            'playlists.$.sections.$[].isCompleted': false,
            'playlists.$.completedVideos': 0,
            'playlists.$.completionPercentage': 0,
            'playlists.$.watchedDuration': 0,
            'playlists.$.lastWatchedVideo': null,
            'playlists.$.lastWatchedTime': null
          }
        }
      );

      res.json({
        success: true,
        message: 'Playlist progress reset successfully'
      });
    } catch (error) {
      console.error('Error resetting playlist progress:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error resetting playlist progress'
      });
    }
  }
}

module.exports = new GroupPlaylistProgressController();
