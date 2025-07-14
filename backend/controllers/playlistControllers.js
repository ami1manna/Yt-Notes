const UserProgress = require('../models/playlists/userProgressModel');
const axios = require('axios');
const { handleDelete, parseDuration } = require('../utils/VideoUtils');
const BasePlaylist = require('../models/playlists/base/basePlaylistModel');
 
// Helper function to convert ISO 8601 duration (PT5M30S) to seconds
exports.addPlaylist = async (req, res) => {
  try {
    const { userId, playlistId } = req.body;
    const API_KEY = process.env.YOUTUBE_API_KEY;

    // 1. Check if the base playlist exists
    let basePlaylist = await BasePlaylist.findOne({ playlistId });
    if (!basePlaylist) {
      // Fetch playlist data from YouTube API
      async function getAllPlaylistItems(playlistId) {
        let allItems = [];
        let nextPageToken = '';
        do {
          const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
            params: {
              part: 'snippet',
              maxResults: 50,
              playlistId,
              pageToken: nextPageToken,
              key: API_KEY,
            },
          });
          allItems = [...allItems, ...response.data.items];
          nextPageToken = response.data.nextPageToken;
        } while (nextPageToken);
        return allItems;
      }
      async function getVideoDetails(videoIds) {
        const batchSize = 50;
        const promises = [];
        for (let i = 0; i < videoIds.length; i += batchSize) {
          const batchIds = videoIds.slice(i, i + batchSize).join(',');
          promises.push(
            axios.get('https://www.googleapis.com/youtube/v3/videos', {
              params: { part: 'contentDetails', id: batchIds, key: API_KEY },
            })
          );
        }
        const responses = await Promise.all(promises);
        return responses.flatMap(response => response.data.items);
      }
      const videosData = await getAllPlaylistItems(playlistId);
      if (!videosData.length) {
        return res.status(404).json({ error: 'Playlist is empty or invalid' });
      }
      const videoIds = videosData.map(item => item.snippet.resourceId.videoId);
      const videoDetails = await getVideoDetails(videoIds);
      // Build videos array for base playlist
      const videos = videosData.map(item => {
        const videoId = item.snippet.resourceId.videoId;
        const videoDetail = videoDetails.find(v => v.id === videoId);
        return {
          videoId,
          title: item.snippet.title,
          thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
          duration: videoDetail ? parseDuration(videoDetail.contentDetails.duration) : 0
        };
      });
      const videoOrder = videoIds;
      // For now, sections is empty (can be arranged later)
      basePlaylist = await BasePlaylist.create({
        playlistId,
        playlistTitle: videosData[0].snippet.title,
        playlistUrl: `https://www.youtube.com/playlist?list=${playlistId}`,
        channelTitle: videosData[0].snippet.channelTitle,
        playlistThumbnailUrl: videosData[0].snippet.thumbnails.high?.url || videosData[0].snippet.thumbnails.default?.url,
        totalDuration: videos.reduce((sum, v) => sum + (v.duration || 0), 0),
        videos,
        videoOrder,
        sections: []
      });
    }
    // 2. Create UserProgress for this user/playlist
    let userProgress = await UserProgress.findOne({ userId, playlistId });
    if (userProgress) {
      return res.status(400).json({ error: 'Playlist already added for this user' });
    }
    // Initialize videoStatus and sectionProgress from basePlaylist
    const videoStatus = new Map();
    basePlaylist.videos.forEach(video => {
      videoStatus.set(video.videoId, { done: false, notes: "" });
    });
    const sectionProgress = new Map();
    basePlaylist.sections.forEach(section => {
      sectionProgress.set(section.sectionId, { completedCount: 0, totalCount: section.videoIds.length, percentage: 0 });
    });
    userProgress = new UserProgress({
      userId,
      playlistId,
      playlistProgress: 0,
      selectedVideoId: basePlaylist.videoOrder[0] || "",
      videoStatus,
      sectionProgress
    });
    await userProgress.save();
    res.status(201).json({ message: 'Playlist progress tracking started for user', userProgress });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getPlaylistsByUser = async (req, res) => {
  try {
    const { userId } = req.body;
    // Find all UserProgress documents for this user
    const userProgressDocs = await UserProgress.find({ userId });
    if (!userProgressDocs.length) {
      return res.json({ playlists: [] });
    }
    // For each progress doc, join with base playlist info
    const playlists = await Promise.all(userProgressDocs.map(async (progress) => {
      const basePlaylist = await BasePlaylist.findOne({ playlistId: progress.playlistId });
      return {
        progress,
        basePlaylist
      };
    }));
    res.json({ playlists });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePlaylist = async (req, res) => {
  try {
    const { userId, playlistId } = req.body;
    // Only remove the UserProgress document
    const result = await UserProgress.deleteOne({ userId, playlistId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User progress for this playlist not found' });
    }
    res.status(200).json({
      message: 'Playlist progress deleted successfully for user'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.selectedVideoId = async (req, res) => {
  try {
    const { userId, playlistId, videoId } = req.body;
    // Validate input
    if (!userId || !playlistId || !videoId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Update only the UserProgress document
    const userProgress = await UserProgress.findOne({ userId, playlistId });
    if (!userProgress) {
      return res.status(404).json({ error: 'User progress not found' });
    }
    // Check if the video exists in videoStatus
    if (!userProgress.videoStatus.has(videoId)) {
      return res.status(404).json({ error: 'Video not found in progress' });
    }
    // Update selectedVideoId
    userProgress.selectedVideoId = videoId;
    await userProgress.save();
    res.status(200).json({ message: 'Selected video updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

exports.deleteVideo = async (req, res) => { 
  try {
    const { userId, playlistId, videoId } = req.body;
    // Only update the UserProgress document
    const userProgress = await UserProgress.findOne({ userId, playlistId });
    if (!userProgress) {
      return res.status(404).json({ error: 'User progress not found' });
    }
    // Remove video from videoStatus map
    if (!userProgress.videoStatus.has(videoId)) {
      return res.status(404).json({ error: 'Video not found in progress' });
    }
    userProgress.videoStatus.delete(videoId);
    // Update playlist progress (recalculate percentage)
    const totalVideos = userProgress.videoStatus.size;
    const completedVideos = Array.from(userProgress.videoStatus.values()).filter(v => v.done).length;
    userProgress.playlistProgress = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
    await userProgress.save();
    res.status(200).json({ 
      message: 'Video deleted from progress successfully',
      playlistProgress: userProgress.playlistProgress
    });
  } 
  catch (error) { 
    res.status(500).json({ error: 'Internal server error', details: error.message }); 
  } 
};

exports.displaySection = async (req, res) => { 
  try {
    const { userId, playlistId, displaySection } = req.body;
    // Only update the UserProgress document
    const userProgress = await UserProgress.findOne({ userId, playlistId });
    if (!userProgress) {
      return res.status(404).json({ error: 'User progress not found' });
    }
    // Store the displaySection state
    userProgress.displaySection = displaySection;
    await userProgress.save();
    res.status(200).json({ 
      message: 'Section display state updated successfully',
      displaySection: userProgress.displaySection
    });
  } catch (error) {
    res.status(500).json({ error: "Can't display section ", details: error.message });
  }
};

// Get summarized playlist info for a user (for CourseScreen)
exports.getUserPlaylistSummaries = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    // Find all UserProgress documents for this user
    const userProgressDocs = await UserProgress.find({ userId });
    if (!userProgressDocs.length) {
      return res.json({ playlists: [] });
    }
    // For each progress doc, join with base playlist info and summarize
    const playlists = await Promise.all(userProgressDocs.map(async (progress) => {
      const basePlaylist = await BasePlaylist.findOne({ playlistId: progress.playlistId });
      if (!basePlaylist) return null;
      // Count completed videos
      let completed = 0;
      if (progress.videoStatus && progress.videoStatus instanceof Map) {
        completed = Array.from(progress.videoStatus.values()).filter(v => v.done).length;
      } else if (progress.videoStatus && typeof progress.videoStatus === 'object') {
        completed = Object.values(progress.videoStatus).filter(v => v.done).length;
      }
      const total = basePlaylist.videos.length;
      return {
        playlistId: basePlaylist.playlistId,
        playlistTitle: basePlaylist.playlistTitle,
        playlistProgress: progress.playlistProgress,
        playlistThumbnailUrl: basePlaylist.playlistThumbnailUrl,
        videosCompleted: completed,
        totalVideos: total
      };
    }));
    // Filter out any nulls (in case basePlaylist not found)
    res.json({ playlists: playlists.filter(Boolean) });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Fetch full playlist data for a user and playlistId
exports.fetchPlaylistById = async (req, res) => {
  try {
    const { userId, playlistId } = req.body;
    if (!userId || !playlistId) {
      return res.status(400).json({ error: 'userId and playlistId are required' });
    }
    const userProgress = await UserProgress.findOne({ userId, playlistId });
    const basePlaylist = await BasePlaylist.findOne({ playlistId });
    if (!userProgress || !basePlaylist) {
      return res.status(404).json({ error: 'Playlist not found for this user' });
    }
    // Merge 'done' status into each video
    const videoStatusObj = userProgress.videoStatus instanceof Map
      ? Object.fromEntries(userProgress.videoStatus)
      : userProgress.videoStatus;
    const videosWithDone = basePlaylist.videos.map(video => ({
      ...video.toObject(),
      done: videoStatusObj && videoStatusObj[video.videoId] ? videoStatusObj[video.videoId].done : false
    }));
    // Merge 'done' status into each section's videos if sections exist
    let sections = undefined;
    if (basePlaylist.sections && Array.isArray(basePlaylist.sections)) {
      sections = {};
      for (const section of basePlaylist.sections) {
        sections[section.sectionId] = {
          ...section.toObject(),
          videos: section.videoIds.map(videoId => {
            const video = basePlaylist.videos.find(v => v.videoId === videoId);
            return video ? {
              ...video.toObject(),
              done: videoStatusObj && videoStatusObj[videoId] ? videoStatusObj[videoId].done : false
            } : null;
          }).filter(Boolean)
        };
      }
    }
    // Well-structured response for frontend
    const playlist = {
      playlistId: basePlaylist.playlistId,
      playlistTitle: basePlaylist.playlistTitle,
      playlistUrl: basePlaylist.playlistUrl,
      channelTitle: basePlaylist.channelTitle,
      playlistThumbnailUrl: basePlaylist.playlistThumbnailUrl,
      totalDuration: basePlaylist.totalDuration,
      videoOrder: basePlaylist.videoOrder,
      displaySection: userProgress.displaySection || false,
      selectedVideoId: userProgress.selectedVideoId,
      playlistProgress: userProgress.playlistProgress,
      videos: videosWithDone,
      sections: sections || {},
    };
    res.json({ playlist });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
