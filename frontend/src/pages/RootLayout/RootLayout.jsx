import React from 'react'
import { Outlet } from 'react-router-dom'
import TopNav from '@/components/layout/TopNav'

 

const RootLayout = () => {
    return (
          
        <div className='w-screen h-screen flex flex-col lg:bg-white lg:dark:bg-gray-800'>
            <TopNav />
            <div className='flex flex-1 w-full px-2'>
            <Outlet  />
            </div>
        </div>
        
    )
}

export default RootLayout