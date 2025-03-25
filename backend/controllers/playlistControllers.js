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


// Helper function to convert playlists map to array



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
    let videos = {};
    let videoOrder = [];

    videosData.forEach(item => {
      const videoId = item.snippet.resourceId.videoId;
      const videoDetail = videoDetails.find(v => v.id === videoId);
      const durationSeconds = videoDetail ? isoDurationToSeconds(videoDetail.contentDetails.duration) : 0;
      totalDurationSeconds += durationSeconds;
      videos[videoId] = {
        title: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
        publishedAt: item.snippet.publishedAt,
        duration: durationSeconds,
        notes: "",
      };
      videoOrder.push(videoId);
    });

    const channelTitle = videosData[0].snippet.channelTitle;
    const playlistLength = videoOrder.length;
    const playlistThumbnailUrl = videosData[0].snippet.thumbnails.high?.url || videosData[0].snippet.thumbnails.default?.url;

    let userPlaylist = await UserPlaylist.findOne({ userEmail });
    let playlistsMap = {};

    if (!userPlaylist) {
      playlistsMap[playlistId] = {
        playlistUrl,
        channelTitle,
        playlistLength,
        playlistThumbnailUrl,
        totalDuration: totalDurationSeconds,
        videos,
        videoOrder,
        selectedVideoIndex: 0
      };
      userPlaylist = new UserPlaylist({
        userEmail,
        playlists: [playlistsMap[playlistId]]
      });
    } else {
      playlistsMap = userPlaylist.playlists.reduce((acc, pl) => {
        acc[pl.playlistId] = pl;
        return acc;
      }, {});
      if (playlistsMap[playlistId]) {
        return res.status(400).json({ error: 'Playlist already added' });
      }
      playlistsMap[playlistId] = {
        playlistUrl,
        channelTitle,
        playlistLength,
        playlistThumbnailUrl,
        totalDuration: totalDurationSeconds,
        videos,
        videoOrder,
        selectedVideoIndex: 0
      };
      userPlaylist.playlists = Object.values(playlistsMap);
    }

    await userPlaylist.save();
    res.status(201).json({ message: 'Playlist added successfully', playlists: playlistsMap });
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

