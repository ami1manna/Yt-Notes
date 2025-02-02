// import React from 'react';
// import { PlaylistProvider, usePlaylist } from '../context/PlaylistContext';

// function YouTubePlaylistFetcher() {
//   const { 
//     videos, 
//     loading, 
//     error, 
//     playlistId, 
//     nextPageToken,
//     fetchPlaylistVideos,
//     setPlaylistUrl,
//     loadMoreVideos
//   } = usePlaylist();

//   return (
//     <div className="container mx-auto p-4 max-w-6xl">
//       <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
//         YouTube Playlist Explorer
//       </h1>
      
//       {/* Playlist ID Input */}
//       <div className="flex mb-6 shadow-lg">
//         <input 
//           type="text"
//           value={playlistId}
//           onChange={(e) => setPlaylistUrl(e.target.value)}
//           placeholder="Enter YouTube Playlist ID"
//           className="flex-grow p-3 border-2 border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//         />
//         <button 
//           onClick={() => fetchPlaylistVideos()}
//           className="bg-red-600 text-white px-6 py-3 rounded-r-lg hover:bg-red-700 transition duration-300 ease-in-out"
//         >
//           Fetch Playlist
//         </button>
//       </div>

//       {/* Loading Indicator */}
//       {loading && (
//         <div className="text-center my-4">
//           <div className="animate-spin inline-block w-8 h-8 border-4 border-red-500 rounded-full"></div>
//           <p className="text-gray-600 mt-2">Loading playlist...</p>
//         </div>
//       )}

//       {/* Error Display */}
//       {error && (
//         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
//           <p className="font-bold">Error:</p>
//           <p>{error}</p>
//         </div>
//       )}

//       {/* Videos Grid */}
//       {videos.length > 0 && (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {videos.map((video, index) => (
//               <div 
//                 key={`${video.videoId}-${index}`} 
//                 className="bg-white rounded-lg overflow-hidden shadow-md transform transition hover:scale-105"
//               >
//                 {/* Thumbnail */}
//                 <img 
//                   src={video.thumbnailUrl} 
//                   alt={video.title} 
//                    className="w-full h-48 object-cover"
//                 />
                
//                 {/* Video Details */}
//                 <div className="p-4">
//                   <h2 className="font-bold text-lg mb-2 line-clamp-2">
//                     {video.title}
//                   </h2>
//                   <div className="flex justify-between text-sm text-gray-600 mb-2">
//                     <span>{video.channelTitle}</span>
//                     <span>{video.publishedAt}</span>
//                   </div>
                  
//                   {/* Watch Button */}
//                   <a 
//                     href={`https://www.youtube.com/watch?v=${video.videoId}`} 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="mt-2 block bg-red-500 text-white text-center py-2 rounded hover:bg-red-600 transition duration-300"
//                   >
//                     Watch Video
//                   </a>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Load More Button */}
//           {nextPageToken && (
//             <div className="text-center mt-6">
//               <button 
//                 onClick={loadMoreVideos}
//                 className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition duration-300"
//               >
//                 Load More Videos
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// export default YouTubePlaylistFetcher;