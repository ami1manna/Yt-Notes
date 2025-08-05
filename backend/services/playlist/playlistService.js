// Playlist service logic

const UserProgress = require('../../models/playlists/userProgressModel');
const BasePlaylist = require('../../models/playlists/base/basePlaylistModel');
const { fetchPlaylistFromYouTube } = require('../../utils/VideoUtils');

exports.addPlaylistService = async ({ userId, playlistId }) => {
  let basePlaylist = await BasePlaylist.findOne({ playlistId });
  if (!basePlaylist) {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const playlistData = await fetchPlaylistFromYouTube(playlistId, API_KEY);
    basePlaylist = await BasePlaylist.create({ playlistId, ...playlistData, sections: [] });
  }
  let userProgress = await UserProgress.findOne({ userId, playlistId });
  if (userProgress) throw { status: 400, message: 'Playlist already added for this user' };
  const videoStatus = new Map();
  basePlaylist.videos.forEach(video => {
    videoStatus.set(video.videoId, { done: false, notes: "" });
  });
  const sectionProgress = new Map();
  basePlaylist.sections.forEach(section => {
    sectionProgress.set(section.sectionId, { completedCount: 0, totalCount: section.videoIds.length, percentage: 0 });
  });
  userProgress = new UserProgress({
    userId,
    playlistId,
    playlistProgress: 0,
    selectedVideoId: basePlaylist.videoOrder[0] || "",
    videoStatus,
    sectionProgress
  });
  await userProgress.save();
  return { message: 'Playlist progress tracking started for user', userProgress };
};

exports.getPlaylistsByUserService = async ({ userId }) => {
  const userProgressDocs = await UserProgress.find({ userId });
  if (!userProgressDocs.length) return { playlists: [] };
  const playlists = await Promise.all(userProgressDocs.map(async (progress) => {
    const basePlaylist = await BasePlaylist.findOne({ playlistId: progress.playlistId });
    return { progress, basePlaylist };
  }));
  return { playlists };
};

exports.deletePlaylistService = async ({ userId, playlistId }) => {
  const result = await UserProgress.deleteOne({ userId, playlistId });
  if (result.deletedCount === 0) throw { status: 404, message: 'User progress for this playlist not found' };
  return { message: 'Playlist progress deleted successfully for user' };
};

exports.selectedVideoIdService = async ({ userId, playlistId, videoId }) => {
  if (!userId || !playlistId || !videoId) throw { status: 400, message: 'Missing required fields' };
  const userProgress = await UserProgress.findOne({ userId, playlistId });
  if (!userProgress) throw { status: 404, message: 'User progress not found' };
  if (!userProgress.videoStatus.has(videoId)) throw { status: 404, message: 'Video not found in progress' };
  userProgress.selectedVideoId = videoId;
  await userProgress.save();
  return { message: 'Selected video updated successfully' };
};

exports.deleteVideoService = async ({ userId, playlistId, videoId }) => {
  const userProgress = await UserProgress.findOne({ userId, playlistId });
  if (!userProgress) throw { status: 404, message: 'User progress not found' };
  if (!userProgress.videoStatus.has(videoId)) throw { status: 404, message: 'Video not found in progress' };
  userProgress.videoStatus.delete(videoId);
  const totalVideos = userProgress.videoStatus.size;
  const completedVideos = Array.from(userProgress.videoStatus.values()).filter(v => v.done).length;
  userProgress.playlistProgress = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
  await userProgress.save();
  return { message: 'Video deleted from progress successfully', playlistProgress: userProgress.playlistProgress };
};

exports.displaySectionService = async ({ userId, playlistId, displaySection }) => {
  const userProgress = await UserProgress.findOne({ userId, playlistId });
  if (!userProgress) throw { status: 404, message: 'User progress not found' };
  userProgress.displaySection = displaySection;
  await userProgress.save();
  return { message: 'Section display state updated successfully', displaySection: userProgress.displaySection };
};

exports.getUserPlaylistSummariesService = async ({ userId }) => {
  if (!userId) throw { status: 400, message: 'userId is required' };
  const userProgressDocs = await UserProgress.find({ userId });
  if (!userProgressDocs.length) return { playlists: [] };
  const playlists = await Promise.all(userProgressDocs.map(async (progress) => {
    const basePlaylist = await BasePlaylist.findOne({ playlistId: progress.playlistId });
    if (!basePlaylist) return null;
    let completed = 0;
    if (progress.videoStatus && progress.videoStatus instanceof Map) {
      completed = Array.from(progress.videoStatus.values()).filter(v => v.done).length;
    } else if (progress.videoStatus && typeof progress.videoStatus === 'object') {
      completed = Object.values(progress.videoStatus).filter(v => v.done).length;
    }
    const total = basePlaylist.videos.length;
    return {
      playlistId: basePlaylist.playlistId,
      playlistTitle: basePlaylist.playlistTitle,
      playlistProgress: progress.playlistProgress,
      playlistThumbnailUrl: basePlaylist.playlistThumbnailUrl,
      videosCompleted: completed,
      totalVideos: total
    };
  }));
  return { playlists: playlists.filter(Boolean) };
};

exports.fetchPlaylistByIdService = async ({ userId, playlistId }) => {
  if (!userId || !playlistId) throw { status: 400, message: 'userId and playlistId are required' };
  const userProgress = await UserProgress.findOne({ userId, playlistId });
  const basePlaylist = await BasePlaylist.findOne({ playlistId });
  if (!userProgress || !basePlaylist) throw { status: 404, message: 'Playlist not found for this user' };
  const videoStatusObj = userProgress.videoStatus instanceof Map
    ? Object.fromEntries(userProgress.videoStatus)
    : userProgress.videoStatus;
  const videosWithDone = basePlaylist.videos.map(video => ({
    ...video.toObject(),
    done: videoStatusObj && videoStatusObj[video.videoId] ? videoStatusObj[video.videoId].done : false
  }));
  let sections = undefined;
  if (basePlaylist.sections && Array.isArray(basePlaylist.sections)) {
    sections = {};
    for (const section of basePlaylist.sections) {
      sections[section.sectionId] = {
        ...section.toObject(),
        videos: section.videoIds.map(videoId => {
          const video = basePlaylist.videos.find(v => v.videoId === videoId);
          return video ? {
            ...video.toObject(),
            done: videoStatusObj && videoStatusObj[videoId] ? videoStatusObj[videoId].done : false
          } : null;
        }).filter(Boolean)
      };
    }
  }
  const playlist = {
    playlistId: basePlaylist.playlistId,
    playlistTitle: basePlaylist.playlistTitle,
    playlistUrl: basePlaylist.playlistUrl,
    channelTitle: basePlaylist.channelTitle,
    playlistThumbnailUrl: basePlaylist.playlistThumbnailUrl,
    totalDuration: basePlaylist.totalDuration,
    videoOrder: basePlaylist.videoOrder,
    displaySection: userProgress.displaySection || false,
    selectedVideoId: userProgress.selectedVideoId,
    playlistProgress: userProgress.playlistProgress,
    videos: videosWithDone,
    sections: sections || {},
  };
  return { playlist };
}; 