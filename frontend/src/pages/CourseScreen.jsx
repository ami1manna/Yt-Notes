import React, { useContext, useState, useEffect } from "react";
import { PlaylistContext } from "../context/PlaylistsContext";
import { useParams } from "react-router-dom";

// components
import SideNav from "../components/ui/SideNav";
import IconButton from "../components/ui/IconButton";

// Icons
import { ArrowBigLeftDash, ArrowBigRightDash } from "lucide-react";
import SideNote from "../components/ui/SideNote";
import SunEditorComponent from "../components/ui/SunEditor";
import { AuthContext } from "../context/AuthContext";
 

const CourseScreen = () => {
  const { userPlaylists, setVideoStatus, setSelectedVideo } = useContext(PlaylistContext);
  const { playlistIndex } = useParams();
  const playListData = userPlaylists[playlistIndex];
  const { user } = useContext(AuthContext);
  // Get the initial selected video index from the provider if available
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(
    playListData?.selectedVideoIndex || 0
  );

  const selectedVideo = playListData?.videos?.[selectedVideoIndex] || null;

  // Sync selected video index with the provider & backend
  useEffect(() => {
    if (playListData && selectedVideoIndex !== playListData.selectedVideoIndex) {
    
      setSelectedVideo(user.email, playListData.playlistId, selectedVideoIndex);
    }
  }, [selectedVideoIndex, playListData, setSelectedVideo]);

  // Function to go to the next video
  const handleNextVideo = () => {
    if (playListData && selectedVideoIndex < playListData.videos.length - 1) {
      setSelectedVideoIndex((prevIndex) => prevIndex + 1);
    }
  };

  // Function to go to the previous video
  const handlePrevVideo = () => {
    if (selectedVideoIndex > 0) {
      setSelectedVideoIndex((prevIndex) => prevIndex - 1);
    }
  };

  if (!playListData) {
    return <p className="text-gray-800 dark:text-white text-lg">Playlist not found.</p>;
  }

  return (
    <div className="flex w-screen h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Side Navigation */}
      <SideNav
        playListData={playListData}
        selectedVideoIndex={selectedVideoIndex}
        setSelectedVideoIndex={setSelectedVideoIndex}
        setVideoStatus={setVideoStatus}
      />

      {/* Video Player */}
      <div className="h-screen flex-1 bg-gray-50 dark:bg-gray-950 overflow-y-auto p-4">
        {selectedVideo ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <IconButton
                className={`bg-blue-500 hover:bg-blue-600 w-28 ${
                  selectedVideoIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                icon={ArrowBigLeftDash}
                iconPosition="left"
                onClick={handlePrevVideo}
                disabled={selectedVideoIndex === 0}
              >
                Prev
              </IconButton>

              <span className="text-lg font-semibold">{selectedVideo.title}</span>
               
              <IconButton
                className={`bg-blue-500 hover:bg-blue-600 w-28 ${
                  selectedVideoIndex === playListData.videos.length - 1
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                icon={ArrowBigRightDash}
                iconPosition="right"
                onClick={handleNextVideo}
                disabled={selectedVideoIndex === playListData.videos.length - 1}
              >
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

      {/* Side Notes */}
      <SideNote>
        <SunEditorComponent playlistId={playListData.playlistId} videoId={selectedVideo?.videoId} />
      </SideNote>
    </div>
  );
};

export default CourseScreen;
