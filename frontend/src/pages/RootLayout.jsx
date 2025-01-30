import React from 'react'
import { Outlet } from 'react-router-dom'
import TopNav from '../components/widgets/TopNav'
 
 

const RootLayout = () => {
    return (
          
        <div className='w-screen h-screen flex flex-col'>
            <TopNav />
            <div className='flex flex-1 w-full'>
            <Outlet  />
            </div>
        </div>
        
    )
}

export default RootLayout