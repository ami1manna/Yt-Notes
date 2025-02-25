import React from "react";
import { motion } from "framer-motion";

const CheckBox = ({ checked , onChange }) => {
  const handleChange = () => {
    onChange(!checked);
  };

  return (
    <div className="relative flex flex-col items-center">
      <label
        className="cursor-pointer p-3 transition-all duration-300 ease-in-out rounded-lg"
        onClick={handleChange}
      >
        {/* Custom Checkbox Container */}
        <div className="relative">
          <input
            type="checkbox"
            className="absolute opacity-0 w-0 h-0"
            checked={checked}
          />

          {/* Custom styled checkbox with animation */}
          <div
            className={`w-5 h-5 flex items-center justify-center rounded-lg border-2 transition-all duration-300 ease-in-out transform
              ${checked ? "bg-green-500 border-green-500 shadow-lg scale-110" : "bg-transparent border-gray-400 dark:border-gray-600"}`}
          >
            {checked && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            )}
          </div>
        </div>
      </label>
    </div>
  );
};

export default CheckBox;
