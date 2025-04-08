const TranscriptTile = ({ timestamp, text }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
          {timestamp.start} - {timestamp.end}
        </span>
      </div>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{text}</p>
    </div>
  );
};

export default TranscriptTile;