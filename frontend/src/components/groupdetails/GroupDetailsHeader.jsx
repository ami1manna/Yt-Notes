// components/groupdetails/GroupDetailsHeader.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Calendar,
  Clock,
  FileText,
  Music,
  UserPlus,
  Users,
} from "lucide-react";
import Card from "../common/Card";
import IconButton from "@/components/common/IconButton";
import {
  groupDetailSelectors,
} from "@/store/groupDetails";
import SearchMemberModal from "./SearchMemberModal";

const GroupDetailsHeader = () => {
  // local state
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);

  // global state
  const group = useSelector(groupDetailSelectors.getGroupDetails);

  // Return early if group is not loaded yet
  if (!group) {
    return null;
  }

  const memberCount = group.members?.length || 0;
  const playlistCount = group.sharedPlaylists?.length || 0;

  return (
    <>
      <SearchMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
      />

      <Card className="w-full overflow-hidden">
        <Card.Content className="p-0">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-6 lg:space-y-0 lg:space-x-6">
              <div className="flex items-start space-x-4 flex-1 min-w-0">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                    <Users className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate">
                      {group.name}
                    </h1>
                    <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                      {group.privacy === "private" ? "Private" : "Public"}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-base">
                    {group.description || "No description provided."}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>
                        Created by{" "}
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {group.createdBy?.username || group.createdBy || "Unknown"}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(group.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        Last updated{" "}
                        {new Date(group.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 w-full sm:w-auto">
                <IconButton
                  type="button"
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  icon={UserPlus}
                  onClick={() => setInviteModalOpen(true)}
                >
                  <span>Invite Members</span>
                </IconButton>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-white dark:bg-gray-900">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="group bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {memberCount}
                  </div>
                </div>
                <div className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Members
                </div>

              </div>

              <div className="group bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {playlistCount}
                  </div>
                </div>
                <div className="text-sm font-medium text-green-800 dark:text-green-300">
                  Shared Playlists
                </div>

              </div>

              <div className="group bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    0
                  </div>
                </div>
                <div className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  Shared Notes
                </div>

              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

    </>
  );
};

export default GroupDetailsHeader;
