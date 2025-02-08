import axios from "axios";
// Toggle video status on the backend
export const toggleVideo = async (videoId, playlistId, userEmail) => {
    try {
        const response = await axios.put("http://localhost:5000/video/toggle", {
            userEmail,
            videoId,
            playlistId,
        });

        return response.data.video; // Return updated video object
    } catch (error) {
        console.error("Error toggling video:", error);
        throw error;
    }
};