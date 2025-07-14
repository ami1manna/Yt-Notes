import { createContext, useState, useCallback } from "react";
import PropTypes from 'prop-types';

export const PlaylistSummariesContext = createContext();

export const PlaylistSummariesProvider = ({ children }) => {
  const [userPlaylistSummaries, setUserPlaylistSummaries] = useState([]);

  const setPlaylistSummaries = useCallback((data) => {
    if (Array.isArray(data)) {
      setUserPlaylistSummaries(data);
    } else {
      setUserPlaylistSummaries([]);
    }
  }, []);

  const resetPlaylistSummaries = useCallback(() => {
    setUserPlaylistSummaries([]);
  }, []);

  return (
    <PlaylistSummariesContext.Provider
      value={{
        userPlaylistSummaries,
        setPlaylistSummaries,
        resetPlaylistSummaries,
      }}
    >
      {children}
    </PlaylistSummariesContext.Provider>
  );
};

PlaylistSummariesProvider.propTypes = {
  children: PropTypes.node.isRequired
}; 