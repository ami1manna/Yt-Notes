import React, { useContext } from 'react'
import { PlaylistContext } from '../../context/PlaylistsContext'
import VideoCard from '../ui/VideoCard';


const CourseList = () => {
const {userPlaylists,setUserPlaylists} = useContext(PlaylistContext);

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
            {userPlaylists && userPlaylists.map((playlist) => (
                <VideoCard 
                    title={playlist.playlistUrl}
                    thumbnailUrl={playlist.playlistThumbnailUrl}
                />
            ))}
        </div>
    )
}

export default CourseList
