import { AlertCircle } from "lucide-react";

 
 // Clean Error Component
const Error = ({ children }) => (
  <div className="flex flex-col items-center justify-center p-8 min-h-[200px]">
    <div className="flex items-center space-x-3 bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
      <div className="text-red-700">
        <p className="font-medium text-sm">Something went wrong</p>
        <p className="text-sm text-red-600 mt-1">{children}</p>
      </div>
    </div>
  </div>
);
export default Error;