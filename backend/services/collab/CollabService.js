const collaborativeNoteModel = require('@/models/collab/CollabNoteModel');

exports.createNoteService = async (noteData) => {
  const { groupId, playlistId, videoId, title, createdBy } = noteData;

  try {
    const newNote = new collaborativeNoteModel({
      groupId,
      playlistId,
      videoId,
      title,
      createdBy,
      lastModifiedBy: createdBy,
    });
    await newNote.save();
    return newNote;
  } catch (error) {
    // Handle the unique index violation
    if (error.code === 11000) {
      throw { status: 409, message: "A note for this video already exists in this group." };
    }
    // Re-throw other errors for the controller to handle
    throw { status: 500, message: error.message || "Error creating note" };
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

// --- Update a note's title or content ---
exports.updateNoteService = async (noteId, updateData) => {
  const { title, content, lastModifiedBy } = updateData;
  const updatedNote = await collaborativeNoteModel.findByIdAndUpdate(
    noteId,
    { title, content, lastModifiedBy },
    { new: true }
  ).populate('lastModifiedBy', 'name email');

  if (!updatedNote) {
    throw { status: 404, message: "Note not found." };
  }
  return updatedNote;
};

// --- Delete a note ---
exports.deleteNoteService = async (noteId) => {
  const deletedNote = await collaborativeNoteModel.findByIdAndDelete(noteId);

  if (!deletedNote) {
    throw { status: 404, message: "Note not found." };
  }
  return { message: "Note deleted successfully." };
};