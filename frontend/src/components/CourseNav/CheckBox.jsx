import React from "react";
import { motion } from "framer-motion";

const CheckBox = ({ checked, onChange, size = "md" }) => {
  const sizeClasses = {
    sm: { box: "w-4 h-4", icon: "w-4 h-4" },
    md: { box: "w-5 h-5", icon: "w-5 h-5" },
    lg: { box: "w-6 h-6", icon: "w-6 h-6" }
  };
  
  const handleChange = () => {
    onChange(!checked);
  };

  return (
    <div className="relative flex items-center justify-center">
      <label
        className="cursor-pointer p-2 transition-all duration-300 ease-in-out rounded-lg"
        onClick={handleChange}
      >
        <div className="relative">
          <input
            type="checkbox"
            className="absolute opacity-0 w-0 h-0"
            defaultChecked={checked}
          />

          <div
            className={`${sizeClasses[size].box} flex items-center justify-center rounded-md border-2 transition-all duration-300 ease-in-out transform
              ${checked 
                ? "bg-green-500 border-green-500 shadow-md scale-105" 
                : "bg-transparent border-gray-400 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-400"}`}
          >
            {checked && (
              <motion.svg
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className={`${sizeClasses[size].icon} text-white`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
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