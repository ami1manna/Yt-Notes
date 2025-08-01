import React from "react";
import { useSelector } from "react-redux";
import Card from "../common/Card";
import CreateGroup from "./CreateGroup";
import { BookOpen, Lock, Users, Music, FileText, Crown, User, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AsyncStateHandler from "@/components/common/AsyncStateHandler";
import { groupsSelectors } from "@/store/group";

const GroupList = () => {
  const groupList = useSelector(groupsSelectors.selectGroupList);
  const isLoading = useSelector(groupsSelectors.isGroupFetching);
  const error = useSelector(groupsSelectors.getGroupFetchError);
  const navigate = useNavigate();

  const handleGroupSelect = (group) => {
    navigate("/groups/" + group._id);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Crown className="w-3 h-3" />;
      case "member":
        return <User className="w-3 h-3" />;
      default:
        return <Eye className="w-3 h-3" />;
    }
  };

  const getRoleStyles = (role) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200 dark:from-yellow-900/30 dark:to-amber-900/30 dark:text-yellow-400 dark:border-yellow-700";
      case "member":
        return "bg-gradient-to-r from-blue-100 to-sky-100 text-blue-800 border border-blue-200 dark:from-blue-900/30 dark:to-sky-900/30 dark:text-blue-400 dark:border-blue-700";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 border border-gray-300 dark:from-gray-800 dark:to-gray-700 dark:text-gray-400 dark:border-gray-600";
    }
  };

  return (
    <Card variant="elevated" className="overflow-hidden">
      <CreateGroup />
      <Card.Content className="p-6">
        <AsyncStateHandler isLoading={isLoading} error={error}>
          {groupList.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No groups yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                Create your first group to start collaborating and sharing study materials with others.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {groupList.map((group) => (
                <button
                  key={group._id}
                  onClick={() => handleGroupSelect(group)}
                  className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
                  type="button"
                >
                  {/* Background Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-100/0 group-hover:from-blue-50/50 group-hover:to-blue-100/30 dark:group-hover:from-blue-900/10 dark:group-hover:to-blue-800/20 transition-all duration-300 rounded-xl" />
                  
                  {/* Content */}
                  <div className="relative">
                    {/* Header */}
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        {/* Active indicator */}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                            {group.name}
                          </h3>
                          {group.privacy === "private" && (
                            <div className="flex-shrink-0 w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                              <Lock className="w-3 h-3 text-gray-500" />
                            </div>
                          )}
                        </div>
                        
                        {/* Role Badge */}
                        <div className="flex items-center space-x-1">
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${getRoleStyles(group.role)}`}>
                            {getRoleIcon(group.role)}
                            <span className="capitalize">{group.role}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                      {group.description || "No description available"}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                        <div className="flex items-center justify-center mb-1">
                          <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          {group.members.length}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Members
                        </div>
                      </div>
                      
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
                        <div className="flex items-center justify-center mb-1">
                          <Music className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          {group.sharedPlaylists.length}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Playlists
                        </div>
                      </div>
                      
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg group-hover:bg-amber-50 dark:group-hover:bg-amber-900/20 transition-colors">
                        <div className="flex items-center justify-center mb-1">
                          <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          {0}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Notes
                        </div>
                      </div>
                    </div>

                    {/* Hover indicator */}
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </AsyncStateHandler>
      </Card.Content>
    </Card>
  );
};

export default GroupList;