import React, { useState } from 'react';
import NetworkImage from '../../assets/svg/NetworkImg.svg';

const NetworkImg = ({ src, alt, skeletonHeight = '200px', skeletonWidth = '100%' }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative inline-block">
      {isLoading && (
        <div
          className="animate-pulse bg-gray-300 rounded"
          style={{
            height: skeletonHeight,
            width: skeletonWidth,
          }}
        ></div>
      )}
      <img
        src={src || NetworkImage}
        alt={alt || 'Image'}
        className={`w-full h-auto ${isLoading ? 'hidden' : ''}`}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default NetworkImg;
