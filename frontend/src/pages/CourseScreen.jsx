// CourseScreen.jsx
import React, { useContext, useState, useEffect } from "react";
import { PlaylistContext } from "../context/PlaylistsContext";
import { useParams } from "react-router-dom";
import SideNav from "../components/ui/SideNav";
import IconButton from "../components/ui/IconButton";
import { ArrowBigLeftDash, ArrowBigRightDash, PenLine } from "lucide-react";
import SideNote from "../components/ui/SideNote";
import SunEditorComponent from "../components/ui/SunEditor";
import { AuthContext } from "../context/AuthContext";

const CourseScreen = () => {
  const { userPlaylists, setVideoStatus, setSelectedVideo } = useContext(PlaylistContext);
  const { playlistIndex } = useParams();
  const playListData = userPlaylists[playlistIndex];
  const { user } = useContext(AuthContext);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(playListData?.selectedVideoIndex || 0);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const selectedVideo = playListData?.videos?.[selectedVideoIndex] || null;

  useEffect(() => {
    if (playListData && selectedVideoIndex !== playListData.selectedVideoIndex) {
      setSelectedVideo(user.email, playListData.playlistId, selectedVideoIndex);
    }
  }, [selectedVideoIndex, playListData, setSelectedVideo]);

  const handleNextVideo = () => {
    if (playListData && selectedVideoIndex < playListData.videos.length - 1) {
      setSelectedVideoIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevVideo = () => {
    if (selectedVideoIndex > 0) {
      setSelectedVideoIndex((prevIndex) => prevIndex - 1);
    }
  };

  if (!playListData) {
    return <p className="text-gray-800 dark:text-white text-lg">Playlist not found.</p>;
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row w-full h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="h-[60vh] lg:h-full">
        <SideNav
          playListData={playListData}
          selectedVideoIndex={selectedVideoIndex}
          setSelectedVideoIndex={setSelectedVideoIndex}
          setVideoStatus={setVideoStatus}
        />
      </div>

      <div className="h-[40vh] lg:h-full lg:flex-1 bg-gray-50 dark:bg-gray-950 overflow-y-auto p-4">
        {selectedVideo ? (
          <>
            <div className="flex justify-between items-center mb-4 gap-2]">
              <IconButton
                className={`bg-blue-500 hover:bg-blue-600 w-20 lg:w-28 ${
                  selectedVideoIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                icon={ArrowBigLeftDash}
                iconPosition="left"
                onClick={handlePrevVideo}
                disabled={selectedVideoIndex === 0}
              >
                <span className="hidden sm:inline">Prev</span>
              </IconButton>

              <span className="text-sm lg:text-lg font-semibold truncate">{selectedVideo.title}</span>
               
              <IconButton
                className={`bg-blue-500 hover:bg-blue-600 w-20 lg:w-28 ${
                  selectedVideoIndex === playListData.videos.length - 1
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                icon={ArrowBigRightDash}
                iconPosition="right"
                onClick={handleNextVideo}
                disabled={selectedVideoIndex === playListData.videos.length - 1}
              >
                <span className="hidden sm:inline">Next</span>
              </IconButton>
            </div>

            <div className="relative w-full pt-[56.25%]">
              <iframe
                key={selectedVideo.videoId}
                className="absolute top-0 left-0 w-full h-full rounded-xl shadow-xl"
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </>
        ) : (
          <p className="text-gray-800 dark:text-white text-lg">Select a video to play</p>
        )}
      </div>

      
       
        <SideNote>
          <SunEditorComponent playlistId={playListData.playlistId} videoId={selectedVideo?.videoId} />
        </SideNote>
       

      
    </div>
  );
};

export default CourseScreen;