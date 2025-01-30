import React from 'react'

const CustomInput = ({ inputType, iconPath, placeholder, textButton }) => {
  return (

    <form className="w-full">
      <label for="input-custom" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
      <div className="relative">

        <input type={inputType} id="custom-input" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={placeholder} required />
        <button type="submit" className="flex gap-3 text-white absolute end-2.5 top-1.5 bottom-1.5 bg-blue-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          {textButton}
          <img src={iconPath} alt="Icon" className="w-6 h-6" />
        </button>
      </div>
    </form>

  )
}

export default CustomInput
