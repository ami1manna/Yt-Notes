// Notes service logic

const UserProgress = require('@/models/playlists/userProgressModel');
const User = require('@/models/users/userModel');

exports.addNoteToVideoService = async ({ userId, playlistId, videoId, text }) => {
  const userProgress = await UserProgress.findOne({ userId, playlistId });
  if (!userProgress) throw { status: 404, message: 'User progress not found' };
  const videoStatus = userProgress.videoStatus.get(videoId);
  if (!videoStatus) throw { status: 404, message: 'Video not found in progress' };
  videoStatus.notes = text;
  userProgress.videoStatus.set(videoId, videoStatus);
  await userProgress.save();
  return { message: 'Note added successfully', notes: videoStatus.notes };
};

exports.getNotesForVideoService = async ({ userId, playlistId, videoId }) => {
  const userProgress = await UserProgress.findOne({ userId, playlistId });
  if (!userProgress) throw { status: 404, message: 'User progress not found' };
  const videoStatus = userProgress.videoStatus.get(videoId);
  if (!videoStatus) throw { status: 404, message: 'Video not found in progress' };
  return { notes: videoStatus.notes };
};

exports.deleteNoteFromVideoService = async ({ userId, playlistId, videoId }) => {
  const userProgress = await UserProgress.findOne({ userId, playlistId });
  if (!userProgress) throw { status: 404, message: 'User progress not found' };
  const videoStatus = userProgress.videoStatus.get(videoId);
  if (!videoStatus) throw { status: 404, message: 'Video not found in progress' };
  videoStatus.notes = "";
  userProgress.videoStatus.set(videoId, videoStatus);
  await userProgress.save();
  return { message: 'All notes deleted successfully' };
}; 