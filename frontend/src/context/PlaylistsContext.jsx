import { createContext, useState, useEffect, useCallback } from "react";
import { setPlaylistIndex, toggleVideo } from "../utils/VideoUtils";

export const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
    const [userPlaylists, setUserPlaylists] = useState({});
        // try {
        //     const storedPlaylists = localStorage.getItem("userPlaylists");
        //     return storedPlaylists ? JSON.parse(storedPlaylists) : [];
        // } catch (error) {
        //     console.error("Error loading playlists from localStorage:", error);
        //     return [];
        // }

    // useEffect(() => {
    //     try {
    //         localStorage.setItem("userPlaylists", JSON.stringify(userPlaylists));
    //     } catch (error) {
    //         console.error("Error saving playlists to localStorage:", error);
    //     }
    // }, [userPlaylists]);

    // Add playlist(s)
    const setPlaylistData = useCallback((data) => {
        setUserPlaylists((prev) => {
          if (!data) return prev;
      
          // Ensure previous state is an object
          const prevPlaylists = typeof prev === "object" && !Array.isArray(prev) ? prev : {};
      
          // If data is already an object (key-value pair), merge it directly
          const newPlaylists = typeof data === "object" && !Array.isArray(data) ? data : {};
      
          // Merge with previous state
          return { ...prevPlaylists, ...newPlaylists };
        });
      }, []);
      
    

    // Toggle video status
    const setVideoStatus = useCallback(async (videoId, playlistId, userEmail) => {
        try {
            // Find the specific playlist
            const playlist = userPlaylists.find(p => p.playlistId === playlistId);
            if (!playlist) {
                throw new Error(`Playlist with ID ${playlistId} not found`);
            }
    
            // Call the toggle video function from your utility
            const result = await toggleVideo(videoId, playlistId, userEmail);
            if (!result) throw new Error("Invalid response from toggleVideo");
    
            // Update the playlist with new video and progress information
            setUserPlaylists((prev) => 
                prev.map((playlist) => {
                    if (playlist.playlistId !== playlistId) return playlist;
    
                    // Create a copy of the existing sections
                    const updatedSections = {...playlist.sections};
    
                    // If an updated section is returned, update it
                    if (result.updatedSection) {
                        const sectionKey = Object.keys(updatedSections).find(key => 
                            updatedSections[key].videoIds.includes(videoId)
                        );
    
                        if (sectionKey) {
                            updatedSections[sectionKey] = {
                                ...updatedSections[sectionKey],
                                completedLength: result.updatedSection.completedLength,
                                progressPercentage: result.updatedSection.progressPercentage
                            };
                        }
                    }
    
                    return {
                        ...playlist,
                        // Update the specific video's done status
                        videos: {
                            ...playlist.videos,
                            [videoId]: result.video
                        },
                        // Use the returned playlist progress directly
                        playlistProgress: result.playlistProgress,
                        // Update sections with the new progress information
                        sections: updatedSections
                    };
                })
            );
    
            return result;
        } catch (error) {
            console.error("Error updating video status:", error);
            throw error;
        }
    }, [userPlaylists]);

    
    // Set selected video index
    const setSelectedVideo = useCallback(async (email, playlistId, index) => {
        try {
            // Validate inputs
            if (!email || !playlistId || index < 0) {
                throw new Error("Invalid input for setSelectedVideo");
            }

            // Call the setPlaylistIndex function from your utility
            await setPlaylistIndex(email, playlistId, index);

            // Find the video ID at the specified index
            const playlist = userPlaylists.find(p => p.playlistId === playlistId);
            if (!playlist) {
                throw new Error(`Playlist with ID ${playlistId} not found`);
            }

            // Ensure the index is within the video order array
            const videoId = playlist.videoOrder[index];

            // Update the playlist with the new selected video
            setUserPlaylists((prev) => 
                prev.map((playlist) => 
                    playlist.playlistId === playlistId 
                        ? { 
                            ...playlist, 
                            selectedVideoId: videoId,
                            playlistProgress: index 
                          } 
                        : playlist
                )
            );

            return videoId;
        } catch (error) {
            console.error("Error setting selected video:", error);
            throw error;
        }
    }, [userPlaylists]);

    // Reset playlist
    const resetPlaylist = useCallback(() => {
        try {
            setUserPlaylists([]);
            console.log("Playlist reset");
        } catch (error) {
            console.error("Error resetting playlist:", error);
        }
    }, []);

    return (
        <PlaylistContext.Provider 
            value={{ 
                userPlaylists, 
                setPlaylistData, 
                setUserPlaylists, 
                setVideoStatus, 
                setSelectedVideo, 
                resetPlaylist
            }}
        >
            {children}
        </PlaylistContext.Provider>
    );
};