import axios from 'axios'; 
import { toast } from "react-toastify";

export const extractPlaylistId = (url) => {


  try {
    if (!url || typeof url !== "string") {
      return { error: "Invalid input. URL must be a string." };
    }

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      return { error: "Please enter a playlist URL." };
    }

    // Regex patterns for different YouTube playlist URL formats
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*?list=([a-zA-Z0-9_-]+)/,
      /^([a-zA-Z0-9_-]+)$/ // Direct playlist ID
    ];

    for (let pattern of patterns) {
      const match = trimmedUrl.match(pattern);
      if (match) {
        return match[1]; // Return the extracted playlist ID
      }
    }

    return { error: "Invalid YouTube playlist URL." };
  } catch (error) {

    return { error: "Failed to extract playlist ID." };
  }
};


export const validatePlaylistUrl = (url) => {
  // Basic YouTube playlist URL validation
  const youtubePlaylistRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/.+list=|youtu\.be\/.+list=)/;
  return youtubePlaylistRegex.test(url);
};


// DATABASE UTILS
// Remove useContext(PlaylistContext) from here
export const fetchUserPlaylists = async (email, setPlaylistData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_REACT_APP_BASE_URL}/playlists/getPlaylist`,
      { userEmail: email },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      }
    );

    const userData = response.data;
    const playlists = userData?.playlists ?? {};

    if (Object.keys(playlists).length === 0) {
      console.warn("No playlists found for user:", email);
    }

    // ✅ Store playlists in context by passing setPlaylistData
    setPlaylistData(playlists);

    return playlists;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Error fetching playlists";
    toast.error(errorMessage, { position: "top-right", icon: "⚠️" });

    // ✅ Reset playlist data on failure
    setPlaylistData({});
    return {};
  }
};




export const handleAddPlaylist = async (playlistUrl, user, setLoading, setPlaylistData, inputRef, navigate) => {
  try {
    if (!user) {
      navigate("/login");
      return false;
    }

    const trimmedUrl = extractPlaylistId(playlistUrl);
    if (trimmedUrl.error) {
      toast.error(trimmedUrl.error, { position: "top-right", icon: "❌" });
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
      // setPlaylistData(response.data.playlist);
      await fetchUserPlaylists(user.email, setPlaylistData);

      toast.success(`${response.data.message} 🎉`, { position: "top-right" });
    }

    return true;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Failed to add playlist";
    toast.error(errorMessage, { position: "top-right", icon: "❌" });
    return false;
  } finally {
    setLoading(false);
  }
};

export const handlePlaylistSection = async (url, user, setLoading, setPlaylistData,) => {


  try {

    if (!user || !user.email) {
      toast.error("User is not logged in!", { position: "top-right", icon: "⚠️" });
      return false;
    }

    // Fetch playlist ID
    const playId = extractPlaylistId(url);


    if (playId.error) {
      toast.error(playId.error, { position: "top-right", icon: "❌" });
      return false;
    }

    setLoading(true);


    const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/section/arrange`, {
      userEmail: user.email,
      playlistId: playId,
    });

    const sectionFlag = await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/playlists/displaySection`, {
      userEmail: user.email,
      playlistId: playId,
      displaySection: true
    });


    if (response.data.playlist && sectionFlag.data.message) {
      await fetchUserPlaylists(user.email, setPlaylistData);
      // setPlaylistData(response.data.playlist);
      toast.success(`${response.data.message} 🎉`, { position: "top-right" });
    }

    return true;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Failed to arrange sections";

    toast.error(errorMessage, { position: "top-right", icon: "❌" });
    return false;
  } finally {
    setLoading(false);
  }
};
