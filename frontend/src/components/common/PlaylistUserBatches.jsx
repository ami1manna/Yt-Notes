// components/groupdetails/PlaylistUserBatches.jsx
import React, { useMemo } from "react";
import UserBatches from "@/components/common/UserBatches";

const PlaylistUserBatches = ({ users }) => {
  // group by currentPlaylistId
  const normalizedUsers = useMemo(() => users || [], [users]);

  return (
    <UserBatches
      users={normalizedUsers}
      groupBy={(u) => u.currentPlaylistId || "No Playlist"}
      groupLabel={(key) =>
        key === "No Playlist" ? "Not in any playlist" : `Playlist ${key}`
      }
      userRenderer={(u) => (
        <div className="flex items-center gap-1">
          <div className="font-medium">{u.name || u.username}</div>
        </div>
      )}
    />
  );
};

export default PlaylistUserBatches;
