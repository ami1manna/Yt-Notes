// Group service logic

const GroupInviteModel = require('@/models/groups/GroupInviteModel');
const GroupModel = require('@/models/groups/GroupModel');
const User = require('@/models/users/userModel');
const { fetchPlaylistFromYouTube } = require('@/utils/VideoUtils');
const BasePlaylist = require('@/models/playlists/base/basePlaylistModel');
 
const { genAIModel } = require('@/genAi/AiModel');

exports.createGroupService = async ({ name, description, privacy }, user) => {
  const createdBy = user._id;
  const existingGroup = await GroupModel.findOne({ name, createdBy });
  if (existingGroup) throw { status: 400, message: 'You already have a group with this name.' };
  const group = await GroupModel.create({
    name,
    description,
    privacy,
    createdBy,
    members: [{ userId: createdBy, role: 'admin' }],
    sharedPlaylists: []
  });
  return { success: true, group };
};


exports.getGroupsService = async (user) => {
  try {
    const userId = user._id;

    const groups = await GroupModel.find({
      $or: [
        { privacy: "public" },
        { "members.userId": userId },
      ],
    })
      .sort({ createdAt: -1 })
      .lean(); // lean so we can safely spread and add fields

    const enhanced = groups.map((group) => {
      const role =
        group.createdBy &&
        group.createdBy.toString() === userId.toString()
          ? "admin"
          : "member";
      return {
        ...group,
        role,
      };
    });

    return { success: true, groups: enhanced };
  } catch (err) {
    console.error("getGroupsService error:", err);
    return { success: false, error: err.message || "Failed to fetch groups" };
  }
};


 
exports.getGroupByIdService = async (id) => {
  const group = await GroupModel.findById(id)
    .populate('createdBy', 'username email')
    .populate('members.userId', 'username email');

  if (!group) throw { status: 404, message: 'Group not found' };

  const playlistIds = group.sharedPlaylists.map(sp => sp.playlistId);

  // Fetch corresponding playlist metadata
  const basePlaylists = await BasePlaylist.find({ playlistId: { $in: playlistIds } });

  // Enrich sharedPlaylists with metadata
  const enrichedPlaylists = group.sharedPlaylists.map(share => {
    const base = basePlaylists.find(p => p.playlistId === share.playlistId);
    return {
      ...share.toObject(),
      ...(base ? {
        playlistTitle: base.playlistTitle,
        playlistThumbnailUrl: base.playlistThumbnailUrl,
        channelTitle: base.channelTitle,
        totalVideos: base.videos.length,
      } : {})
    };
  });

  // Enrich members with user information
  const enrichedMembers = group.members.map(member => {
    const memberUser = member.userId;
    return {
      ...member.toObject(),
      userId: memberUser._id,
      username: memberUser.username,
      email: memberUser.email
    };
  });

  const groupObject = group.toObject();
  groupObject.sharedPlaylists = enrichedPlaylists;
  groupObject.members = enrichedMembers;

  return { success: true, group: groupObject };
};


exports.updateGroupService = async (id, user, { name, description, privacy }) => {
  const group = await GroupModel.findById(id);
  if (!group) throw { status: 404, message: 'Group not found' };
  const isAdmin = group.members.some(m => m.userId.equals(user._id) && m.role === 'admin');
  if (!isAdmin) throw { status: 403, message: 'Only admin can update group' };
  if (name) group.name = name;
  if (description) group.description = description;
  if (privacy) group.privacy = privacy;
  await group.save();
  return { success: true, group };
};

exports.deleteGroupService = async (id, user) => {
  const group = await GroupModel.findById(id);
  if (!group) throw { status: 404, message: 'Group not found' };
  const isAdmin = group.members.some(m => m.userId.equals(user._id) && m.role === 'admin');
  if (!isAdmin) throw { status: 403, message: 'Only admin can delete group' };
  await group.deleteOne();
  return { success: true, message: 'Group deleted' };
};

