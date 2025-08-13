const GroupMemberProgress = require('../../models/groups/GroupMemberProgress');
const BasePlaylist = require('../../models/playlists/base/basePlaylistModel');

class GroupPlaylistProgressService {
  // Initialize or get member's progress for a playlist
  async initializeMemberProgress(groupId, userId, playlistId) {
    const basePlaylist = await BasePlaylist.findOne({ playlistId });
    if (!basePlaylist) {
      throw new Error('Playlist not found');
    }

    // Initialize sections progress
    const sections = basePlaylist.sections.map(section => ({
      sectionId: section.sectionId,
      completedVideos: [],
      completionPercentage: 0,
      isCompleted: false
    }));

    // Initialize playlist progress
    const playlistProgress = {
      playlistId,
      videos: [],
      sections,
      totalVideos: basePlaylist.videos.length,
      completedVideos: 0,
      completionPercentage: 0,
      totalDuration: basePlaylist.totalDuration || 0,
      watchedDuration: 0
    };

    // Find or create member progress
    let memberProgress = await GroupMemberProgress.findOneAndUpdate(
      { groupId, userId },
      {
        $setOnInsert: {
          groupId,
          userId,
          playlists: [playlistProgress]
        }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // If playlist progress doesn't exist, add it
    const playlistExists = memberProgress.playlists.some(
      p => p.playlistId === playlistId
    );

    if (!playlistExists) {
      memberProgress = await GroupMemberProgress.findOneAndUpdate(
        { groupId, userId },
        {
          $push: { playlists: playlistProgress },
          $set: { lastActive: new Date() }
        },
        { new: true }
      );
    }

    return memberProgress;
  }

  // Update video progress for a member
  async updateVideoProgress(groupId, userId, playlistId, videoId, currentTime, duration, isCompleted) {
    const memberProgress = await GroupMemberProgress.findOne({ groupId, userId });
    if (!memberProgress) {
      throw new Error('Member progress not found');
    }

    const playlistProgress = memberProgress.playlists.find(p => p.playlistId === playlistId);
    if (!playlistProgress) {
      throw new Error('Playlist not found in member progress');
    }

    // Calculate completion percentage
    const completionPercentage = Math.min(Math.round((currentTime / duration) * 100), 100);
    
    // Update or add video progress
    const videoIndex = playlistProgress.videos.findIndex(v => v.videoId === videoId);
    const videoProgress = {
      videoId,
      currentTime,
      isCompleted: isCompleted || completionPercentage >= 95, // Consider 95% as completed
      lastWatched: new Date(),
      completionPercentage
    };

    if (videoIndex === -1) {
      playlistProgress.videos.push(videoProgress);
    } else {
      playlistProgress.videos[videoIndex] = videoProgress;
    }

    // Update section progress if video is in a section
    this.updateSectionProgress(playlistProgress, videoId, videoProgress.isCompleted);

    // Update playlist-level stats
    this.updatePlaylistStats(playlistProgress);

    // Save changes
    await memberProgress.save();
    return playlistProgress;
  }

  // Update section progress when a video is completed
  updateSectionProgress(playlistProgress, videoId, isCompleted) {
    if (!isCompleted) return;

    for (const section of playlistProgress.sections) {
      if (!section.completedVideos.includes(videoId)) {
        section.completedVideos.push(videoId);
        
        // Update section completion status
        const sectionVideos = this.getSectionVideos(playlistProgress, section.sectionId);
        section.completionPercentage = Math.round(
          (section.completedVideos.length / sectionVideos.length) * 100
        );
        section.isCompleted = section.completionPercentage === 100;
      }
    }
  }

  // Helper to get all videos in a section
  getSectionVideos(playlistProgress, sectionId) {
    // This should be implemented based on how sections are stored in your BasePlaylist
    // For now, returning an empty array as a placeholder
    return [];
  }

  // Update overall playlist statistics
  updatePlaylistStats(playlistProgress) {
    // Calculate completed videos
    const completedVideos = playlistProgress.videos.filter(v => v.isCompleted);
    playlistProgress.completedVideos = completedVideos.length;
    
    // Calculate completion percentage
    if (playlistProgress.totalVideos > 0) {
      playlistProgress.completionPercentage = Math.round(
        (playlistProgress.completedVideos / playlistProgress.totalVideos) * 100
      );
    }

    // Calculate watched duration
    playlistProgress.watchedDuration = playlistProgress.videos.reduce(
      (total, video) => total + (video.isCompleted ? video.duration : video.currentTime),
      0
    );

    // Update last watched video
    const lastWatched = [...playlistProgress.videos]
      .sort((a, b) => new Date(b.lastWatched) - new Date(a.lastWatched))[0];
    
    if (lastWatched) {
      playlistProgress.lastWatchedVideo = lastWatched.videoId;
      playlistProgress.lastWatchedTime = lastWatched.lastWatched;
    }
  }

  // Get member's progress for a playlist
  async getMemberProgress(groupId, userId, playlistId) {
    const memberProgress = await GroupMemberProgress.findOne(
      { groupId, userId },
      { playlists: { $elemMatch: { playlistId } } }
    );

    return memberProgress?.playlists?.[0] || null;
  }

  // Get group-wide playlist statistics
  async getGroupPlaylistStats(groupId, playlistId) {
    const membersProgress = await GroupMemberProgress.find(
      { groupId, 'playlists.playlistId': playlistId },
      { 'playlists.$': 1, userId: 1 }
    );

    if (!membersProgress.length) {
      return null;
    }

    const stats = {
      totalMembers: membersProgress.length,
      averageCompletion: 0,
      members: []
    };

    let totalCompletion = 0;
    
    for (const member of membersProgress) {
      const playlist = member.playlists[0];
      totalCompletion += playlist.completionPercentage || 0;
      
      stats.members.push({
        userId: member.userId,
        completionPercentage: playlist.completionPercentage,
        lastActive: member.lastActive,
        lastWatchedVideo: playlist.lastWatchedVideo,
        lastWatchedTime: playlist.lastWatchedTime
      });
    }

    stats.averageCompletion = Math.round(totalCompletion / stats.totalMembers);
    
    return stats;
  }
}

module.exports = new GroupPlaylistProgressService();
