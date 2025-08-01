import React from 'react'
import { Outlet } from 'react-router-dom'
import TopNav from '@/components/layout/TopNav'

 

const RootLayout = () => {
    return (
          
        <div className='w-screen min-h-screen    flex flex-col bg-white dark:bg-gray-800'>
            <TopNav />
            <div className='flex flex-1 w-full min-h-full px-2'>
            <Outlet  />
            </div>
        </div>
        
    )
}

export default RootLayout