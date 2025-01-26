import React from "react";

const items = [
  { id: 1, name: "John Clapton" },
  { id: 2, name: "Elena Watson" },
  { id: 3, name: "Michael Scott" },
  { id: 4, name: "Pam Beesly" },
];

const YtListView = () => {
  return (
    <div className="space-y-4 p-4">
      {items.map((item) => (
        <label
          key={item.id}
          htmlFor={`option-${item.id}`}
          className="flex cursor-pointer items-center gap-4 rounded-md p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`option-${item.id}`}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900"
            />
          </div>

          <div>
            <strong className="text-sm font-medium text-gray-900 dark:text-white">
              {item.name}
            </strong>
          </div>
        </label>
      ))}
    </div>
  );
};

export default YtListView;
