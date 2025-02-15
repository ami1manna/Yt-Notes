const UserPlaylist = require('../models/playlistModel');
const axios = require('axios');

exports.addPlaylist = async (req, res) => {
  try {
    const { userEmail, playlistId, playlistUrl } = req.body;

    const API_KEY = process.env.YOUTUBE_API_KEY;
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
      params: {
        part: 'snippet',
        maxResults: 50,
        playlistId,
        key: API_KEY,
      },
    });

    const videos = response.data.items.map(item => ({
      videoId: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnailUrl: item.snippet.thumbnails.high.url,
      publishedAt: item.snippet.publishedAt,
    }));

    // common data for each playlist
    const channelTitle = response.data.items[0].snippet.channelTitle;
    const playlistLength = response.data.pageInfo.totalResults;
    const playlistThumbnailUrl = response.data.items[0].snippet.thumbnails.high.url;

     

    let userPlaylist = await UserPlaylist.findOne({ userEmail });

    if (!userPlaylist) {
      userPlaylist = new UserPlaylist({
        userEmail,
        playlists: [{ playlistId, playlistUrl,channelTitle,playlistLength,playlistThumbnailUrl, videos }]
      });
    } else {
      // Check if the playlist with the same playlistId already exists for the user
      const existingPlaylist = userPlaylist.playlists.find(
        playlist => playlist.playlistId === playlistId
      );

      if (existingPlaylist) {
        return res.status(400).json({ error: 'Playlist already added' });
      }

      // Add the new playlist
      userPlaylist.playlists.push({ playlistId, playlistUrl,channelTitle,playlistLength,playlistThumbnailUrl, videos });
    }

    await userPlaylist.save();
    res.status(201).json({
      message: 'Playlist added successfully' ,
        playlists: { playlistId, playlistUrl,channelTitle,playlistLength,playlistThumbnailUrl, videos }
      }

    );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPlaylistsByUser = async (req, res) => {
  try {
    const { userEmail } = req.params;
    const playlists = await UserPlaylist.find({ userEmail });
    res.json(playlists);
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
    // Find the index of the playlist to delete
    const playlistIndex = userPlaylist.playlists.findIndex(playlist => playlist.playlistId === playlistId);
    if (playlistIndex === -1) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    userPlaylist.playlists.splice(playlistIndex, 1);
    await userPlaylist.save();
    res.status(200).json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



exports.selectedVideoIndex = async (req, res) => {
  try {
      const { userEmail, playlistId, playlistIndex } = req.body;
      const userPlaylist = await UserPlaylist.findOne({ userEmail });
      if (!userPlaylist) {
          return res.status(404).json({ error: 'User not found' });
      }
      const playlist = userPlaylist.playlists.find(pl => pl.playlistId === playlistId);
      if (!playlist) {
          return res.status(404).json({ error: 'Playlist not found' });
      }

      playlist.selectedVideoIndex = playlistIndex;
      await userPlaylist.save();

      res.status(200).json({ message: 'Selected video index updated successfully' });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
}