exports.inviteToGroupService = async (groupId, user, email) => {
  if (email.toLowerCase() === user.email.toLowerCase()) throw { status: 400, message: 'You cannot invite yourself to the group.' };
  const group = await GroupModel.findById(groupId);
  if (!group) throw { status: 404, message: 'Group not found' };
  const isAdmin = group.members.some(m => m.userId.equals(user._id) && m.role === 'admin');
  if (!isAdmin) throw { status: 403, message: 'Only admin can invite' };
  const invitedUser = await User.findOne({ email: email.toLowerCase() });
  if (!invitedUser) throw { status: 404, message: 'User not found' };
  const invitedUserId = invitedUser._id;
  const existingInvite = await GroupInviteModel.findOne({ groupId, invitedUserId, status: 'pending' });
  if (existingInvite) throw { status: 400, message: 'Invite already sent' };
  const invite = await GroupInviteModel.create({ groupId, invitedBy: user._id, invitedUserId });
  return { success: true, invite };
};

exports.respondToInviteService = async (inviteId, user, action) => {
  const invite = await GroupInviteModel.findById(inviteId);
  if (!invite) throw { status: 404, message: 'Invite not found' };
  if (!invite.invitedUserId.equals(user._id)) throw { status: 403, message: 'Not your invite' };
  if (invite.status !== 'pending') throw { status: 400, message: 'Invite already responded' };
  if (action === 'accept') {
    invite.status = 'accepted';
    await invite.save();
    await GroupModel.findByIdAndUpdate(invite.groupId, {
      $addToSet: { members: { userId: user._id, role: 'member' } }
    });
  } else if (action === 'decline') {
    invite.status = 'declined';
    await invite.save();
  } else {
    throw { status: 400, message: 'Invalid action' };
  }
  return { success: true, invite };
};

// exports.getMyInvitesService = async (user) => {
//   const invites = await GroupInviteModel.find({ invitedUserId: user._id, status: 'pending' }).populate('groupId');
//   return { success: true, invites };
// };

exports.getMyInvitesService = async (user) => {
  const invites = await GroupInviteModel.find({
    invitedUserId: user._id,
    status: 'pending',
  })
    .populate({
      path: 'groupId',
      select: 'name description',
    })
    .select('_id groupId');

  // Format the response to return only required fields
  const formattedInvites = invites.map((invite) => ({
    _id: invite._id,
    group: {
      name: invite.groupId?.name,
      description: invite.groupId?.description,
    },
  }));

  return { success: true, invites: formattedInvites };
};


exports.sharePlaylistWithGroupService = async (groupId, user, { playlistId, arrangeSections }) => {
  if (!playlistId) throw { status: 400, message: 'playlistId is required' };
  
  // Validate groupId format
  if (!groupId || typeof groupId !== 'string') {
    throw { status: 400, message: 'Invalid groupId format' };
  }
  
  // Check if groupId is a valid ObjectId format
  const mongoose = require('mongoose');
  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    throw { status: 400, message: 'Invalid groupId format. Expected a valid ObjectId.' };
  }
  
  const group = await GroupModel.findById(groupId);
  if (!group) throw { status: 404, message: 'Group not found' };
  const isMember = group.members.some(m => m.userId.equals(user._id));
  if (!isMember) throw { status: 403, message: 'Only group members can share playlists' };
  if (group.sharedPlaylists.some(sp => sp.playlistId === playlistId)) throw { status: 400, message: 'Playlist already shared with this group' };
  let basePlaylist = await BasePlaylist.findOne({ playlistId });
  if (!basePlaylist) {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const playlistData = await fetchPlaylistFromYouTube(playlistId, API_KEY);
    basePlaylist = await BasePlaylist.create({ playlistId, ...playlistData, sections: [] });
  }
  if (arrangeSections) {
    const videos = basePlaylist.videoOrder.map(videoId => basePlaylist.videos.find(v => v.videoId === videoId));
    const videoMapping = videos.map((video, index) => ({ index, title: video.title, id: basePlaylist.videoOrder[index] }));
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
  }
  group.sharedPlaylists.push({ playlistId, sharedBy: user._id });
  await group.save();
  return { success: true, group };
}; 

exports.getSharedPlaylistDetailsService = async (groupId, playlistId) => {
  const group = await GroupModel.findById(groupId).lean();
  if (!group) {
    return { success: false, message: 'Group not found' };
  }

  const isShared = group.sharedPlaylists.some(p => p.playlistId === playlistId);
  if (!isShared) {
    return { success: false, message: 'This playlist is not shared in this group' };
  }

  const playlist = await BasePlaylist.findOne({ playlistId }).lean();
  if (!playlist) {
    return { success: false, message: 'Playlist not found' };
  }

  return { success: true, playlist };
};