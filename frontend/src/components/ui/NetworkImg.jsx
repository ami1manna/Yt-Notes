import React, { useState } from 'react';
import NetworkImage from '../../assets/svg/NetworkImg.svg';

const NetworkImg = ({ src, alt }) => {


  return (

      <img
        src={src || NetworkImage}
        alt={alt || 'Image'}
        className={`w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg transform transition duration-300 ease-in-out hover:scale-105`}
      
      />
 
  );
};

export default NetworkImg;
