import { createContext, useState, useCallback, useEffect } from "react";

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

    return (
        <PlaylistContext.Provider value={{ userPlaylists, setPlaylistData, setUserPlaylists }}>
            {children}
        </PlaylistContext.Provider>
    );
};
