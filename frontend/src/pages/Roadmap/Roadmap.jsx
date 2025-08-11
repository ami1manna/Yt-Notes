// App.jsx
import React, { useState, useEffect } from 'react';
import Canvas from '@/components/roadmap/Canvas';
import { formatDuration } from '@/utils/Coverter';
import playlistData from '@/components/roadmap/data/nodes.json';
import { Eye, EyeOff, Play, Clock } from 'lucide-react';

const Roadmap = () => {
  const [filter, setFilter] = useState({ showImages: true });
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  const toggleImages = () => {
    setFilter(prev => ({ ...prev, showImages: !prev.showImages }));
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  // Create modal root if it doesn't exist
  useEffect(() => {
    if (!document.getElementById('modal-root')) {
      const modalRoot = document.createElement('div');
      modalRoot.id = 'modal-root';
      document.body.appendChild(modalRoot);
    }
  }, []);
  
  return (
    <div className="relative w-full h-screen bg-gray-50 dark:bg-gray-900">
      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95">
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Play size={20} className="text-red-500" />
              YouTube Flow
            </h2>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <div className="text-yellow-500">☀️</div>
              ) : (
                <div className="text-gray-600">🌙</div>
              )}
            </button>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleImages}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  filter.showImages
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {filter.showImages ? <Eye size={16} /> : <EyeOff size={16} />}
                <span className="text-sm font-medium">
                  {filter.showImages ? 'Hide' : 'Show'} Thumbnails
                </span>
              </button>
            </div>

            {/* Stats */}
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <div className="flex items-center gap-2">
                <Clock size={12} />
                <span>Total Duration: {formatDuration(playlistData.totalDuration)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Play size={12} />
                <span>Videos: {playlistData.videos.length}</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
              <p>💡 Click on video nodes to preview</p>
              <p>🎬 Click playlist thumbnail to open on YouTube</p>
            </div>
          </div>
        </div>
      </div>
      
      <Canvas filter={filter} />
    </div>
  );
};

export default Roadmap;