// playlistRoutes.js
const express = require('express');
const { addPlaylist, getPlaylistsByUser,deletePlaylist, selectedVideoIndex } = require('../controllers/playlistControllers');

const router = express.Router();
router.post('/add', addPlaylist);
router.get('/:userEmail', getPlaylistsByUser);
router.delete('/delete', deletePlaylist);
router.put('/setVideoIndex',selectedVideoIndex);
module.exports = router;