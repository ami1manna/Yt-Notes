import axios from 'axios';

export async function fetchGroupById(groupId) {
  try {
    const res = await axios.get(`/groups/${groupId}`);
    if (res.data && res.data.success) {
      return { group: res.data.group, error: null };
    } else {
      return { group: null, error: res.data?.message || 'Failed to fetch group.' };
    }
  } catch (err) {
    return { group: null, error: err.response?.data?.message || 'Failed to fetch group.' };
  }
}

export async function updateGroup(groupId, { name, description, privacy }) {
  try {
    const res = await axios.put(`/groups/${groupId}`, { name, description, privacy });
    if (res.data && res.data.success) {
      return { success: true, error: null };
    } else {
      return { success: false, error: res.data?.message || 'Failed to update group.' };
    }
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'Failed to update group.' };
  }
}

export async function deleteGroup(groupId) {
  try {
    const res = await axios.delete(`/groups/${groupId}`);
    if (res.data && res.data.success) {
      return { success: true, error: null };
    } else {
      return { success: false, error: res.data?.message || 'Failed to delete group.' };
    }
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'Failed to delete group.' };
  }
}

export async function fetchPlaylistSummary(playlistId) {
  try {
    // Try GET /api/playlist/summary/:playlistId, fallback to /api/playlist/:playlistId if needed
    const res = await axios.get(`/api/playlist/summary/${playlistId}`);
    if (res.data && res.data.playlist) {
      return { playlist: res.data.playlist, error: null };
    } else {
      return { playlist: null, error: 'Playlist not found.' };
    }
  } catch (err) {
    return { playlist: null, error: 'Failed to fetch playlist info.' };
  }
}

export async function sharePlaylistWithGroup(groupId, playlistId, arrangeSections = false) {
  try {
    const res = await axios.post(`/groups/${groupId}/share-playlist`, { 
      playlistId, 
      arrangeSections 
    });
    if (res.data && res.data.success) {
      return { success: true, group: res.data.group, error: null };
    } else {
      return { success: false, group: null, error: res.data?.message || 'Failed to share playlist.' };
    }
  } catch (err) {
    return { success: false, group: null, error: err.response?.data?.message || 'Failed to share playlist.' };
  }
}

export async function fetchSharedPlaylistsForGroup(groupId) {
  try {
    const res = await axios.get(`/groups/${groupId}/shared-playlists`);
    if (res.data && res.data.success) {
      return { sharedPlaylists: res.data.sharedPlaylists, error: null };
    } else {
      return { sharedPlaylists: [], error: res.data?.message || 'Failed to fetch shared playlists.' };
    }
  } catch (err) {
    return { sharedPlaylists: [], error: err.response?.data?.message || 'Failed to fetch shared playlists.' };
  }
}

export async function inviteToGroup(groupId, emails) {
  try {
    const payload = Array.isArray(emails) ? { emails } : { emails: [emails] };

    const res = await axios.post(`/groups/${groupId}/invite`, payload);

    if (res.data && res.data.success) {
      return { success: true, results: res.data.results };
    } else {
      return {
        success: false,
        results: [],
        error: res.data?.message || "Failed to send invites.",
      };
    }
  } catch (err) {
    return {
      success: false,
      results: [],
      error: err.response?.data?.message || "Failed to send invites.",
    };
  }
}


export async function respondToInvite(inviteId, action) {
  try {
    const res = await axios.post(`/groups/invites/${inviteId}/respond`, { action });
    if (res.data && res.data.success) {
      return { success: true, invite: res.data.invite, error: null };
    } else {
      return { success: false, invite: null, error: res.data?.message || 'Failed to respond to invite.' };
    }
  } catch (err) {
    return { success: false, invite: null, error: err.response?.data?.message || 'Failed to respond to invite.' };
  }
}

export async function fetchMyInvites() {
  try {
    const res = await axios.get('/groups/invites/mine');
    if (res.data && res.data.success) {
      return { invites: res.data.invites, error: null };
    } else {
      return { invites: [], error: res.data?.message || 'Failed to fetch invites.' };
    }
  } catch (err) {
    return { invites: [], error: err.response?.data?.message || 'Failed to fetch invites.' };
  }
} 