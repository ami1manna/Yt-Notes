const express = require('express');
const { protect } = require('@/middleware/authMiddleware');

const {
   
  getCollabNoteForVideo,
 
  deleteCollabNote,
  saveOrUpdateCollabNote, // ✅ NEW FUNCTION
} = require('../controllers/collab/CollabControllers');

const router = express.Router();

// ✅ Apply authentication middleware to all routes
router.use(protect);

// ✅ GET a note for a video
// GET /collab?videoId=xyz&playlistId=123&groupId=abc
router.get('/', getCollabNoteForVideo);

// ✅ NEW: CREATE or UPDATE a note
// POST /collab/saveNote
router.post('/saveNote', saveOrUpdateCollabNote);

// ✅ DELETE a note
// DELETE /collab/:noteId
router.delete('/:noteId', deleteCollabNote);

module.exports = router;
