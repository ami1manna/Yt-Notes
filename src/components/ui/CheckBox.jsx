import React from "react";

const CheckBox = () => {
  return (
    <label
      htmlFor="Option1"
      className="flex cursor-pointer items-center gap-4 rounded-md p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <div className="flex items-center">
        <input
          type="checkbox"
          id="Option1"
          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900"
        />
      </div>

      <div>
        <strong className="text-sm font-medium text-gray-900 dark:text-white">
          John Clapton
        </strong>
      </div>
    </label>
  );
};

export default CheckBox;
