import React, { useContext, useState } from 'react';
import { PlaylistContext } from '../context/PlaylistsContext';
import CheckBox from '../components/ui/CheckBox';
import { useParams } from 'react-router-dom';
import QuillEditor from '../components/ui/QuillEditor';
import Tiles from '../components/ui/Tiles';
import TextButton from '../components/ui/TextButton';
import IconButton from '../components/ui/IconButton';

// importing assests
import Next from '../assets/svg/next.svg'
import Prev from '../assets/svg/prev.svg'


const CourseScreen = () => {
  const { userPlaylists, setVideoStatus } = useContext(PlaylistContext);
  const { playlistIndex } = useParams();
  const playListData = userPlaylists[playlistIndex];
  const [selectedVideo, setSelectedVideo] = useState(playListData?.videos[0] || null);

  return (
    <div className="flex w-screen h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <div className="h-full w-80 p-4 shadow-lg overflow-y-auto bg-white dark:bg-gray-800 dark:text-white rounded-lg">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Playlist</h2>

        {playListData.videos.map((video) => (
          <div
            key={video.videoId}
            className={`w-full p-2 mb-2 border rounded-xl shadow-md transition-all duration-300 cursor-pointer flex items-center
 
    ${selectedVideo.videoId === video.videoId ? "bg-blue-500 dark:bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white"}`}
          >

            {/* Checkbox with custom style */}
            <CheckBox
              onChange={() => setVideoStatus(video.videoId, playListData.playlistId, "amitmannasm@gmail.com")}
              checked={video.done}
            />

            {/* Tiles Component */}
            <Tiles onClick={() => setSelectedVideo(video)} >
              {video.title}
            </Tiles>
          </div>

        ))}
      </div>


      {/* Video Player */}
      <div className="h-screen flex-1 bg-gray-50 dark:bg-gray-950 overflow-y-auto p-4  ">
        {selectedVideo ? (
          <>
            <div className="flex justify-between items-center mb-4">
            <IconButton className="bg-blue-500 hover:bg-blue-600 w-28  " icon={Prev} iconPosition='left' >
                Prev
              </IconButton>
              {selectedVideo.title}
              <IconButton className="bg-blue-500 hover:bg-blue-600 w-28  " icon={Next} iconPosition='right' >
                Next
              </IconButton>

              


            </div>
            <iframe
              key={selectedVideo.videoId}
              className="w-[100%] h-[80%] rounded-xl shadow-xl mb-4"
              src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>



          </>
        ) : (
          <p className="text-gray-800 dark:text-white text-lg">Select a video to play</p>
        )}
      </div>
    </div>
  );
};

export default CourseScreen;
