import axios from 'axios';
export async function respondToInviteAPI(inviteId, action) {
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

export async function fetchMyInvitesAPI() {
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