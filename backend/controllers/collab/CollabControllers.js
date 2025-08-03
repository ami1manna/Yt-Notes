
const {
  createNoteService,
  getNoteForVideoService,
  updateNoteService,
  deleteNoteService
} = require('@/services/collab/CollabService.js');  

exports.createCollabNote = async (req, res) => {
  try {
    const noteData = { ...req.body, createdBy: req.user.id };
    const newNote = await createNoteService(noteData);
    res.status(201).json(newNote);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

exports.getCollabNoteForVideo = async (req, res) => {
  try {
    const note = await getNoteForVideoService(req.query);
    res.status(200).json(note);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

exports.updateCollabNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const updateData = { ...req.body, lastModifiedBy: req.user.id };
    const updatedNote = await updateNoteService(noteId, updateData);
    
    // Socket.IO logic
    const io = req.app.get('socketio');
    if (io) {
        io.to(`note-${noteId}`).emit('note_updated', updatedNote);
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

exports.deleteCollabNote = async (req, res) => {
  try {
    const result = await deleteNoteService(req.params.noteId);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};