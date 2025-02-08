import React, { useContext } from 'react';
import { PlaylistContext } from '../../context/PlaylistsContext';
import VideoCard from '../ui/VideoCard';
import FallBackScreen from './FallBackScreen';
import { NavLink } from 'react-router-dom';

const CourseList = () => {
  const { userPlaylists, setUserPlaylists } = useContext(PlaylistContext);

  return (
    <>
      
      {userPlaylists.length === 0 && <FallBackScreen />} {/* Show fallback if no playlists */}
      <div className=" h-max grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 w-full auto-rows-auto">

         {userPlaylists.map((playlist, index) => (
          <NavLink to={`/courseScreen/${index}`}>
          <VideoCard
            key={playlist.playlistId} // Use playlistId as the unique key
            title={playlist.channelTitle || 'Untitled Playlist'} // Use channelTitle or a fallback
            thumbnailUrl={playlist.playlistThumbnailUrl} // Use playlistThumbnailUrl
            />
            </NavLink> 

        ))}

        
      </div>
    </>
  );
};

export default CourseList;