import React, { useContext, useState } from 'react';
import { PlaylistContext } from '../context/PlaylistsContext';
import CheckBox from '../components/ui/CheckBox';
import { useParams } from 'react-router-dom';
import QuillEditor from '../components/ui/QuillEditor';
 

const CourseScreen = () => {
  const { userPlaylists, setVideoStatus } = useContext(PlaylistContext);
  const { playlistIndex } = useParams();
  const playListData = userPlaylists[playlistIndex];
  const [selectedVideo, setSelectedVideo] = useState(playListData?.videos[0]?.videoId || '');

  return (
    <div className="flex w-screen h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <div className="h-full w-80 p-4 shadow-lg overflow-y-auto bg-white dark:bg-gray-800 dark:text-white">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Playlist</h2>

        {playListData.videos.map((video) => (
          <div
            key={video.videoId}
            className={`w-full p-3 border rounded-lg shadow-md transition duration-200 overflow-hidden cursor-pointer flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 ${
              selectedVideo === video.videoId ? 'bg-gray-300 dark:bg-gray-600' : ''
            }`}
            onClick={() => setSelectedVideo(video.videoId)}
          >
            <CheckBox
              onChange={() => setVideoStatus(video.videoId, playListData.playlistId, 'amitmannasm@gmail.com')}
              checked={video.done}
            >
              <h3 className="text-sm text-gray-700 dark:text-white">{video.title}</h3>
            </CheckBox>
          </div>
        ))}
      </div>

      {/* Video Player */}
      <div className="h-screen flex-1 bg-gray-50 dark:bg-gray-950 overflow-y-auto p-4  ">
        {selectedVideo ? (
          <>
           
            <iframe
              key={selectedVideo}
              className="w-[100%] h-[80%] rounded-xl shadow-xl mb-4"
              src={`https://www.youtube.com/embed/${selectedVideo}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              ></iframe>

            <QuillEditor />
               
          </>
        ) : (
          <p className="text-gray-800 dark:text-white text-lg">Select a video to play</p>
        )}
      </div>
    </div>
  );
};

export default CourseScreen;
