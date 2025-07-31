 
 const Error = ({ children }) => {
  return (
    <div className="flex flex-1 justify-center items-start  text-red-600 text-lg font-bold   shadow-sm">
      ❌ {children || "Something went wrong."}
    </div>
  );
};

export default Error;