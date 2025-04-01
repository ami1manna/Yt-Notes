// playlistRoutes.js
const express = require('express');
const { addPlaylist, getPlaylistsByUser,deletePlaylist, selectedVideoId, deleteVideo, displaySection } = require('../controllers/playlistControllers');

const router = express.Router();
router.post('/add', addPlaylist);
router.post('/getPlaylist', getPlaylistsByUser);
router.delete('/delete', deletePlaylist);
router.put('/setVideoId',selectedVideoId);
router.delete('/deleteVideo' , deleteVideo);
router.post('/displaySection' , displaySection);
module.exports = router;