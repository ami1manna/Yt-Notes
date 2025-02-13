import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CheckBox = ({ checked, onChange }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [prevChecked, setPrevChecked] = useState(checked);

  const handleChange = () => {
    onChange(!checked); // Calls the external onChange function

    // Trigger confetti effect only when checkbox is checked
    if (!checked) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500); // Hide confetti after 1.5s
    }

    setPrevChecked(checked);
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
            onChange={handleChange}
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

      {/* Confetti Party Effect BELOW Checkbox */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.5 }}
            transition={{ duration: 0.5 }}
            className="absolute top-12 w-full flex justify-center"
          >
            <div className="relative w-24 h-10">
              {/* Random confetti circles */}
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
