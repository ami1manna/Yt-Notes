// components/common/ActiveUserBadges.jsx
import React from "react";

/**
 * ActiveUserBadges
 * Props:
 *  - users: Array<{ socketId, username?, name? }>
 *  - maxVisible: number (optional, default = 5)
 */
const ActiveUserBadges = ({ users = []  }) => {
 
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">All Connected Users</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.socketId} className="bg-gray-100 p-2 rounded shadow-sm">
            <p className="font-medium">{user.username} ({user.email})</p>
            <p className="text-sm text-gray-600">
              Playlist: {user.selectedPlaylistId || "None"}<br />
              Video: {user.selectedVideoId || "None"}<br />
              Note: {user.currentNoteId || "None"}<br />
              Cursor: Line {user.cursorPosition?.line ?? "-"}, Ch {user.cursorPosition?.ch ?? "-"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveUserBadges;
