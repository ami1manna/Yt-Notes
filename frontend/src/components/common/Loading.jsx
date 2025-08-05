import { Loader2 } from 'lucide-react';
const Loading = ({ children }) => (
  <div className="flex flex-col items-center justify-center p-8 min-h-[200px]">
    <div className="flex items-center space-x-3">
      <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      <span className="text-gray-600 font-medium">{children}</span>
    </div>
  </div>
);

export default Loading; 