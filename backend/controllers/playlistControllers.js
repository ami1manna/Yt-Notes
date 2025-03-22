const UserPlaylist = require('../models/playlistModel');
const axios = require('axios');

 
// Helper function to convert ISO 8601 duration (PT5M30S) to seconds
function isoDurationToSeconds(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(match[1] || 0, 10);
  const minutes = parseInt(match[2] || 0, 10);
  const seconds = parseInt(match[3] || 0, 10);
  return hours * 3600 + minutes * 60 + seconds;
}
const playlistsArrayToMap = (playlists) => {
  const playlistsMap = {};
  playlists.forEach(playlist => {
    playlistsMap[playlist.playlistId] = {
      playlistUrl: playlist.playlistUrl,
      channelTitle: playlist.channelTitle,
      playlistLength: playlist.playlistLength,
      playlistThumbnailUrl: playlist.playlistThumbnailUrl,
      totalDuration: playlist.totalDuration,
      videos: playlist.videos,
      selectedVideoIndex: playlist.selectedVideoIndex || 0
    };
  });
  return playlistsMap;
};

// Helper function to convert playlists map to array
const playlistsMapToArray = (playlistsMap) => {
  return Object.keys(playlistsMap).map(id => ({
    playlistId: id,
    ...playlistsMap[id]
  }));
};

exports.addPlaylist = async (req, res) => {
  try {
    const { userEmail, playlistId, playlistUrl } = req.body;
    const API_KEY = process.env.YOUTUBE_API_KEY;
    
    // Function to fetch all playlist items using pagination
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
    
    // Function to fetch video details in batches
    async function getVideoDetails(videoIds) {
      const batchSize = 50; // YouTube API limit
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
    
    // Fetch all playlist videos
    const videosData = await getAllPlaylistItems(playlistId);
    
    if (!videosData.length) {
      return res.status(404).json({ error: 'Playlist is empty or invalid' });
    }
    
    // Extract video IDs
    const videoIds = videosData.map(item => item.snippet.resourceId.videoId);
    
    // Fetch video details including duration
    const videoDetails = await getVideoDetails(videoIds);
    
    let totalDurationSeconds = 0;
    
    // Map videos with duration and calculate total duration
    const videos = videosData.map(item => {
      const videoDetail = videoDetails.find(v => v.id === item.snippet.resourceId.videoId);
      const durationSeconds = videoDetail ? isoDurationToSeconds(videoDetail.contentDetails.duration) : 0;
      
      totalDurationSeconds += durationSeconds;
      
      return {
        videoId: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
        publishedAt: item.snippet.publishedAt,
        duration: durationSeconds,
        notes: "", 
      };
    });
    
    // Common playlist data
    const channelTitle = videosData[0].snippet.channelTitle;
    const playlistLength = videos.length;
    const playlistThumbnailUrl = videosData[0].snippet.thumbnails.high?.url || 
                                videosData[0].snippet.thumbnails.default?.url;
    
    // Check if user has playlists
    let userPlaylist = await UserPlaylist.findOne({ userEmail });
    let playlistsMap = {};
    
    if (!userPlaylist) {
      // Create new playlist map with the new playlist
      playlistsMap[playlistId] = {
        playlistUrl,
        channelTitle,
        playlistLength,
        playlistThumbnailUrl,
        totalDuration: totalDurationSeconds,
        videos,
        selectedVideoIndex: 0
      };
      
      // Convert map to array for storage
      const playlistsArray = playlistsMapToArray(playlistsMap);
      
      // Create new user playlist document
      userPlaylist = new UserPlaylist({
        userEmail,
        playlists: playlistsArray
      });
    } else {
      // Convert existing playlists array to map
      playlistsMap = playlistsArrayToMap(userPlaylist.playlists);
      
      // Check if playlist already exists
      if (playlistsMap[playlistId]) {
        return res.status(400).json({ error: 'Playlist already added' });
      }
      
      // Add new playlist to map
      playlistsMap[playlistId] = {
        playlistUrl,
        channelTitle,
        playlistLength,
        playlistThumbnailUrl,
        totalDuration: totalDurationSeconds,
        videos,
        selectedVideoIndex: 0
      };
      
      // Convert map back to array for storage
      userPlaylist.playlists = playlistsMapToArray(playlistsMap);
    }
    
    await userPlaylist.save();
    
    res.status(201).json({
      message: 'Playlist added successfully',
      playlists: playlistsMap
    });
    
  } catch (error) {
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
    
    // Convert playlists array to map
    const playlistsMap = playlistsArrayToMap(userPlaylistDoc.playlists);
    
    res.json({ playlists: playlistsMap });
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
    
    // Convert playlists array to map
    const playlistsMap = playlistsArrayToMap(userPlaylist.playlists);
    
    // Check if playlist exists
    if (!playlistsMap[playlistId]) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    // Delete playlist from map
    delete playlistsMap[playlistId];
    
    // Convert map back to array for storage
    userPlaylist.playlists = playlistsMapToArray(playlistsMap);
    
    await userPlaylist.save();
    
    res.status(200).json({
      message: 'Playlist deleted successfully',
      playlists: playlistsMap
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.selectedVideoIndex = async (req, res) => {
  try {
    const { userEmail, playlistId, playlistIndex } = req.body;
    
    // Find the user's playlist document
    const userPlaylist = await UserPlaylist.findOne({ userEmail });
    
    if (!userPlaylist) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Convert playlists array to map
    const playlistsMap = playlistsArrayToMap(userPlaylist.playlists);
    
    // Check if playlist exists
    if (!playlistsMap[playlistId]) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    // Update selected video index
    playlistsMap[playlistId].selectedVideoIndex = playlistIndex;
    
    // Convert map back to array for storage
    userPlaylist.playlists = playlistsMapToArray(playlistsMap);
    
    // Save the updated document
    await userPlaylist.save();
    
    res.status(200).json({ 
      message: 'Selected video index updated successfully',
      playlists: playlistsMap
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

