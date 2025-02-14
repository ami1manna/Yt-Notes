import React from 'react'

const TextButton = ({type='button',children,className=''}) => {
  return (
    <button
    type={type}
    className={`w-full mt-4 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all ${className}`}
  >
    {children}
  </button>
  )
}

export default TextButton
