import { createContext, useState, useCallback } from "react";

export const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
    const [userPlaylists, setUserPlaylists] = useState([]);

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

    return (
        <PlaylistContext.Provider value={{ userPlaylists, setPlaylistData, setUserPlaylists }}>
            {children}
        </PlaylistContext.Provider>
    );
};