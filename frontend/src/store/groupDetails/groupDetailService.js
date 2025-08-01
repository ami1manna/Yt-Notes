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
