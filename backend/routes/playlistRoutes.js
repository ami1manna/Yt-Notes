// playlistRoutes.js
const express = require('express');
const { addPlaylist, getPlaylistsByUser } = require('../controllers/playlistControllers');

const router = express.Router();
router.post('/add', addPlaylist);
router.get('/:userEmail', getPlaylistsByUser);

module.exports = router;