import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeDots from '../../assets/svg/ThreeDots.svg';
import NetworkImg from './NetworkImg';

const VideoCard = ({title,thumbnailUrl}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <motion.div
      className="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-md dark:bg-gray-800 dark:border-gray-700 overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        type: 'spring',
        stiffness: 120,
      }}
      whileHover={{
        scale: 1.03,
        boxShadow:
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Dropdown Menu */}
      <div className="relative">
        <div className="flex justify-end px-4 pt-4">
          <motion.button
            onClick={toggleDropdown}
            whileTap={{ scale: 0.9 }}
            className="relative inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
          >
            <span className="sr-only">Open dropdown</span>
            <img src={ThreeDots} className="w-5" alt="Menu" />
          </motion.button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-4 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 z-50"
              >
                <ul className="py-2">
                  {[
                    { label: 'Edit', action: () => {}, className: '' },
                    { label: 'Export Data', action: () => {}, className: '' },
                    { label: 'Delete', action: () => {}, className: 'text-red-600 dark:text-red-400' },
                  ].map((item, index) => (
                    <li key={index}>
                      <button
                        onClick={item.action}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${item.className}`}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col items-center pb-8 px-4">
        {/* Image with Hover Effect */}
        <motion.div
          className="mb-4 relative"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <NetworkImg
            src={thumbnailUrl}
            alt="img"
            className=""
          />
         
        </motion.div>

        {/* User Details */}
        {/* <h5 className="mb-1 text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h5>
          */}

   
      </div>
    </motion.div>
  );
};

export default VideoCard;
