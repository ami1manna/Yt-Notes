import axios from "axios";
import { toast } from "react-toastify";
// Toggle video status on the backend
export const toggleVideo = async (videoId, playlistId, userEmail) => {
    try {
        //fetch using cache 
            
        const response = await axios.put(`${import.meta.env.VITE_REACT_APP_BASE_URL}/video/toggle`, {
            userEmail,
            videoId,
            playlistId,
        });

        return response.data; // Return updated video object
    } catch (error) {
        const errorMessage = error.response?.data?.error || "Failed to Toggle Video";
        toast.error(errorMessage, { position: "top-right", icon: "❌" });
        throw error;
    }
};
 
export const setPlaylistIndex = async (userEmail, playlistId, playlistIndex) => {
     
    try {
        const response = await axios.put(`${import.meta.env.VITE_REACT_APP_BASE_URL}/playlists/setVideoIndex`, {
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

