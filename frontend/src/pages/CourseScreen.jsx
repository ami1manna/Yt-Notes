import React, { useContext, useState } from 'react';
import { PlaylistContext } from '../context/PlaylistsContext';
import CheckBox from '../components/ui/CheckBox';
import ScrollArea from '../components/ui/ScrollArea';

const CourseScreen = () => {
  const { userPlaylists } = useContext(PlaylistContext);
  const playListData = userPlaylists[0];
  const [selectedVideo, setSelectedVideo] = useState(playListData?.videos[0]?.videoId || '');

  return (
    <div className="flex w-screen h-screen">
      {/* Sidebar with Playlist */}
      <div className="h-full w-80 bg-gray-900 p-4 shadow-lg overflow-y-auto">
        <h2 className="text-white text-lg font-semibold mb-4">Playlist</h2>
        <ScrollArea className="h-[90vh] pr-2">
          {playListData.videos.map((video) => (
            <div 
              key={video.videoId} 
              className={`w-full p-3 border rounded-lg shadow-md transition duration-200 overflow-hidden cursor-pointer flex items-center gap-2 hover:bg-gray-800 ${selectedVideo === video.videoId ? 'bg-gray-700' : ''}`}
              onClick={() => setSelectedVideo(video.videoId)}
            >
              <CheckBox checked={selectedVideo === video.videoId}>
                <h3 className='text-sm text-white'>{video.title}</h3>
              </CheckBox>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Video Player */}
      <div className="flex-1 bg-gray-950 flex items-center justify-center">
        {selectedVideo ? (
          <iframe
            className='w-[90%] h-[80%] rounded-xl shadow-xl'
            src={`https://www.youtube.com/embed/${selectedVideo}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <p className="text-white text-lg">Select a video to play</p>
        )}
      </div>
    </div>
  );
};

export default CourseScreen;