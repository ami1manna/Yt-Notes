const express = require('express');
const { protect } = require('@/middleware/authMiddleware');

const {
  createCollabNote,
  getCollabNoteForVideo,
  updateCollabNote,
  deleteCollabNote
} = require('../controllers/collab/CollabControllers');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// POST /api/notes/create
router.post('/create', createCollabNote);

// GET /api/notes (pass query like ?videoId=xyz&groupId=abc)
router.get('/', getCollabNoteForVideo);

// PATCH /api/notes/:noteId
router.patch('/:noteId', updateCollabNote);

// DELETE /api/notes/:noteId
router.delete('/:noteId', deleteCollabNote);

module.exports = router;
