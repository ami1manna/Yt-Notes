import React from 'react'
import Loader from './Loader'

const TextButton = ({type='button',children,className='' , isLoading = false }) => {
  return (
    <button
    type={type}
    className={`w-full mt-4 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all ${className}`}
  >

    {isLoading ? <Loader /> : children}
     
  </button>
  )
}

export default TextButton
