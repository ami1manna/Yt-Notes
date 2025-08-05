import React, { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "@/context/auth/AuthContextBase";
import { inviteThunks, inviteSelectors } from "@/store/invite";

const GroupInvitesBell = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const invites = useSelector(inviteSelectors.selectInviteList);
  const isLoading = useSelector(inviteSelectors.isInviteFetching);
  const error = useSelector(inviteSelectors.getInviteFetchError);
  const isResponding = useSelector(inviteSelectors.isInviteResponding);

  const [invitesOpen, setInvitesOpen] = useState(false);
  const [inviteActionLoading, setInviteActionLoading] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) dispatch(inviteThunks.fetchMyInvites());
  }, [user, dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setInvitesOpen(false);
      }
    };
    if (invitesOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [invitesOpen]);

  const handleInviteResponse = async (inviteId, action) => {
    const key = `${inviteId}:${action}`;
    setInviteActionLoading(key);
    await dispatch(inviteThunks.respondToInvite({ inviteId, action }));
    setInviteActionLoading(null);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-label="Group Invites"
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300 focus:outline-none"
        onClick={() => setInvitesOpen(prev => !prev)}
      >
        <Bell className="w-6 h-6 text-gray-700 dark:text-white" />
        {invites.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {invites.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {invitesOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4 z-50 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="font-semibold mb-2">Group Invites</h3>

            {isLoading ? (
              <div className="text-gray-500">Loading...</div>
            ) : invites.length === 0 ? (
              <div className="text-gray-400">No invites.</div>
            ) : (
              <ul className="space-y-3">
                {invites.map((invite) => {
                  const groupName = invite.group?.name || "Group";
                  const groupDescription = invite.group?.description || "";
                  const acceptKey = `${invite._id}:accept`;
                  const declineKey = `${invite._id}:decline`;

                  return (
                    <li key={invite._id} className="flex flex-col gap-1 border-b pb-2 last:border-b-0">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{groupName}</span>
                        <span className="text-xs text-gray-500 capitalize">Pending</span>
                      </div>
                      {groupDescription && (
                        <div className="text-xs text-gray-400">{groupDescription}</div>
                      )}
                      <div className="flex gap-2 mt-1">
                        <button
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs disabled:opacity-60"
                          disabled={inviteActionLoading === acceptKey || isResponding}
                          onClick={() => handleInviteResponse(invite._id, "accept")}
                        >
                          {inviteActionLoading === acceptKey ? "Accepting..." : "Accept"}
                        </button>
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs disabled:opacity-60"
                          disabled={inviteActionLoading === declineKey || isResponding}
                          onClick={() => handleInviteResponse(invite._id, "decline")}
                        >
                          {inviteActionLoading === declineKey ? "Declining..." : "Decline"}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GroupInvitesBell;
