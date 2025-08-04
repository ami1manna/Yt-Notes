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

// POST /api/collab/create
router.post('/create', createCollabNote);

// GET /api/collab (pass query like ?videoId=xyz&playlistId=123&groupId=abc)
router.get('/', getCollabNoteForVideo);

// PATCH /api/collab/:noteId
router.patch('/:noteId', updateCollabNote);

// DELETE /api/collab/:noteId
router.delete('/:noteId', deleteCollabNote);

module.exports = router;
