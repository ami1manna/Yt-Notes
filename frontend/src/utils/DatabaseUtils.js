import axios from "axios";
// Toggle video status on the backend
export const toggleVideo = async (videoId, playlistId, userEmail) => {
    try {
        const response = await axios.put("http://localhost:5000/video/toggle", {
            userEmail,
            videoId,
            playlistId,
        });

        return response.data; // Return updated video object
    } catch (error) {
        console.error("Error toggling video:", error);
        throw error;
    }
};
 
export const setPlaylistIndex = async (userEmail, playlistId, playlistIndex) => {
     
    try {
        const response = await axios.put("http://localhost:5000/playlists/setVideoIndex", {
            userEmail,
            playlistId,
            playlistIndex,
        });
        return response.data;
    } catch (error) {
        console.error("Error setting playlist index:", error.response?.data || error.message);
        return { success: false, error: error.response?.data || "An error occurred" };
    }
};

