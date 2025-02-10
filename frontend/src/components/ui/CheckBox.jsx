import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CheckBox = ({ checked, onChange }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleChange = () => {
    onChange(!checked); // Call external onChange function

    if (!checked) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500); // Hide confetti after 1.5s
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <label
        className="cursor-pointer p-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={handleChange}
      >
        {/* Hidden Checkbox Input */}
        <input
          type="checkbox"
          className="hidden"
          checked={checked}
          onChange={handleChange}
        />

        {/* Styled Checkbox */}
        <div
          className={`w-6 h-6 flex items-center justify-center rounded-lg border-2 transition-all duration-300 ease-in-out transform 
            ${checked ? "bg-green-500 border-green-500 shadow-md scale-110" : "bg-transparent border-gray-400 dark:border-gray-600"}`}
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
              className="w-5 h-5 text-white"
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
      </label>

      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.5 }}
            transition={{ duration: 0.5 }}
            className="absolute top-10 w-full flex justify-center"
          >
            <div className="relative w-24 h-10">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    backgroundColor: ["#ff4757", "#1e90ff", "#2ed573", "#ffa502"][
                      Math.floor(Math.random() * 4)
                    ],
                  }}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{
                    opacity: 1,
                    y: Math.random() * 20 + 10,
                    x: (Math.random() - 0.5) * 20,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                    delay: Math.random() * 0.5,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckBox;
