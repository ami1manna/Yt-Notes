
const {
   
  getNoteForVideoService,
  saveOrUpdateNoteService,
  deleteNoteService
} = require('../../services/collab/CollabService.js');  

exports.saveOrUpdateCollabNote = async (req, res) => {
  try {
    const { groupId, playlistId, videoId, content } = req.body;
    const userId = req.user.id;

    const savedNote = await saveOrUpdateNoteService({
      groupId,
      playlistId,
      videoId,
      content,
      userId,
    });

    res.status(200).json(savedNote);
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



exports.deleteCollabNote = async (req, res) => {
  try {
    const result = await deleteNoteService(req.params.noteId);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};