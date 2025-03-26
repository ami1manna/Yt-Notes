// for DATABASE OPERATION
import axios from "axios";
import { toast } from "react-toastify";
 

export const extractPlaylistId =(url)=> {
    try {
      // Remove any whitespace
      url = url.trim();
  
      // Regex patterns for different YouTube playlist URL formats
      const patterns = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*?list=([a-zA-Z0-9_-]+)/,
        /^([a-zA-Z0-9_-]+)$/ // Direct playlist ID
      ];
  
      for (let pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
          return match[1];
        }
      }
  
      return null;
    } catch (error) {
      console.error('Error extracting playlist ID:', error);
      return null;
    }
  }

  export const validatePlaylistUrl = (url) => {
    // Basic YouTube playlist URL validation
    const youtubePlaylistRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/.+list=|youtu\.be\/.+list=)/;
    return youtubePlaylistRegex.test(url);
};

// DATABASE UTILS

export const handleAddPlaylist = async (playlistUrl, user, setLoading, setPlaylistData, inputRef, navigate) => {
  try {
    if (!user) {
      navigate("/login");
      return false;
    }

    const trimmedUrl = playlistUrl.trim();
    
    if (!trimmedUrl) {
      toast.error("Please enter a playlist URL", { position: "top-right", icon: "🎵" });
      inputRef.current?.focus();
      return false;
    }

    if (!validatePlaylistUrl(trimmedUrl)) {
      toast.error("Invalid YouTube playlist URL", { position: "top-right", icon: "⚠️" });
      inputRef.current?.focus();
      return false;
    }

    setLoading(true);

    const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/playlists/add`, {
      userEmail: user.email,
      playlistId: extractPlaylistId(trimmedUrl),
      playlistUrl: trimmedUrl
    });
   

    if (response.data.playlist) {
      setPlaylistData(response.data.playlist);
      toast.success(`${response.data.message} 🎉`, { position: "top-right" });
    }

    return true;
  } catch (error) {
    const errorMessage = error.response?.data?.error|| "Failed to add playlist";
    toast.error(errorMessage, { position: "top-right", icon: "❌" });
    return false;
  } finally {
    setLoading(false);
  }
};

export const handleSection = async ()=>{

}