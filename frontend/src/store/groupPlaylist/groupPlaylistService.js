import axios from 'axios';
export async function fetchGroupPlaylistsAPI(groupId, playlistId) {
    try {
        const res = await axios.get(`/groups/${groupId}/shared-playlist/${playlistId}`);

        if (res.data && res.data.success) {
            return { groupPlaylistDetails: res.data.playlist, error: null };
        } else {
            return { groupPlaylistDetails: [], error: res.data?.message || 'Failed to fetch group playlists.' };
        }
    } catch (err) {
        return { groupPlaylists: [], error: err.response?.data?.message || 'Failed to fetch group playlists.' };
    }
}