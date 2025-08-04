const SidebarTabs = ({ activeTab , setActiveTab }) => {
  return (
    <div className="flex-shrink-0 p-4 border-b border-gray-100 dark:border-gray-700">
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("sections")}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === "sections"
              ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          By Sections
        </button>
        <button
          onClick={() => setActiveTab("order")}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === "order"
              ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          Sequential
        </button>
      </div>
    </div>
  );
};

export default SidebarTabs;
