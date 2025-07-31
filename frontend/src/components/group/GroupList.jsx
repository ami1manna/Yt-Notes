import React from "react";
import Card from "./card/Card";
import {
  BookOpen,
  Brush,
  Code,
  Rocket,
  Lightbulb,
  Wrench,
  PlusCircle,
  Lock,
} from "lucide-react";
import IconButton from "../common/IconButton";
import { useSelector } from "react-redux";


const dummyGroups = [
  {
    id: 1,
    name: "Study Buddies",
    icon: <BookOpen className="w-5 h-5" />,
    role: "Owner",
    privacy: "public",
    description: "Share and discuss video notes in real time.",
    memberCount: 12,
    playlistCount: 5,
    noteCount: 34,
  },
  {
    id: 2,
    name: "Frontend Crew",
    icon: <Brush className="w-5 h-5" />,
    role: "Admin",
    privacy: "private",
    description: "Collaborating on UI/UX and TypeScript playlist summaries.",
    memberCount: 8,
    playlistCount: 9,
    noteCount: 58,
  },
  {
    id: 3,
    name: "Backend Ninjas",
    icon: <Code className="w-5 h-5" />,
    role: "Member",
    privacy: "public",
    description: "Designing robust APIs and sharing architecture notes.",
    memberCount: 20,
    playlistCount: 11,
    noteCount: 102,
  },
  {
    id: 4,
    name: "Interview Prep",
    icon: <Rocket className="w-5 h-5" />,
    role: "Owner",
    privacy: "private",
    description: "Mock interviews, algorithm deep dives, and shared summaries.",
    memberCount: 5,
    playlistCount: 3,
    noteCount: 22,
  },
  {
    id: 5,
    name: "Design Thinkers",
    icon: <Lightbulb className="w-5 h-5" />,
    role: "Member",
    privacy: "public",
    description: "Brainstorming and annotating creative video content.",
    memberCount: 14,
    playlistCount: 6,
    noteCount: 47,
  },
  {
    id: 6,
    name: "Project Alpha",
    icon: <Wrench className="w-5 h-5" />,
    role: "Admin",
    privacy: "private",
    description: "Coordinating tasks and knowledge across the team.",
    memberCount: 9,
    playlistCount: 4,
    noteCount: 16,
  },
];

// TODO ROLE AND NOTES COUNT
const GroupList = () => {
  const handleGroupSelect = (group) => {
    console.log("selected group", group);
  };

// all group data
  const { groupList, loading, error } = useSelector((state) => state.group);
  

console.log(groupList);
  return (
    <Card>
      <Card.Header>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
          <div>
            <Card.Title className="text-base sm:text-lg">Your Groups</Card.Title>
            <Card.Description className="text-sm">
              Click on any group to start collaborating
            </Card.Description>
          </div>
          <IconButton 
            icon={PlusCircle} 
            isLoading={false}
            onClick={() => alert("Create Group (dummy)")}
          > 
            Create Group
          </IconButton>
          {/* <button
            type="button"
            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
            
          >
           
           
          </button> */}
        </div>
      </Card.Header>

      <Card.Content>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {groupList.map((group) => (
            <button
              key={group._id}
              onClick={() => handleGroupSelect(group)}
              className="p-3 sm:p-4 border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left group  dark:bg-gray-800"
              type="button"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
                  {/* TODO : make it dynamic */}
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
      </Card.Content>
    </Card>
  );
};

export default GroupList;
