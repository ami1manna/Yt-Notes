import axios from 'axios';

export async function fetchGroups() {
  try {
    const res = await axios.get('/groups');
    if (res.data && res.data.success) {
      return { groups: res.data.groups, error: null };
    } else {
      return { groups: [], error: 'Failed to fetch groups.' };
    }
  } catch (err) {
    return { groups: [], error: 'Failed to fetch groups.' };
  }
}

export async function fetchGroupById(groupId) {
  try {
    const res = await axios.get(`/groups/${groupId}`);
    if (res.data && res.data.success) {
      return { group: res.data.group, error: null };
    } else {
      return { group: null, error: 'Group not found.' };
    }
  } catch (err) {
    return { group: null, error: 'Failed to load group.' };
  }
}

export async function createGroup({ name, description, privacy }) {
  try {
    const res = await axios.post('/groups', { name, description, privacy });
    if (res.data && res.data.success) {
      return { success: true, error: null };
    } else {
      return { success: false, error: res.data?.message || 'Failed to create group.' };
    }
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'Failed to create group.' };
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

export async function sharePlaylistWithGroup(groupId, playlistId) {
  try {
    const res = await axios.post(`/groups/${groupId}/share-playlist`, { playlistId });
    if (res.data && res.data.success) {
      return { success: true, group: res.data.group, error: null };
    } else {
      return { success: false, group: null, error: res.data?.message || 'Failed to share playlist.' };
    }
  } catch (err) {
    return { success: false, group: null, error: err.response?.data?.message || 'Failed to share playlist.' };
  }
} 