const UserProgress = require('../../models/playlists/userProgressModel');
const User = require('../../models/users/userModel');
const { addNoteToVideoService, getNotesForVideoService, deleteNoteFromVideoService } = require('../../services/notes/notesService');

exports.addNoteToVideo = async (req, res) => {
    try {
        const result = await addNoteToVideoService(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(error.status || 400).json({ error: error.message });
    }
};

exports.getNotesForVideo = async (req, res) => {
    try {
        const result = await getNotesForVideoService(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};

exports.deleteNoteFromVideo = async (req, res) => {
    try {
        const result = await deleteNoteFromVideoService(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};
