const UserPlaylist = require('../models/playlistModel');
const axios = require('axios');
const { playlistsMapToArray, playlistsArrayToMap } = require('./utils');

 
// Helper function to convert ISO 8601 duration (PT5M30S) to seconds
function isoDurationToSeconds(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(match[1] || 0, 10);
  const minutes = parseInt(match[2] || 0, 10);
  const seconds = parseInt(match[3] || 0, 10);
  return hours * 3600 + minutes * 60 + seconds;
}


exports.addPlaylist = async (req, res) => {
  try {
    const { userEmail, playlistId, playlistUrl } = req.body;
    const API_KEY = process.env.YOUTUBE_API_KEY;

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
      let allVideoDetails = [];
      for (let i = 0; i < videoIds.length; i += batchSize) {
        const batchIds = videoIds.slice(i, i + batchSize).join(',');
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
          params: {
            part: 'contentDetails',
            id: batchIds,
            key: API_KEY,
          },
        });
        allVideoDetails = [...allVideoDetails, ...response.data.items];
      }
      return allVideoDetails;
    }

    const videosData = await getAllPlaylistItems(playlistId);
    if (!videosData.length) {
      return res.status(404).json({ error: 'Playlist is empty or invalid' });
    }

    const videoIds = videosData.map(item => item.snippet.resourceId.videoId);
    const videoDetails = await getVideoDetails(videoIds);

    let totalDurationSeconds = 0;
    let videos = new Map();
    let videoOrder = [];

    videosData.forEach(item => {
      const videoId = item.snippet.resourceId.videoId;
      const videoDetail = videoDetails.find(v => v.id === videoId);
      const durationSeconds = videoDetail ? isoDurationToSeconds(videoDetail.contentDetails.duration) : 0;
      totalDurationSeconds += durationSeconds;

      const video = {
        title: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
        publishedAt: item.snippet.publishedAt,
        duration: durationSeconds,
        notes: "",
        done: false
      };

      videos.set(videoId, video);
      videoOrder.push(videoId);
    });

    const channelTitle = videosData[0].snippet.channelTitle;
    const playlistLength = videoOrder.length;
    const playlistThumbnailUrl = videosData[0].snippet.thumbnails.high?.url || videosData[0].snippet.thumbnails.default?.url;

    let userPlaylist = await UserPlaylist.findOne({ userEmail });

    if (!userPlaylist) {
      // Create new user playlist
      userPlaylist = new UserPlaylist({
        userEmail,
        playlists: new Map()
      });
    }

    // Check if playlist already exists
    if (userPlaylist.playlists.has(playlistId)) {
      return res.status(400).json({ error: 'Playlist already added' });
    }

    // Create new playlist
    const newPlaylist = {
      playlistId,
      playlistUrl,
      channelTitle,
      playlistLength,
      playlistThumbnailUrl,
      totalDuration: totalDurationSeconds,
      videos,
      videoOrder,
      selectedVideoId: videoOrder[0],
      playlistProgress: 0,
      sections: new Map() // Initialize empty sections
    };

    // Add playlist to user's playlists
    userPlaylist.playlists.set(playlistId, newPlaylist);

    // Save the updated user playlist
    await userPlaylist.save();

    res.status(201).json({ 
      message: 'Playlist added successfully', 
      playlist: newPlaylist 
    });

  } catch (error) {
    console.error('Error adding playlist:', error);
    res.status(400).json({ error: error.message });
  }
};


exports.getPlaylistsByUser = async (req, res) => {
  try {
    const { userEmail } = req.params;
    const userPlaylistDoc = await UserPlaylist.findOne({ userEmail });
    
    if (!userPlaylistDoc) {
      return res.json({ playlists: {} });
    }
    
    // Convert Map to plain object for easy serialization
    const playlistsObject = {};
    for (const [playlistId, playlist] of userPlaylistDoc.playlists) {
      playlistsObject[playlistId] = playlist;
    }
    
    res.json({ playlists: playlistsObject });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePlaylist = async (req, res) => {
  try {
    const { userEmail, playlistId } = req.body;
    
    // Find the user's playlist
    const userPlaylist = await UserPlaylist.findOne({ userEmail });
    
    if (!userPlaylist) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if playlist exists
    if (!userPlaylist.playlists.has(playlistId)) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    // Delete playlist from Map
    userPlaylist.playlists.delete(playlistId);
    
    // Save the updated document
    await userPlaylist.save();
    
    // Convert Map to plain object for response
    const playlistsObject = {};
    for (const [id, playlist] of userPlaylist.playlists) {
      playlistsObject[id] = playlist;
    }
    
    res.status(200).json({
      message: 'Playlist deleted successfully',
      playlists: playlistsObject
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.selectedVideoId = async (req, res) => {
  console.log('Received body:', req.body);

  try {
    const { userEmail, playlistId, videoId } = req.body;
    
    // Validate input
    if (!userEmail || !playlistId || !videoId) {
      console.error('Missing required fields', { userEmail, playlistId, videoId });
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: { 
          userEmail: !!userEmail, 
          playlistId: !!playlistId, 
          videoId: !!videoId 
        }
      });
    }

    // Find the user's playlist document
    const userPlaylist = await UserPlaylist.findOne({ userEmail });

    if (!userPlaylist) {
      console.error('User not found', { userEmail });
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if playlist exists
    const playlist = userPlaylist.playlists.get(playlistId);
    if (!playlist) {
      console.error('Playlist not found', { playlistId });
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Update selected video
    playlist.selectedVideoId = videoId;

    // Save the updated document
    await userPlaylist.save();

    // Convert Map to plain object for response
    const playlistsObject = {};
    for (const [id, pl] of userPlaylist.playlists) {
      playlistsObject[id] = pl;
    }

    res.status(200).json({
      message: 'Selected video updated successfully',
      playlists: playlistsObject
    });

  } catch (error) {
    console.error('Error updating selected video:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
};

