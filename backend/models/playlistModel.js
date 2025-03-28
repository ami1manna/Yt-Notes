const { books } = require('googleapis/build/src/apis/books');
const mongoose = require('mongoose');



const videoSchema = new mongoose.Schema({
  title: String,
  thumbnailUrl: String,
  publishedAt: String,
  done: { type: Boolean, default: false },
  notes: { type: String, default: "" },
  duration: { type: Number, default: 0 },

});

const sectionSchema = new mongoose.Schema({
  name: String, // Section name
  sectionLength: Number, // Total number of videos in section
  completedLength: Number, // Number of completed videos
  progressPercentage: Number, // Progress in percentage
  totalDuration: Number, // Total duration of all videos in section
  videoIds: [String], // Array of video IDs
  thumbnailUrl: String // Thumbnail for section
});



const singlePlaylistSchema = new mongoose.Schema({
  displaySection:{type:Boolean , default:false},
  playlistId: { type: String, required: true },
  playlistUrl: { type: String, required: true },
  channelTitle: { type: String, required: true },
  playlistLength: { type: Number, required: true },
  selectedVideoId: { type: String, default: "" },
  playlistProgress: { type: Number, default: 0 },
  playlistThumbnailUrl: String,
  totalDuration: { type: Number, default: 0 },
  sections: { type: Map, of: sectionSchema, default: {} },  
  videos: { type: Map, of: videoSchema, default: {} }, 
  videoOrder: { type: [String], default: [] } 
});


const userPlaylistSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true },
  playlists: {type: Map, of: singlePlaylistSchema}
});

module.exports = mongoose.model('SectionModel', sectionSchema);
module.exports = mongoose.model('UserPlaylist', userPlaylistSchema);
