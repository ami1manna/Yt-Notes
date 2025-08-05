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
// Fetch summarized playlists for a user (for CourseScreen and CourseList)
export const fetchUserPlaylistSummaries = async (userId, setPlaylistSummaries) => {
  try {
    const response = await axios.post(
      `/playlists/summaries`,
      { userId },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      }
    );
    const playlists = response.data?.playlists ?? [];
    setPlaylistSummaries(playlists);
    return playlists;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Error fetching playlist summaries";
    toast.error(errorMessage, { position: "top-right", icon: "⚠️" });
    setPlaylistSummaries([]);
    return [];
  }
};

// Update fetchUserPlaylists to use the new summaries endpoint for consistency
export const fetchUserPlaylists = fetchUserPlaylistSummaries;


// Add this function to your utils file (where fetchUserPlaylists and other functions are)

export const deletePlaylist = async (userId, playlistId, setPlaylistSummaries) => {
  try {
    const response = await axios.delete(
      `/playlists/delete`,
      {
        data: { userId, playlistId },
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      }
    );

    if (response.data) {
      // Option 1: Use the returned playlists from the response directly
      if (response.data.playlists) {
        setPlaylistSummaries(response.data.playlists);
      } else {
        // Option 2: Fetch fresh playlists data
        await fetchUserPlaylistSummaries(userId, setPlaylistSummaries);
      }
      
      toast.success("Course deleted successfully", { position: "top-right" });
      return true;
    }
    
    return false;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Error deleting course";
    toast.error(errorMessage, { position: "top-right", icon: "⚠️" });
    return false;
  }
};

export const handleAddPlaylist = async (playlistUrl, user, setLoading, setPlaylistSummaries, inputRef, navigate) => {
  try {
    if (!user) {
      navigate("/login");
      return false;
    }

    const trimmedUrl = extractPlaylistId(playlistUrl);
    if (typeof trimmedUrl === "object" && trimmedUrl.error) {
      toast.error(trimmedUrl.error, { position: "top-right", icon: "❌" });
      inputRef.current?.focus();
      return false;
    }

    
    setLoading(true);

    const playlistId = extractPlaylistId(trimmedUrl);
    if (typeof playlistId === "object" && playlistId.error) {
      toast.error(playlistId.error, { position: "top-right", icon: "❌" });
      inputRef.current?.focus();
      return false;
    }

    // console.log(user.userId);
    // console.log(playlistId);
    const response = await axios.post(`/playlists/add`, {
      userId: user.userId,
      playlistId
    });


    if (response.data.playlist) {
      // setPlaylistData(response.data.playlist);
      await fetchUserPlaylistSummaries(user.userId, setPlaylistSummaries);

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

export const handlePlaylistSection = async (url, user, setLoading, setPlaylistSummaries) => {


  try {

    if (!user || !user.userId) {
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


    const response = await axios.post(`/section/arrange`, {
      userId: user.userId,
      playlistId: playId,
    });

    const sectionFlag = await axios.post(`/playlists/displaySection`, {
      userId: user.userId,
      playlistId: playId,
      displaySection: true
    });


    if (response.data.playlist && sectionFlag.data.message) {
      await fetchUserPlaylistSummaries(user.userId, setPlaylistSummaries);
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
