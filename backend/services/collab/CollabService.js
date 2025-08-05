const collaborativeNoteModel = require('../../models/collab/CollabNoteModel');

exports.saveOrUpdateNoteService = async ({ groupId, playlistId, videoId, content, userId }) => {
  const existingNote = await collaborativeNoteModel.findOne({ groupId, playlistId, videoId });

  if (existingNote) {
    // Update existing note
    existingNote.content = content;
    existingNote.lastModifiedBy = userId;
    await existingNote.save();
    return existingNote;
  } else {
    // Create new note
    const newNote = new collaborativeNoteModel({
      groupId,
      playlistId,
      videoId,
      content,
      createdBy: userId,
      lastModifiedBy: userId,
    });

    await newNote.save();
    return newNote;
  }
};


// --- Get the single note for a specific video ---
exports.getNoteForVideoService = async (query) => {
  const note = await collaborativeNoteModel.findOne(query)
    .populate('createdBy', 'name email')
    .populate('lastModifiedBy', 'name email');

  if (!note) {
    return null;
  }
  return note;
};
 
// --- Delete a note ---
exports.deleteNoteService = async (noteId) => {
  const deletedNote = await collaborativeNoteModel.findByIdAndDelete(noteId);

  if (!deletedNote) {
    throw { status: 404, message: "Note not found." };
  }
  return { message: "Note deleted successfully." };
};