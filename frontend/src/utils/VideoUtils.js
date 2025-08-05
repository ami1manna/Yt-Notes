import axios from "axios";
import { toast } from "react-toastify";

export const setPlaylistVideoId = async (userId, playlistId, videoId) => {
    try {
        await axios.put(`/playlists/setVideoId`, {
            userId,
            playlistId,
            videoId,
        });
        // Refetch the playlist to get updated selected video
        const response = await axios.post("/playlists/fetchById", {
            userId,
            playlistId
        });
        return response.data.playlist;
    } catch (error) {
        const errorMessage = error.response?.data?.error || "Failed to set playlist index";
        toast.error(errorMessage, { position: "top-right", icon: "❌" });   
        throw error;
    }
};

// Set video status (done/undone) and refetch playlist
export const setVideoStatus = async (videoId, playlistId, userId, sectionId, done) => {
    try {
        await axios.put("/video/toggle", {
            userId,
            videoId,
            playlistId,
            sectionId,
            done
        });
        // Refetch the playlist to get updated status
        const response = await axios.post("/playlists/fetchById", {
            userId,
            playlistId
        });
        return response.data.playlist;
    } catch (error) {
        const errorMessage = error.response?.data?.error || "Failed to update video status";
        toast.error(errorMessage, { position: "top-right", icon: "❌" });
        throw error;
    }
};

