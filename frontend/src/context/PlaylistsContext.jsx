import { createContext, useState, useEffect, useCallback } from "react";
import { setPlaylistIndex, toggleVideo } from "../utils/DatabaseUtils";

export const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
    const [userPlaylists, setUserPlaylists] = useState(() => {
        try {
            const storedPlaylists = localStorage.getItem("userPlaylists");
            return storedPlaylists ? JSON.parse(storedPlaylists) : [];
        } catch (error) {
            console.error("Error loading playlists from localStorage:", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem("userPlaylists", JSON.stringify(userPlaylists));
        } catch (error) {
            console.error("Error saving playlists to localStorage:", error);
        }
    }, [userPlaylists]);

    // Add playlist(s)
    const setPlaylistData = useCallback((data) => {
        setUserPlaylists((prev) => {
            if (!data) return prev;

            const newPlaylists = Array.isArray(data) ? data : [data];
            const existingIds = new Set(prev.map((p) => p.playlistId));
            
            const updatedPlaylists = [...prev, ...newPlaylists.filter(p => !existingIds.has(p.playlistId))];
            return updatedPlaylists.length !== prev.length ? updatedPlaylists : prev;
        });
    }, []);

    // Toggle video status
    const setVideoStatus = useCallback(async (videoId, playlistId, userEmail) => {
        try {
            const result = await toggleVideo(videoId, playlistId, userEmail);
            if (!result) throw new Error("Invalid response from toggleVideo");

            setUserPlaylists((prev) =>
                prev.map((playlist) =>
                    playlist.playlistId === playlistId
                        ? {
                              ...playlist,
                              playlistProgress: result.progress,
                              videos: playlist.videos.map((video) =>
                                  video.videoId === videoId ? result.video : video
                              ),
                          }
                        : playlist
                )
            );
        } catch (error) {
            console.error("Error updating video status:", error);
        }
    }, []);

    // Set selected video index
    const setSelectedVideo = useCallback(async (email, playlistId, index) => {
        try {
            await setPlaylistIndex(email, playlistId, index);
            setUserPlaylists((prev) =>
                prev.map((playlist) =>
                    playlist.playlistId === playlistId ? { ...playlist, selectedVideoIndex: index } : playlist
                )
            );
        } catch (error) {
            console.error("Error setting selected video:", error);
        }
    }, []);

    return (
        <PlaylistContext.Provider value={{ userPlaylists, setPlaylistData, setUserPlaylists, setVideoStatus, setSelectedVideo }}>
            {children}
        </PlaylistContext.Provider>
    );
};
