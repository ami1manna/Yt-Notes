const UserPlaylist = require('../models/playlistModel');
exports.addNoteToVideo = async (req, res) => {
    try {
      const { userEmail, playlistId, videoId, timestamp, text } = req.body;
  
      // Find the user's playlist
      const userPlaylist = await UserPlaylist.findOne({ userEmail });
  
      if (!userPlaylist) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Find the playlist
      const playlist = userPlaylist.playlists.find(pl => pl.playlistId === playlistId);
      if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
      }
      
      // Find the video
      const video = playlist.videos.find(v => v.videoId === videoId);
      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }
      
      const timeStampedNote = video.notes.find(note => note.timestamp === timestamp);
      if (timeStampedNote) {
        //  update the note
        timeStampedNote.text = text;
        await userPlaylist.save();
        return res.status(200).json({ message: 'Note updated successfully', video });
      }
      // Add the note
      video.notes.push({ timestamp, text });
  
      // Save the updated user playlist
      await userPlaylist.save();
  
      res.status(201).json({ message: 'Note added successfully', video });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  exports.getNotesForVideo = async (req, res) => {
    try {
      const { userEmail, playlistId, videoId } = req.params;
  
      // Find the user's playlist
      const userPlaylist = await UserPlaylist.findOne({ userEmail });
  
      if (!userPlaylist) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Find the playlist
      const playlist = userPlaylist.playlists.find(pl => pl.playlistId === playlistId);
      if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
      }
  
      // Find the video
      const video = playlist.videos.find(v => v.videoId === videoId);
      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }
  
      res.status(200).json(video.notes);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  

  exports.deleteNoteFromVideo = async (req, res) => {
    try {
      const { userEmail, playlistId, videoId, timestamp } = req.body;
  
      // Find the user's playlist
      const userPlaylist = await UserPlaylist.findOne({ userEmail });
  
      if (!userPlaylist) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Find the playlist
      const playlist = userPlaylist.playlists.find(pl => pl.playlistId === playlistId);
      if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
      }
  
      // Find the video
      const video = playlist.videos.find(v => v.videoId === videoId);
      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }
  
      // Filter out the note with the given timestamp
      video.notes = video.notes.filter(note => note.timestamp !== timestamp);
  
      // Save the updated user playlist
      await userPlaylist.save();
  
      res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  