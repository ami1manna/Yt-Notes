import React, { useState } from "react";
import { useSelector } from "react-redux";
import Card from "../common/Card";
import CreateGroup from "./CreateGroup";
import { BookOpen, Lock } from "lucide-react";
import Loading from "../../components/common/Loading";
import Error from "../../components/common/Error";

const GroupList = () => {
  const { groupList, loading, error } = useSelector((state) => state.group);
  const [isOpen, setIsOpen] = useState(true);

  const handleGroupSelect = (group) => {
    console.log("selected group", group);
  };

  return (
    <Card>
      <CreateGroup />
      <Card.Content>
        {loading ? (
          <div className="py-12 flex justify-center">
            <Loading />
          </div>
        ) : error ? (
          <div className="py-6">
            <Error>{error}</Error>
          </div>
        ) : groupList.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">
            No groups yet. Create one to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {groupList.map((group) => (
              <button
                key={group._id}
                onClick={() => handleGroupSelect(group)}
                className="p-3 sm:p-4 border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left group dark:bg-gray-800"
                type="button"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors truncate">
                      {group.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          group.role === "admin"
                            ? "bg-yellow-100 text-yellow-800"
                            : group.role === "member"
                            ? "bg-sky-100 text-sky-800"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {group.role}
                      </span>
                      {group.privacy === "private" && (
                        <Lock className="w-3 h-3 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                  {group.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{group.members.length} members</span>
                  <span>{group.sharedPlaylists.length} playlists</span>
                  <span>{0} notes</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default GroupList;
