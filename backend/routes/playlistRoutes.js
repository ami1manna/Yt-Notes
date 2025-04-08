// playlistRoutes.js
const express = require('express');
const { addPlaylist, getPlaylistsByUser,deletePlaylist, selectedVideoId, deleteVideo, displaySection } = require('../controllers/playlistControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/add', addPlaylist);
router.post('/getPlaylist', getPlaylistsByUser);
router.delete('/delete', deletePlaylist);
router.put('/setVideoId',selectedVideoId);
router.delete('/deleteVideo' , deleteVideo);
router.post('/displaySection' , displaySection);
module.exports = router;