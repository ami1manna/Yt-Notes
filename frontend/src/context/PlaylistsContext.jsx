import { createContext, useState, useCallback } from "react";

export const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
    const [userPlaylists, setUserPlaylists] = useState([]);

    const setPlaylistData = useCallback((data) => {
        setUserPlaylists((prevPlaylists) => {
            // Check if the playlist already exists to prevent duplicates
            const isDuplicate = prevPlaylists.some(
                playlist => playlist.playlistId === data.playlistId
            );

            // If not a duplicate, add the new playlist
            if (!isDuplicate) {
                return [...prevPlaylists, data];
            }

            // If duplicate, return existing playlists
            return prevPlaylists;
        });
    }, []);

    return (
        <PlaylistContext.Provider value={{ userPlaylists, setPlaylistData }}>
            {children}
        </PlaylistContext.Provider>
    );
};