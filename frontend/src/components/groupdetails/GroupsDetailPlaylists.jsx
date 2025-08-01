import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { groupDetailSelectors } from '@/store/groupDetails';
import {
  PlayCircle,
  ListVideo,
  Calendar,
  User2,
  ExternalLink,
  Heart,
  HeartCrack,
  Share2,
  Grid2x2,
  List
} from 'lucide-react';
import Card from '../common/Card';

const GroupDetailsPlaylists = () => {
  const [likedPlaylists, setLikedPlaylists] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid');
  const sharedPlaylists = useSelector(groupDetailSelectors.getGroupPlaylists);

  const toggleLike = (playlistId, e) => {
    e.stopPropagation();
    setLikedPlaylists(prev => {
      const newLiked = new Set(prev);
      newLiked.has(playlistId) ? newLiked.delete(playlistId) : newLiked.add(playlistId);
      return newLiked;
    });
  };

  const sharePlaylist = (playlist, e) => {
    e.stopPropagation();
    const url = `https://www.youtube.com/playlist?list=${playlist.playlistId}`;
    if (navigator.share) {
      navigator.share({
        title: playlist.playlistTitle,
        text: `Check out this playlist: ${playlist.playlistTitle}`,
        url
      });
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  if (!sharedPlaylists?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-6">
          <PlayCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No Playlists Shared Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-sm">
          When group members share playlists, they'll appear here for everyone to discover and enjoy.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Shared Playlists
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Discover amazing content shared by group members ({sharedPlaylists.length} playlists)
          </p>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-all ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            title="Grid view"
          >
            <Grid2x2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-all ${
              viewMode === 'list'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-4xl'}`}>
        {sharedPlaylists.map((playlist, index) => (
          <Card
            key={playlist.playlistId}
            hover
            variant="elevated"
            size="default"
            className="overflow-hidden relative group/card bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-200/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Card.Header className="p-0">
              <div className="relative group/thumbnail">
                <img
                  src={playlist.playlistThumbnailUrl}
                  alt={playlist.playlistTitle}
                  className={`w-full object-cover transition-all duration-500 group-hover/thumbnail:scale-105 ${
                    viewMode === 'grid' ? 'h-48' : 'h-32'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/thumbnail:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumbnail:opacity-100 transition-all duration-300">
                  <div className="w-16 h-16 bg-white/90 dark:bg-gray-900/90 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 hover:scale-110 transition-transform">
                    <PlayCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                  <ListVideo className="w-3 h-3" />
                  {playlist.totalVideos}
                </div>
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 dark:bg-gray-900/90 text-xs px-2 py-1 rounded-full backdrop-blur-sm border border-white/20">
                  <Calendar className="w-3 h-3" />
                  {new Date(playlist.sharedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </Card.Header>

            <Card.Content className="space-y-3 px-6 py-4">
              <Card.Title size="lg" className="group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400 transition-colors line-clamp-2">
                {playlist.playlistTitle}
              </Card.Title>
              <Card.Description className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <User2 className="w-4 h-4" />
                  <span className="font-medium">{playlist.channelTitle}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                  <span>{playlist.totalVideos} videos</span>
                </div>
              </Card.Description>
            </Card.Content>

          
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GroupDetailsPlaylists;
