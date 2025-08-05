const express = require('express');
const { addNoteToVideo, getNotesForVideo, deleteNoteFromVideo } = require('../controllers/notes/NotesController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.put('/saveNotes', addNoteToVideo); // Add a note
router.post('/getNotes', getNotesForVideo); // Get all notes for a video
router.delete('/deleteNotes', deleteNoteFromVideo); // Delete a note

module.exports = router;
