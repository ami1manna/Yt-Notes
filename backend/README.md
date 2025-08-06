{{ ... }}

## 📚 API Endpoints

### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user profile (protected)

### Playlists
- `POST /playlists/add` - Create a new playlist (protected)
- `POST /playlists/getPlaylist` - Get user's playlists (protected)
- `DELETE /playlists/delete` - Delete a playlist (protected)
- `PUT /playlists/setVideoId` - Set video ID for a playlist (protected)
- `DELETE /playlists/deleteVideo` - Remove video from playlist (protected)
- `POST /playlists/displaySection` - Display playlist section (protected)
- `POST /playlists/summaries` - Get user's playlist summaries (protected)
- `POST /playlists/fetchById` - Fetch playlist by ID (protected)

### Notes
- `PUT /notes/saveNotes` - Add/update notes for a video (protected)
- `POST /notes/getNotes` - Get notes for a video (protected)
- `DELETE /notes/deleteNotes` - Delete notes (protected)

### Videos
- `PUT /video/toggle` - Toggle video status (protected)

### Transcripts
- `POST /transcript/addTranscript` - Add transcript for a video (protected)
- `GET /transcript/getTranscript` - Get video transcript (protected)
- `GET /transcript/educational-notes` - Get educational notes from transcript (protected)
- `GET /transcript/test-ai` - Test AI functionality
- `GET /transcript/check-transcript` - Check if transcript exists for a video

### Groups & Collaboration
- `POST /groups` - Create a new group (protected)
- `GET /groups` - Get user's groups (protected)
- `GET /groups/:id` - Get group by ID (protected)
- `PUT /groups/:id` - Update group (protected)
- `DELETE /groups/:id` - Delete group (protected)
- `POST /groups/:groupId/invite` - Invite user to group (protected)
- `POST /groups/invites/:inviteId/respond` - Respond to group invite (protected)
- `GET /groups/invites/mine` - Get user's group invites (protected)
- `POST /groups/:groupId/share-playlist` - Share playlist with group (protected)
- `GET /groups/:groupId/shared-playlist/:playlistId` - Get shared playlist details (protected)

### Collaboration Notes
- `GET /collab` - Get collaborative note for video (protected)
- `POST /collab/saveNote` - Save or update collaborative note (protected)
- `DELETE /collab/:noteId` - Delete collaborative note (protected)

### Users
- `GET /user/search` - Search users by username

### Sections
- `POST /section/arrange` - Arrange videos in sections (protected)

{{ ... }}
