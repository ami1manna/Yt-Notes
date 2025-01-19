import React from 'react'
import { Outlet } from 'react-router-dom'
import TopNav from '../components/TopNav'
 

const RootLayout = () => {
    return (
        <>
           
            <TopNav />
            <Outlet />
        </>
    )
}

export default RootLayout