import React, { createContext, useState, useContext, useEffect } from 'react';
import { addTranscript } from '../utils/Transcript';
import { toast } from 'react-toastify';

// Create the context
const TranscriptContext = createContext();

// Custom hook for using the transcript context
export const useTranscript = () => {
  const context = useContext(TranscriptContext);
  if (!context) {
    throw new Error('useTranscript must be used within a TranscriptProvider');
  }
  return context;
};

// Provider component
export const TranscriptProvider = ({ children }) => {
  const [transcriptData, setTranscriptData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copying, setCopying] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [error, setError] = useState(null);

  // Fetch transcript data when videoId changes
  useEffect(() => {
    if (!currentVideoId) {
      setTranscriptData([]);
      setError(null);
      return;
    }
    
    // Automatically fetch transcript when video ID changes
    addNewTranscript(currentVideoId);
  }, [currentVideoId]);

  // Add new transcript (only handles fetching the transcript)
  const addNewTranscript = async (videoId) => {
    if (!videoId) return;
    
    setLoading(true);
    setError(null);
   
    try {
      const result = await addTranscript({ videoId });
      
      // Check if result is valid and has content
      if (!result || result.error) {
        // Handle explicit error response
        setTranscriptData([]);
        setError(result?.error || "Failed to load transcript");
        toast.error(result?.error || "Failed to load transcript", {
          position: "top-right",
          icon: "❌",
        });
      } else if (Array.isArray(result) && result.length > 0) {
        // Valid array with content
        setTranscriptData(result);
        setError(null);
        toast.success("Transcript loaded successfully", {
          position: "top-right",
          icon: "✅",
        });
      } else if (Array.isArray(result) && result.length === 0) {
        // Empty array (no transcript found)
        setTranscriptData([]);
        setError("No transcript data available for this video");
        toast.info("No transcript data available for this video", {
          position: "top-right",
        });
      } else {
        // Unexpected response format
        console.error("Unexpected response format:", result);
        setTranscriptData([]);
        setError("Received an invalid response format");
        toast.error("Invalid response format from transcript service", {
          position: "top-right",
          icon: "❌",
        });
      }
    } catch (error) {
      console.error("Transcript fetch error:", error);
      setError(error?.message || "An unexpected error occurred");
      setTranscriptData([]);
      toast.error(error?.message || "An unexpected error occurred", {
        position: "top-right",
        icon: "❌",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to copy all transcript text
  const copyTranscriptText = async (transcriptItems) => {
    if (!transcriptItems || transcriptItems.length === 0) return;
   
    setCopying(true);
   
    try {
      const fullText = transcriptItems.map(item => item.text).join('\n\n');
      await navigator.clipboard.writeText(fullText);
      toast.success("Transcript copied to clipboard!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to copy transcript", {
        position: "top-right",
      });
    } finally {
      // Set copying state to true for visual feedback
      setTimeout(() => {
        setCopying(false);
      }, 1500);
    }
  };

  // Context value
  const value = {
    transcriptData,
    loading,
    copying,
    currentVideoId,
    error,
    setCurrentVideoId,
    addNewTranscript,
    copyTranscriptText
  };

  return (
    <TranscriptContext.Provider value={value}>
      {children}
    </TranscriptContext.Provider>
  );
};