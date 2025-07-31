import { Users, FileText, LayoutList, UserPlus } from "lucide-react";
import Card from "./card/Card";

const GroupStats = () => {
  // Dummy totals
  const totalStats = {
    totalGroups: 5,
    totalPlaylists: 23,
    totalNotes: 128,
    totalMembers: 42,
  };

  const statItems = [
    {
      label: "Groups",
      value: totalStats.totalGroups,
      bg: "bg-primary/10",
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />,
    },
    {
      label: "Playlists",
      value: totalStats.totalPlaylists,
      bg: "bg-green-100",
      icon: <LayoutList className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />,
    },
    {
      label: "Notes",
      value: totalStats.totalNotes,
      bg: "bg-yellow-100",
      icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />,
    },
    {
      label: "Members",
      value: totalStats.totalMembers,
      bg: "bg-blue-100",
      icon: <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />,
    },
  ];

  return (
    <div className="text-center mb-6 mt-6 sm:mb-8 ">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
        Welcome to YTNotes Group Collaboration
      </h1>

      <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 max-w-2xl mx-auto">
        Collaborate on YouTube playlists and share notes with your team. Create
        groups, curate content, and learn together.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-4">
        {statItems.map(({ label, value, bg, icon }) => (
          <Card key={label} hover className="text-center p-4 sm:p-6">
            <Card.Content className="flex flex-col items-center">
              <div
                className={`w-8 h-8 sm:w-12 sm:h-12 ${bg} rounded-lg flex items-center justify-center mb-2 sm:mb-3`}
              >
                {icon}
              </div>
              <Card.Title className="text-lg sm:text-2xl font-bold">
                {value}
              </Card.Title>
              <Card.Description className="text-xs sm:text-sm">
                {label}
              </Card.Description>
            </Card.Content>
          </Card>
        ))}
        
      </div>
    </div>
  );
};

export default GroupStats;
