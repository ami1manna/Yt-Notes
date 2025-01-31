import { createContext, useState } from "react";

export const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
    const [userPlaylists, setUserPlaylists] = useState([]);

    return (
        <PlaylistContext.Provider value={{ userPlaylists, setUserPlaylists }}>
            {children}
        </PlaylistContext.Provider>
    );
};