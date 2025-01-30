import React from 'react'
import { motion } from 'framer-motion'
import CustomInput from '../ui/CustomInput'
import Card from '../ui/Card'
import AddIcon from '../../assets/png/plus.png'

const AddPlaylist = () => {

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:p-8 lg:bg-white lg:dark:bg-gray-800 lg:shadow-2xl lg:rounded-xl w-full"
        >
            <CustomInput 
                inputType="search"
                iconPath={AddIcon} 
                placeholder="Enter Playlist URL"
                textButton="Add"
                
            />

            

<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
    {/* <div> */}
        {/* <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg" alt=""/> */}
    {/* </div> */}
   <Card/>
   <Card/>
</div>

        </motion.div>

    )
}

export default AddPlaylist
