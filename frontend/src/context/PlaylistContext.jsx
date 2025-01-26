import React, { createContext, useState, useContext, useReducer } from 'react';
import axios from 'axios';

// Initial State
const initialState = {
  videos: [],
  loading: false,
  error: null,
  playlistId: '',
  nextPageToken: '',
  totalVideos: 0,
  playlistTitle: ''
};

// Action Types
const ACTIONS = {
  SET_PLAYLIST_URL: 'SET_PLAYLIST_URL',
  FETCH_VIDEOS_START: 'FETCH_VIDEOS_START',
  FETCH_VIDEOS_SUCCESS: 'FETCH_VIDEOS_SUCCESS',
  FETCH_VIDEOS_ERROR: 'FETCH_VIDEOS_ERROR',
  LOAD_MORE_VIDEOS: 'LOAD_MORE_VIDEOS',
  RESET_PLAYLIST: 'RESET_PLAYLIST',
  SET_PLAYLIST_TITLE: 'SET_PLAYLIST_TITLE'
};

// Utility function to extract playlist ID from URL
function extractPlaylistId(url) {
  try {
    // Remove any whitespace
    url = url.trim();

    // Regex patterns for different YouTube playlist URL formats
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*?list=([a-zA-Z0-9_-]+)/,
      /^([a-zA-Z0-9_-]+)$/ // Direct playlist ID
    ];

    for (let pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  } catch (error) {
    console.error('Error extracting playlist ID:', error);
    return null;
  }
}

// Reducer Function
function playlistReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_PLAYLIST_URL:
      return { ...state, playlistId: action.payload };
    
    case ACTIONS.SET_PLAYLIST_TITLE:
      return { ...state, playlistTitle: action.payload };
    
    case ACTIONS.FETCH_VIDEOS_START:
      return { ...state, loading: true, error: null };
    
    case ACTIONS.FETCH_VIDEOS_SUCCESS:
      return {
        ...state,
        loading: false,
        videos: action.payload.isLoadMore 
          ? [...state.videos, ...action.payload.videos]
          : action.payload.videos,
        nextPageToken: action.payload.nextPageToken || '',
        totalVideos: action.payload.isLoadMore 
          ? state.totalVideos + action.payload.videos.length
          : action.payload.videos.length
      };
    
    case ACTIONS.FETCH_VIDEOS_ERROR:
      return { ...state, loading: false, error: action.payload };
    
    case ACTIONS.RESET_PLAYLIST:
      return initialState;
    
    default:
      return state;
  }
}

// Create Context
const PlaylistContext = createContext();

// Provider Component
export function PlaylistProvider({ children }) {
  const [state, dispatch] = useReducer(playlistReducer, initialState);
  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  // Set Playlist URL and Extract ID
  const setPlaylistUrl = (url) => {
    const playlistId = extractPlaylistId(url);
    
    if (!playlistId) {
      dispatch({ 
        type: ACTIONS.FETCH_VIDEOS_ERROR, 
        payload: 'Invalid YouTube Playlist URL' 
      });
      return;
    }

    dispatch({ 
      type: ACTIONS.SET_PLAYLIST_URL, 
      payload: playlistId 
    });
  };

  // Fetch Playlist Videos
  const fetchPlaylistVideos = async (pageToken = '') => {
    if (!state.playlistId) {
      dispatch({ 
        type: ACTIONS.FETCH_VIDEOS_ERROR, 
        payload: 'Please enter a valid Playlist URL' 
      });
      return;
    }

    dispatch({ type: ACTIONS.FETCH_VIDEOS_START });

    try {
      // First, fetch playlist details to get title
      const playlistResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlists`, 
        {
          params: {
            part: 'snippet',
            id: state.playlistId,
            key: API_KEY
          }
        }
      );

      // Set playlist title if available
      if (playlistResponse.data.items.length > 0) {
        dispatch({
          type: ACTIONS.SET_PLAYLIST_TITLE,
          payload: playlistResponse.data.items[0].snippet.title
        });
      }

      // Then fetch playlist items
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlistItems`, 
        {
          params: {
            part: 'snippet',
            playlistId: state.playlistId,
            maxResults: 50,
            pageToken: pageToken,
            key: API_KEY
          }
        }
      );
      
      // Fetch video durations
      const videoIds = response.data.items.map(
        item => item.snippet.resourceId.videoId
      );

      const videosDetailsResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos`,
        {
          params: {
            part: 'contentDetails',
            id: videoIds.join(','),
            key: API_KEY
          }
        }
      );

      // Create a map of video IDs to durations
      const videoDurations = videosDetailsResponse.data.items.reduce(
        (acc, video) => {
          acc[video.id] = formatDuration(video.contentDetails.duration);
          return acc;
        }, 
        {}
      );

      const fetchedVideos = response.data.items.map(item => ({
        title: item.snippet.title,
        videoId: item.snippet.resourceId.videoId,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
        duration: videoDurations[item.snippet.resourceId.videoId] || 'N/A'
      }));

      dispatch({
        type: ACTIONS.FETCH_VIDEOS_SUCCESS,
        payload: {
          videos: fetchedVideos,
          nextPageToken: response.data.nextPageToken,
          isLoadMore: !!pageToken
        }
      });
    } catch (err) {
      const errorMessage = err.response 
        ? `Error: ${err.response.status} - ${err.response.data.error.message}`
        : 'An unexpected error occurred';
      
      dispatch({ 
        type: ACTIONS.FETCH_VIDEOS_ERROR, 
        payload: errorMessage 
      });
    }
  };

  // Duration formatting utility
  function formatDuration(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Load More Videos
  const loadMoreVideos = () => {
    if (state.nextPageToken) {
      fetchPlaylistVideos(state.nextPageToken);
    }
  };

  // Reset Playlist
  const resetPlaylist = () => {
    dispatch({ type: ACTIONS.RESET_PLAYLIST });
  };

  // Context Value
  const contextValue = {
    ...state,
    fetchPlaylistVideos,
    setPlaylistUrl,
    loadMoreVideos,
    resetPlaylist
  };

  return (
    <PlaylistContext.Provider value={contextValue}>
      {children}
    </PlaylistContext.Provider>
  );
}

// Custom Hook for using Playlist Context
export function usePlaylist() {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
}