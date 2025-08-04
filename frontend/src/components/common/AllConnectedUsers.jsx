import { useSelector } from "react-redux";
import { selectAllUsers } from "@/store/presence/presenceSelectors";
import { useState } from "react";

const AllConnectedUsers = ({ selector = selectAllUsers, tooltip = true }) => {
  const users = useSelector(selector);
  // console.log(users);
  const [hoveredUser, setHoveredUser] = useState(null);

  // Generate consistent random color for each user based on their email
  const generateUserColor = (email) => {
    const colors = [
      'bg-red-500 dark:bg-red-600', 'bg-blue-500 dark:bg-blue-600', 'bg-green-500 dark:bg-green-600', 'bg-yellow-500 dark:bg-yellow-600', 
      'bg-purple-500 dark:bg-purple-600', 'bg-pink-500 dark:bg-pink-600', 'bg-indigo-500 dark:bg-indigo-600', 'bg-teal-500 dark:bg-teal-600',
      'bg-orange-500 dark:bg-orange-600', 'bg-cyan-500 dark:bg-cyan-600', 'bg-lime-500 dark:bg-lime-600', 'bg-emerald-500 dark:bg-emerald-600',
      'bg-violet-500 dark:bg-violet-600', 'bg-fuchsia-500 dark:bg-fuchsia-600', 'bg-rose-500 dark:bg-rose-600', 'bg-sky-500 dark:bg-sky-600'
    ];
    
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Extract initials from username
  const getInitials = (username) => {
    const names = username.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  };

  if (!users || users.length === 0) {
    return null;
  }

  return (
    <div className="p-1">
      <div className="flex -space-x-2">
        {users.map((user, index) => (
          <div
            key={user.socketId}
            className="relative"
            onMouseEnter={() => tooltip && setHoveredUser(user.socketId)}
            onMouseLeave={() => tooltip && setHoveredUser(null)}
            style={{ zIndex: users.length - index }}
          >
            {/* User Badge */}
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs
                cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg 
                border-2 border-white dark:border-gray-800 ring-1 ring-gray-200 dark:ring-gray-700
                ${generateUserColor(user.email)}
              `}
              title={user.username}
            >
              {getInitials(user.username)}
            </div>

            {/* Hover Tooltip */}
            {tooltip && hoveredUser === user.socketId && (
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in duration-200">
                <div className="bg-gray-900 dark:bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg text-xs whitespace-nowrap border border-gray-700 dark:border-gray-600">
                  {/* Arrow */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2">
                    <div className="border-4 border-transparent border-b-gray-900 dark:border-b-gray-800"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-white">{user.username}</p>
                    <p className="text-gray-300 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllConnectedUsers;

// Usage Examples:

// 1. Default - Show all users with tooltip
// <AllConnectedUsers />

// 2. Show users without tooltip
// <AllConnectedUsers tooltip={false} />

// 3. Show users for specific playlist with tooltip
// <AllConnectedUsers selector={(state) => selectUsersByPlaylist(state, playlistId)} />

// 4. Show users for specific playlist without tooltip
// <AllConnectedUsers selector={(state) => selectUsersByPlaylist(state, playlistId)} tooltip={false} />

// 5. In TopBar component:
/*
import { useParams } from "react-router-dom";
import { selectUsersByPlaylist } from "@/store/presence/presenceSelectors";

const TopBar = () => {
  const { playlistId } = useParams();
  
  return (
    <div className="w-full flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900">
      <div className="video-title">Current Video</div>
      <AllConnectedUsers 
        selector={(state) => playlistId ? selectUsersByPlaylist(state, playlistId) : selectAllUsers(state)}
        tooltip={true}
      />
    </div>
  );
};
*/