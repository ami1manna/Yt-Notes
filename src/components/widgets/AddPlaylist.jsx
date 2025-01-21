import React from 'react'
import { motion } from 'framer-motion'
import Search from '../ui/Search'
const AddPlaylist = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:p-8 lg:bg-white lg:dark:bg-gray-800 lg:shadow-2xl lg:rounded-xl "
        >
            <Search />
        </motion.div>

    )
}

export default AddPlaylist
