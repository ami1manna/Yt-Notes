// Section service logic

const mongoose = require('mongoose');
const BasePlaylist = require('@/models/playlists/base/basePlaylistModel');
const { genAIModel } = require('@/genAi/AiModel');

exports.arrangeVideosService = async ({ userId, playlistId }) => {
  const basePlaylist = await BasePlaylist.findOne({ playlistId });
  if (!basePlaylist) throw { status: 404, message: 'Base playlist not found' };
  const videos = basePlaylist.videoOrder.map(videoId => basePlaylist.videos.find(v => v.videoId === videoId));
  if (!videos || videos.length === 0) throw { status: 400, message: 'Playlist has no videos to arrange' };
  const videoMapping = videos.map((video, index) => ({
    index,
    title: video.title,
    id: basePlaylist.videoOrder[index]
  }));
  const prompt = `Given a YouTube playlist about ${basePlaylist.channelTitle}, organize these videos into 3-5 logical thematic sections based on their content and titles.\n\nINSTRUCTIONS:\n1. Analyze the video titles to identify common themes, topics, or progression patterns\n2. Create  clearly distinct sections that group related videos together\n3. Give each section a brief, descriptive name that accurately reflects its content\n4. Ensure all videos are assigned to exactly one section\n5. Return your response as a valid, parseable JSON object with no additional text\n6. Make Sure That Each Video in Section Are Properly Ordered e.g episode 1, episode 2, episode 3, etc.\nVIDEO LIST:\n${videoMapping.map(v => `[${v.index}] \"${v.title}\"`).join('\\n')}\n\nREQUIRED RESPONSE FORMAT:\n{\n  \"sections\": [\n    {\n      \"name\": \"Section Name\",\n      \"videoIndices\": [0, 1, 2]\n    }\n  ]\n}\n\nReturn ONLY the JSON object with no preamble, explanations, or concluding text. Ensure the JSON is valid and can be parsed directly.`;
  const result = await genAIModel.generateContent(prompt);
  const responseText = await result.response.text();
  let sectionsData;
  try {
    sectionsData = JSON.parse(responseText.trim());
  } catch (error) {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      sectionsData = JSON.parse(jsonMatch[0]);
    } else {
      throw { status: 500, message: 'Invalid AI response', aiResponse: responseText };
    }
  }
  if (!sectionsData?.sections?.length) throw { status: 500, message: 'AI response did not contain valid sections', aiResponse: responseText };
  const newSections = sectionsData.sections.map(section => {
    const sectionVideoIds = section.videoIndices
      .filter(index => index >= 0 && index < basePlaylist.videoOrder.length)
      .map(index => basePlaylist.videoOrder[index]);
    return {
      sectionId: new mongoose.Types.ObjectId().toString(),
      name: section.name,
      videoIds: sectionVideoIds,
      thumbnailUrl: videos[section.videoIndices[0]]?.thumbnailUrl || basePlaylist.playlistThumbnailUrl
    };
  });
  basePlaylist.sections = newSections;
  await basePlaylist.save();
  return { message: 'Sections arranged/updated successfully', sections: basePlaylist.sections };
}; 