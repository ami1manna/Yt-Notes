import React from "react";

const CheckBox = ({ children, checked, onChange }) => {
  return (
    <label
      className="flex cursor-pointer items-center gap-4 rounded-md p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      onChange={onChange} // Handle click event
    >
      <div className="flex items-center">
        <input
          type="checkbox"
          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900"
          checked={checked} // Bind checked state
          readOnly // Prevent default input behavior (controlled component)
        />
      </div>

      <div>
        <strong className="text-sm font-medium text-gray-900 dark:text-white">
          {children}
        </strong>
      </div>
    </label>
  );
};

export default CheckBox;
