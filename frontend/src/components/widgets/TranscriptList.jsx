import React, { useEffect } from "react";
import TranscriptTile from "../ui/TranscriptTile";
import { useTranscript } from "../../context/TranscriptContext";
import { Copy, Check, CloudDownload } from "lucide-react";
import IconButton from "../ui/IconButton";

const TranscriptList = ({ videoId }) => {
  const {
    loading,
    copying,
    error,
    currentVideoId,
    setCurrentVideoId,
    addNewTranscript,
    copyTranscriptText,
    transcriptData
  } = useTranscript();

  // Set current video ID when component mounts or videoId prop changes
  useEffect(() => {
    if (videoId && videoId !== currentVideoId) {
      setCurrentVideoId(videoId);
    }
  }, [videoId, currentVideoId, setCurrentVideoId]);

  // Function to handle copy action
  const handleCopyTranscript = () => {
    copyTranscriptText(transcriptData);
  };

  // Function to fetch transcript
  const fetchTranscript = () => {
    addNewTranscript(videoId);
  };

  // Don't render if no video ID is provided
  if (!videoId) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-gray-500 dark:text-gray-400">No video selected</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-2 h-[100vh] overflow-hidden overflow-y-auto">
     

      {/* Title and smaller copy button moved to top right
      <div className="sticky top-0  mb-3">
        <div className="flex justify-between items-center">
         

          {transcriptData && transcriptData.length > 0 && (
            <button
              onClick={handleCopyTranscript}
              className="flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-300 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled={copying}
            >
              {copying ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span>{copying ? "Copied" : "Copy"}</span>
            </button>
          )}
        </div>
      </div> */}

      {/* Content section */}
      <div className="rounded-xl p-6 shadow-sm dark:bg-gray-800 dark:shadow-lg">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-400 dark:border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">Loading transcript...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400 dark:text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Error loading transcript</p>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
              {error || "There was a problem loading the transcript."}
            </p>
            <IconButton
              type="button"
              onClick={fetchTranscript}
              className="mt-2 font-medium px-6"
              isLoading={loading}
              icon={CloudDownload}
              iconPosition="right"
            >
              Try Again
            </IconButton>
          </div>
        ) : transcriptData && transcriptData.length > 0 ? (
          <div className="space-y-4">
            <button
              onClick={handleCopyTranscript}
              className="flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-300 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled={copying}
            >
              {copying ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span>{copying ? "Copied" : "Copy"}</span>
            </button>
            {transcriptData.map((item, index) => (
              <TranscriptTile
                key={index}
                timestamp={{ start: item.start, end: item.end }}
                text={item.text}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">No transcript available</p>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
              Transcript data for this video hasn't been loaded yet.
            </p>
            <IconButton
              type="button"
              onClick={fetchTranscript}
              className="mt-2 font-medium px-6"
              isLoading={loading}
              icon={CloudDownload}
              iconPosition="right"
            >
              Get Transcript
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptList;