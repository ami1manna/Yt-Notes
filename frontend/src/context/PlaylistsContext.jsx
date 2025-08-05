import { createContext, useState, useCallback } from "react";
import PropTypes from 'prop-types';

export const PlaylistsContext = createContext();

export const PlaylistsProvider = ({ children }) => {
  const [playlistData, setPlaylistData] = useState(null); // Full data for a single playlist

  const setFullPlaylistData = useCallback((data) => {
    setPlaylistData(data || null);
  }, []);

  const resetPlaylist = useCallback(() => {
    setPlaylistData(null);
  }, []);

  return (
    <PlaylistsContext.Provider
      value={{
        playlistData,
        setFullPlaylistData,
        resetPlaylist,
      }}
    >
      {children}
    </PlaylistsContext.Provider>
  );
};

PlaylistsProvider.propTypes = {
  children: PropTypes.node.isRequired
};