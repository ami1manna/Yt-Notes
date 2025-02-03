import React from 'react';

const VideoCard = ({ title, thumbnailUrl }) => {
  return (
    <div className='w-full p-4 border rounded-lg shadow-md hover:shadow-xl transition duration-200'>
      <img className='w-full h-auto rounded-md' src={thumbnailUrl} alt={title} />
      <h4 className='mt-2 text-lg font-semibold'>{title}</h4>
    </div>
  );
};

export default VideoCard;

