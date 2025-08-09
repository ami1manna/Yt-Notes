import axios from 'axios';

export async function fetchGroupByIdAPI(groupId) {
  try {
    const res = await axios.get(`/groups/${groupId}`);
    if (res.data && res.data.success) {
      return { groupDetails: res.data.group, error: null };
    } else {
      return { groupDetails: null, error: 'Group not found.' };
    }
  } catch (err) {
    return { groupDetails: null, error: 'Failed to load group.' };
  }
}


export async function sharePlaylistWithGroupAPI(groupId, playlistId, arrangeSections) {
  try {
    console.log(arrangeSections);
    const res = await axios.post(`/groups/${groupId}/share-playlist`, { 
      playlistId, 
      arrangeSections 
    });
    if (res.data && res.data.success) {
     
      return {  groupDetails: res.data.group, error: null };

    } else {
      return {  sharedPlaylists: null, error: res.data?.message || 'Failed to share playlist.' };
    }
  } catch (err) {
    return { sharedPlaylists: null, error: err.response?.data?.message || 'Failed to share playlist.' };
  }
}