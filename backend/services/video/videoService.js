// Video service logic

const UserProgress = require('@/models/playlists/userProgressModel');

exports.toggleVideoService = async ({ userId, playlistId, videoId }) => {
  const userProgress = await UserProgress.findOne({ userId, playlistId });
  if (!userProgress) throw { status: 404, message: 'User progress not found' };
  const videoStatus = userProgress.videoStatus.get(videoId);
  if (!videoStatus) throw { status: 404, message: 'Video not found in progress' };
  videoStatus.done = !videoStatus.done;
  userProgress.videoStatus.set(videoId, videoStatus);
  const totalVideos = userProgress.videoStatus.size;
  const completedVideos = Array.from(userProgress.videoStatus.values()).filter(v => v.done).length;
  userProgress.playlistProgress = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
  await userProgress.save();
  return {
    message: 'Video status toggled successfully',
    videoStatus,
    playlistProgress: userProgress.playlistProgress
  };
}; 