const express = require('express');
const { addNoteToVideo, getNotesForVideo, deleteNoteFromVideo } = require('../controllers/notesControllers');

const router = express.Router();

router.put('/notes', addNoteToVideo); // Add a note
router.get('/notes/:userEmail/:playlistId/:videoId', getNotesForVideo); // Get all notes for a video
router.delete('/notes', deleteNoteFromVideo); // Delete a note

module.exports = router;
