import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

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

export const setPlaylistVideoId = async ( userEmail ,playlistId, videoId) => {
  
    try {
        const response = await axios.put(`${import.meta.env.VITE_REACT_APP_BASE_URL}/playlists/setVideoId`, {
            userEmail,
            playlistId,
            videoId,
        });
        
    } catch (error) {
        const errorMessage = error.response.data.error || "Failed to set playlist index";
        toast.error(errorMessage, { position: "top-right", icon: "❌" });   
        console.log(errorMessage);
       
    }
};

