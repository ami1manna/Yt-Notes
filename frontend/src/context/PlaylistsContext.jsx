import { createContext, useState, useEffect, useCallback, useContext } from "react";
import {setPlaylistVideoId, toggleVideo } from "../utils/VideoUtils";
import { toast } from "react-toastify";
 


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
        }
    }, [userPlaylists]); // Include userPlaylists in dependency array 
    
    
    
    // Set selected video index
    const setSelectedVideoId = useCallback(async (userEmail , playlistId, videoId) => {
        
        try {
            
            if (!userPlaylists[playlistId]) {
                throw new Error(`Playlist ${playlistId} not found`);
            }
            // Call the setPlaylistIndex function from your utility
            await setPlaylistVideoId(userEmail ,playlistId, videoId);

    
            setUserPlaylists((pre)=>{
                const updatedPlaylists = { ...pre };
                updatedPlaylists[playlistId] = {
                    ...updatedPlaylists[playlistId],
                    selectedVideoId: videoId,
                };
                return updatedPlaylists;

            });
            
           

           
        } catch (error) {
            toast.error(error.message, { position: "top-right", icon: "❌" });
            console.log(error.message);
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
                setSelectedVideoId, 
                resetPlaylist
            }}
        >
            {children}
        </PlaylistContext.Provider>
    );
};