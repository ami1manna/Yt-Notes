// TranscriptTile.jsx
import React from 'react';

const TranscriptTile = ({ timestamp, text }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:bg-gray-50 transition-all">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-gray-500">{timestamp.start} - {timestamp.end}</span>
      </div>
      <p className="text-gray-700 text-justify">{text}</p>
    </div>
  );
};

export default TranscriptTile;
