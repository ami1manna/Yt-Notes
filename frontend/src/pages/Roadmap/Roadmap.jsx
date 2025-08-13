// Roadmap.jsx
import React from 'react';
import Canvas from '@/components/roadmap/Canvas';

const Roadmap = () => {
  return (
    <div className="relative w-full h-screen bg-gray-50 dark:bg-gray-900">
      <Canvas filter={{ showImages: true }} />
    </div>
  );
};

export default Roadmap;
