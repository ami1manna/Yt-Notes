import React, { createContext, useState, useContext, useEffect } from 'react';
import { getEducationalNotes } from '../utils/SumarizeUtlis';
import { useTranscript } from './TranscriptContext';

// Create the context
const EducationalNotesContext = createContext();

// Custom hook for using the educational notes context
export const useEducationalNotes = () => {
  const context = useContext(EducationalNotesContext);
  if (!context) {
    throw new Error('useEducationalNotes must be used within an EducationalNotesProvider');
  }
  return context;
};

// Provider component
export const EducationalNotesProvider = ({ children }) => {
  const [notes, setNotes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    topics: true,
    resources: true
  });
  const [expandedTopics, setExpandedTopics] = useState({});
  const [currentVideoId, setCurrentVideoId] = useState(null);
  
  // Get transcript context to check if transcript is available
  const { transcriptData, currentVideoId: transcriptVideoId } = useTranscript();

  // Fetch notes when videoId changes and transcript is available
  useEffect(() => {
    if (!currentVideoId) {
      setNotes(null);
      setError(null);
      return;
    }
    
    // Only fetch notes if we have transcript data for this video
    if (transcriptData && 
        transcriptData.length > 0 && 
        transcriptVideoId === currentVideoId) {
      fetchNotes(currentVideoId);
    }
  }, [currentVideoId, transcriptData, transcriptVideoId]);

  // Fetch educational notes
  const fetchNotes = async (videoId) => {
    if (!videoId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await getEducationalNotes(videoId);
      
      if (result.error) {
        setError(result.error);
        setNotes(null);
      } else {
        setNotes(result.notes);
        // Initialize expanded state for topics
        if (result.notes && result.notes.topics) {
          const topicState = {};
          result.notes.topics.forEach((_, idx) => {
            topicState[idx] = idx === 0; // Only expand first topic by default
          });
          setExpandedTopics(topicState);
        }
      }
    } catch (err) {
      setError('Failed to fetch educational notes');
      setNotes(null);
    } finally {
      setLoading(false);
    }
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Toggle topic expansion
  const toggleTopic = (index) => {
    setExpandedTopics(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Handle timestamp click for video jumping
  const handleTimestampClick = (timestamp) => {
    if (typeof window !== 'undefined') {
      // Create a custom event that the video player component can listen for
      const event = new CustomEvent('jumpToTimestamp', { 
        detail: { timestamp } 
      });
      window.dispatchEvent(event);
    }
  };

  // Context value
  const value = {
    notes,
    loading,
    error,
    expandedSections,
    expandedTopics,
    currentVideoId,
    setCurrentVideoId,
    fetchNotes,
    toggleSection,
    toggleTopic,
    handleTimestampClick
  };

  return (
    <EducationalNotesContext.Provider value={value}>
      {children}
    </EducationalNotesContext.Provider>
  );
};