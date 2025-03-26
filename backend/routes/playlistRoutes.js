// playlistRoutes.js
const express = require('express');
const { addPlaylist, getPlaylistsByUser,deletePlaylist, selectedVideoId, deleteVideo } = require('../controllers/playlistControllers');

const router = express.Router();
router.post('/add', addPlaylist);
router.get('/:userEmail', getPlaylistsByUser);
router.delete('/delete', deletePlaylist);
router.put('/selectedVideoId',selectedVideoId);
router.delete('/deleteVideo' , deleteVideo);
module.exports = router;