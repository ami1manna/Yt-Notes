import React from 'react'
import IconButton from './IconButton';
import { Plus, PlusCircle } from 'lucide-react';

const CustomInput = React.forwardRef(({ 
    inputType, 
    loading,
    placeholder, 
    onClick, 
    value, 
    onChange, 
    disabled 
}, ref) => {
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent form submission
        onClick();
    }

    return (
          
        <form className="w-full " onSubmit={handleSubmit}>
            <label htmlFor="input-custom" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                Search
            </label>
            <div className="flex items-center justify-between gap-3">
                <input 
                    type={inputType} 
                    id="custom-input" 
                    className="block flex-1 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    placeholder={placeholder} 
                    required 
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                />
               
                 <IconButton type="submit" className='w-28 h-full p-4 ' icon={PlusCircle} isLoading={loading}>Add</IconButton>
            </div>
        </form>
    )
});

export default CustomInput