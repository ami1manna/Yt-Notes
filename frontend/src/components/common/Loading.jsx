const Loading = ({ children }) => {
  return (
    <div className="flex flex-1 justify-center items-start text-gray-600 text-lg font-semibold animate-pulse">
      ⏳ {children || "Loading..."}
    </div>
  );
};

export default Loading;
