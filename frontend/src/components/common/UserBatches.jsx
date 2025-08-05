// components/common/UserBatches.jsx
import React from "react";

/**
 * Renders batches of users grouped by a key.
 * 
 * Props:
 *  - users: Array of user objects (must have socketId and display fields)
 *  - groupBy: (user) => string  // grouping function, returns group key
 *  - groupLabel: (key) => string // human label for the group (e.g., format playlist id)
 *  - userRenderer: (user) => ReactNode // optional override to render each user
 *  - showCounts: boolean // show counts per batch
 */
const UserBatches = ({
  users = [],
  groupBy,
  groupLabel = (k) => k,
  userRenderer,
  showCounts = true,
}) => {
  const buckets = users.reduce((acc, user) => {
    const key = groupBy(user) ?? "__none";
    acc[key] = acc[key] || [];
    acc[key].push(user);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(buckets).map(([key, bucketUsers]) => (
        <div
          key={key}
          className="border rounded p-3 flex flex-col bg-white dark:bg-gray-800"
        >
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold text-sm">
              {groupLabel(key)}
            </div>
            {showCounts && (
              <div className="text-xs text-gray-500">
                {bucketUsers.length} user
                {bucketUsers.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {bucketUsers.map((u) => (
              <div
                key={u.socketId}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded flex items-center text-xs"
              >
                {userRenderer ? userRenderer(u) : u.name || u.username || "Unknown"}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserBatches;
