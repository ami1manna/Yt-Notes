import React, { useContext, useEffect, useState } from "react";
import { Bell } from "lucide-react";
// import { useGroupContext } from '../../context/GroupContext';
import { useAuth } from "@/context/auth/AuthContextBase";

const GroupInvitesBell = () => {
  const { user } = useAuth();
  // const { fetchMyInvites, respondToInvite } = useGroupContext();
  const [invites, setInvites] = useState([]);
  const [invitesOpen, setInvitesOpen] = useState(false);
  const [invitesLoading, setInvitesLoading] = useState(false);
  const [inviteActionLoading, setInviteActionLoading] = useState(null);
  const [inviteError, setInviteError] = useState(null);

  // useEffect(() => {
  //   if (user) {
  //     setInvitesLoading(true);
  //     fetchMyInvites().then(({ invites }) => {
  //       setInvites(invites || []);
  //       setInvitesLoading(false);
  //     });
  //   } else {
  //     setInvites([]);
  //   }
  // }, [user, fetchMyInvites]);

  // const handleInviteResponse = async (inviteId, action) => {
  //   setInviteActionLoading(inviteId + action);
  //   setInviteError(null);
  //   const { success, error } = await respondToInvite(inviteId, action);
  //   setInviteActionLoading(null);
  //   if (success) {
  //     setInvites((prev) => prev.filter((i) => i._id !== inviteId));
  //   } else {
  //     setInviteError(error || 'Failed to respond to invite.');
  //   }
  // };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300 focus:outline-none"
        onClick={() => setInvitesOpen((v) => !v)}
      >
        <Bell className="w-6 h-6 text-gray-700 dark:text-white" />
        {invites.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {invites.length}
          </span>
        )}
      </button>
      {invitesOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4 z-50 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-2">Group Invites</h3>
          {invitesLoading ? (
            <div className="text-gray-500">Loading...</div>
          ) : invites.length === 0 ? (
            <div className="text-gray-400">No invites.</div>
          ) : (
            <ul className="space-y-3">
              {invites.map((invite) => (
                <li key={invite._id} className="flex flex-col gap-1 border-b pb-2 last:border-b-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{invite.groupId?.name || 'Group'}</span>
                    <span className="text-xs text-gray-500">{invite.status}</span>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs disabled:opacity-60"
                      disabled={inviteActionLoading === invite._id + 'accept'}
                      onClick={() => handleInviteResponse(invite._id, 'accept')}
                    >
                      {inviteActionLoading === invite._id + 'accept' ? 'Accepting...' : 'Accept'}
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs disabled:opacity-60"
                      disabled={inviteActionLoading === invite._id + 'decline'}
                      onClick={() => handleInviteResponse(invite._id, 'decline')}
                    >
                      {inviteActionLoading === invite._id + 'decline' ? 'Declining...' : 'Decline'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {inviteError && <div className="text-red-500 mt-2 text-sm">{inviteError}</div>}
        </div>
      )}
    </div>
  );
};

export default GroupInvitesBell; 