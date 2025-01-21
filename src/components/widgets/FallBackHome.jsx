import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const FallBackHome = () => {
  return (
    <div className='w-full h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 flex justify-center items-center'>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center lg:p-8 lg:bg-white lg:dark:bg-gray-800 lg:shadow-2xl lg:rounded-xl "
      >
        <motion.img
          src="./empty.gif"
          alt="Empty State"
          className="w-64 h-64 object-cover mx-auto rounded-full shadow-lg mb-6"
          whileHover={{ scale: 1.05 }}
        />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Nothing to see here
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Looks like this space is waiting to be filled
        </p>
        <NavLink to='/addPlaylist' className="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
          Add Playlist
        </NavLink>
      </motion.div>
    </div>
  );
};

export default FallBackHome;