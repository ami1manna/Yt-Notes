// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { Move, Minimize, Maximize, Pin } from "lucide-react"; // Icons

// const WindowTab = ({ children }) => {
//   const [isOpen, setIsOpen] = useState(true);
//   const [isPinned, setIsPinned] = useState(false);
//   const [isMaximized, setIsMaximized] = useState(false);

//   return (
//     <motion.div
//       drag
//       dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
//       initial={{ x: "100%" }}
//       animate={{ x: isOpen ? (isPinned ? "90%" : "0%") : "100%" }}
//       transition={{ type: "spring", stiffness: 100, damping: 15 }}
//       className={`fixed top-16 right-0 bg-white dark:bg-gray-900 shadow-lg rounded-l-lg 
//         ${isMaximized ? "w-[100%] h-[90%]" : "w-80 h-96"}
//         flex flex-col border border-gray-300 dark:border-gray-700 z-50`}
//     >
//       {/* Header with Controls */}
//       <div className="flex items-center justify-between bg-gray-200 dark:bg-gray-800 p-2 rounded-t-lg">
//         <Move size={20} className="cursor-move text-gray-600 dark:text-gray-300" />
        
//         <div className="flex gap-2">
//           <button onClick={() => setIsPinned(!isPinned)} title="Pin">
//             <Pin size={20} className="text-gray-600 dark:text-gray-300 hover:text-blue-500" />
//           </button>

//           <button onClick={() => setIsMaximized(!isMaximized)} title="Maximize">
//             <Maximize size={20} className="text-gray-600 dark:text-gray-300 hover:text-green-500" />
//           </button>

//           <button onClick={() => setIsOpen(false)} title="Minimize">
//             <Minimize size={20} className="text-gray-600 dark:text-gray-300 hover:text-red-500" />
//           </button>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="flex-1 p-4 overflow-auto">{children}</div>
//     </motion.div>
//   );
// };

// export default WindowTab;
