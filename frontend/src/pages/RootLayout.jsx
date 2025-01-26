import React from 'react'
import { Outlet } from 'react-router-dom'
import TopNav from '../components/widgets/TopNav'
 
 

const RootLayout = () => {
    return (
          
        <div className='w-screen h-screen'>
            <TopNav />
            <div className='w-full h-full'>
            <Outlet  />
            </div>
        </div>
        
    )
}

export default RootLayout