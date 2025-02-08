import { createContext, useState, useCallback, useEffect } from "react";
import { toggleVideo } from "../utils/DatabaseUtils";

export const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
    const [userPlaylists, setUserPlaylists] = useState(() => {
        // Load data from localStorage when initializing
        const storedPlaylists = localStorage.getItem("userPlaylists");
         
        return storedPlaylists ? JSON.parse(storedPlaylists) : [];
    });

    // Save playlists to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("userPlaylists", JSON.stringify(userPlaylists));
    }, [userPlaylists]);

    // Add playlist
    const setPlaylistData = useCallback((data) => {
        setUserPlaylists((prevPlaylists) => {
            if (Array.isArray(data)) {
                const newPlaylists = data.filter(
                    (playlist) => !prevPlaylists.some((p) => p.playlistId === playlist.playlistId)
                );
                return [...prevPlaylists, ...newPlaylists];
            }
            const isDuplicate = prevPlaylists.some(
                (playlist) => playlist.playlistId === data.playlistId
            );
            if (!isDuplicate) {
                return [...prevPlaylists, data];
            }
            return prevPlaylists;
        });
    }, []);


    
    
     const setVideoStatus = useCallback(async (videoId, playlistId, userEmail) => {
        try {
            console.log(videoId, playlistId, userEmail);
            // Call the API first to toggle the video status in the backend
            const updatedVideo = await toggleVideo(videoId, playlistId, userEmail);
            console.log(updatedVideo);
            // Update the local state with the updated video data
            setUserPlaylists((prevPlaylists) =>
                prevPlaylists.map((playlist) =>
                    playlist.playlistId === playlistId
                        ? {
                              ...playlist,
                              videos: playlist.videos.map((video) =>
                                  video.videoId === videoId ? updatedVideo : video
                              ),
                          }
                        : playlist
                )
            );
        } catch (error) {
            console.error("Error updating video status:", error);
        }
    }, []);



    return (
        <PlaylistContext.Provider value={{ userPlaylists, setPlaylistData, setUserPlaylists, setVideoStatus }}>
            {children}
        </PlaylistContext.Provider>
    );
};
