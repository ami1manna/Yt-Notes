// components/groupdetails/GroupDetailsBody.jsx
import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import Card from "../common/Card";
import clsx from "clsx";

const tabs = [
  { 
    label: "Playlists", 
    route: "playlists",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    )
  },
  { 
    label: "Members", 
    route: "members",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    )
  },
  { 
    label: "Notes", 
    route: "notes",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    )
  },
];

const GroupDetailsBody = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const location = useLocation();

  const currentTab = location.pathname.split("/").pop();

  const handleNavigate = (subRoute) => {
    navigate(`/groups/${groupId}/${subRoute}`);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Enhanced Tab Navigation */}
      <Card className="flex-shrink-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-200/20 dark:shadow-gray-900/40">
        <div className="px-6 py-4">
          {/* Tab Pills Container */}
          <div className="relative flex gap-1 p-1 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm">
            {/* Active Tab Background Indicator */}
            <div 
              className="absolute top-1 bottom-1 bg-white dark:bg-gray-700 rounded-lg shadow-sm transition-all duration-300 ease-out"
              style={{
                left: `${tabs.findIndex(tab => tab.route === currentTab) * (100 / tabs.length)}%`,
                width: `${100 / tabs.length}%`,
                transform: 'translateX(4px) scaleX(calc(1 - 8px / 100%))'
              }}
            />
            
            {/* Tab Buttons */}
            {tabs.map((tab, index) => (
              <button
                key={tab.route}
                onClick={() => handleNavigate(tab.route)}
                className={clsx(
                  "relative flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ease-out flex-1 min-w-0",
                  "hover:scale-105 active:scale-95",
                  currentTab === tab.route
                    ? "text-blue-600 dark:text-blue-400 z-10"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                )}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                {/* Icon */}
                <span className={clsx(
                  "transition-all duration-300",
                  currentTab === tab.route 
                    ? "text-blue-600 dark:text-blue-400 scale-110" 
                    : "text-gray-500 dark:text-gray-500"
                )}>
                  {tab.icon}
                </span>
                
                {/* Label */}
                <span className="font-semibold tracking-wide">
                  {tab.label}
                </span>
                
                {/* Active Tab Glow Effect */}
                {currentTab === tab.route && (
                  <div className="absolute inset-0 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 animate-pulse" />
                )}
              </button>
            ))}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${((tabs.findIndex(tab => tab.route === currentTab) + 1) / tabs.length) * 100}%`
              }}
            />
          </div>
        </div>
      </Card>

      {/* Content Area with Enhanced Styling */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="p-6">
            {/* Content Fade-in Animation */}
            <div 
              key={currentTab}
              className="animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsBody;