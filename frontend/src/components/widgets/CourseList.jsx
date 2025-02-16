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
          <NavLink to={`/courseScreen/${index}`} key={playlist.playlistId}>
          <VideoCard
             // Use playlistId as the unique key
            title={playlist.channelTitle || 'Untitled Playlist'}  
            thumbnailUrl={playlist.playlistThumbnailUrl}  
            progress={playlist.playlistProgress} 
            target={playlist.playlistLength}
            />
            
            
            </NavLink> 

        ))}

        
      </div>
    </>
  );
};

export default CourseList;