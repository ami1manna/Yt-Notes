import React, { useContext } from 'react'
import { use } from 'react'
import { PlaylistContext } from '../../context/PlaylistsContext'


const CourseList = () => {
const {userPlaylists,setUserPlaylists} = useContext(PlaylistContext);

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
            {userPlaylists && userPlaylists.map((playlist) => (
                <div key={playlist.playlistId} className="bg-gray-100 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold">{playlist.playlistUrl}</h2>
                    {/* <p className="text-gray-600">{playlist.description}</p> */}
                </div>
            ))}
        </div>
    )
}

export default CourseList
