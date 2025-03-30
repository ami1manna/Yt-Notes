import { createContext, useState, useEffect, useCallback } from "react";
import { setPlaylistIndex, toggleVideo } from "../utils/VideoUtils";
import { toast } from "react-toastify";
import { use } from "react";

export const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
    const [userPlaylists, setUserPlaylists] = useState({});
   
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
      
    

    
    const setVideoStatus = useCallback(async (videoId, playlistId, userEmail , sectionId) => {
        try {
            
            if (!userPlaylists[playlistId]) {
                throw new Error(`Playlist ${playlistId} not found`);
            }
            
            const result = await toggleVideo(videoId, playlistId, userEmail );
            
            setUserPlaylists((prevUserPlaylists) => {
                const updatedPlaylists = { ...prevUserPlaylists };
                const updatedVideos = { ...updatedPlaylists[playlistId].videos };
                
                
                // Use the result from toggleVideo if available, otherwise toggle manually
                updatedVideos[videoId] = result.video || {
                    ...updatedVideos[videoId],
                    done: !updatedVideos[videoId].done
                };
                
                // update the section
                let updatedSection = {};
                if(sectionId){
                    updatedSection = { ...updatedPlaylists[playlistId].sections };
                    updatedSection[sectionId] = result.updatedSection;
                }

                updatedPlaylists[playlistId] = {
                    ...updatedPlaylists[playlistId],
                    videos: updatedVideos,
                    playlistProgress: result.playlistProgress,
                    sections: updatedSection
                };
                
                return updatedPlaylists;
            });
            
            return result;
        } catch (error) {
            toast.error(error.message, { position: "top-right", icon: "❌" });
            console.error("Error updating video status:", error);
        }
    }, [userPlaylists]); // Include userPlaylists in dependency array 
    
    
    
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