import axios from 'axios';

// API functions
export const roadmapApi = {
  // Get roadmap data for a specific group
  getRoadmap: async (groupId) => {
    try {
      const response = await axios.get(`/groups/${groupId}/roadmap`);
      return response.data;
    } catch (error) {
      console.error('Error fetching roadmap data:', error);
      throw error;
    }
  },
};

// Export axios instance for potential future use
export default axios;
