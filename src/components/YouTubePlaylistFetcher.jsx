import React, { useState, useEffect } from 'react';
import axios from 'axios';

function YouTubePlaylistFetcher() {
  // State variables
  const [playlistId, setPlaylistId] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState('');

  // Your YouTube Data API Key (IMPORTANT: Use environment variable in production)
  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  // Function to fetch playlist videos
  const fetchPlaylistVideos = async (pageToken = '') => {
    // Input validation
    if (!playlistId) {
      setError('Please enter a valid Playlist ID');
      return;
    }

    if (!API_KEY) {
      setError('YouTube API Key is missing');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch playlist items with pagination support
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlistItems`, 
        {
          params: {
            part: 'snippet',
            playlistId: playlistId,
            maxResults: 50,
            pageToken: pageToken,
            key: API_KEY
          }
        }
      );

      // Extract video details
      const fetchedVideos = response.data.items.map(item => ({
        title: item.snippet.title,
        videoId: item.snippet.resourceId.videoId,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString()
      }));

      // Update videos - append for pagination or set new
      setVideos(prev => 
        pageToken ? [...prev, ...fetchedVideos] : fetchedVideos
      );

      // Update next page token
      setNextPageToken(response.data.nextPageToken || '');
    } catch (err) {
      // Detailed error handling
      console.error('Fetch Error:', err);

      if (err.response) {
        // The request was made and the server responded with a status code
        switch (err.response.status) {
          case 400:
            setError('Invalid Playlist ID or Bad Request');
            break;
          case 403:
            setError('API Quota Exceeded or Invalid API Key');
            break;
          case 404:
            setError('Playlist Not Found');
            break;
          default:
            setError(`Error: ${err.response.status} - ${err.response.data.error.message}`);
        }
      } else if (err.request) {
        setError('No response from YouTube API. Check your internet connection.');
      } else {
        setError('Error setting up the request. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load more videos function
  const loadMoreVideos = () => {
    if (nextPageToken) {
      fetchPlaylistVideos(nextPageToken);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        YouTube Playlist Explorer
      </h1>
      
      {/* Playlist ID Input */}
      <div className="flex mb-6 shadow-lg">
        <input 
          type="text"
          value={playlistId}
          onChange={(e) => setPlaylistId(e.target.value)}
          placeholder="Enter YouTube Playlist ID"
          className="flex-grow p-3 border-2 border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button 
          onClick={() => fetchPlaylistVideos()}
          className="bg-red-600 text-white px-6 py-3 rounded-r-lg hover:bg-red-700 transition duration-300 ease-in-out"
        >
          Fetch Playlist
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center my-4">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-red-500 rounded-full"></div>
          <p className="text-gray-600 mt-2">Loading playlist...</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Videos Grid */}
      {videos.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <div 
                key={`${video.videoId}-${index}`} 
                className="bg-white rounded-lg overflow-hidden shadow-md transform transition hover:scale-105"
              >
                {/* Thumbnail */}
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title} 
                  className="w-full h-48 object-cover"
                />
                
                {/* Video Details */}
                <div className="p-4">
                  <h2 className="font-bold text-lg mb-2 line-clamp-2">
                    {video.title}
                  </h2>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{video.channelTitle}</span>
                    <span>{video.publishedAt}</span>
                  </div>
                  
                  {/* Watch Button */}
                  <a 
                    href={`https://www.youtube.com/watch?v=${video.videoId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-2 block bg-red-500 text-white text-center py-2 rounded hover:bg-red-600 transition duration-300"
                  >
                    Watch Video
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {nextPageToken && (
            <div className="text-center mt-6">
              <button 
                onClick={loadMoreVideos}
                className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition duration-300"
              >
                Load More Videos
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default YouTubePlaylistFetcher;