import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Pin, NotebookPen, Minus, FoldHorizontal } from "lucide-react";

const SideNote = ({
  children,
  defaultWidth = 700,
  minWidth = 300,
  maxWidth = 1000,
  title = "Notes"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [width, setWidth] = useState(defaultWidth);
  const [position, setPosition] = useState({ x: window.innerWidth - defaultWidth });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef(null);
  const resizableRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setWidth(window.innerWidth);
        setIsMaximized(true);
      } else {
        setWidth(defaultWidth);
        setIsMaximized(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [defaultWidth]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen && !isPinned) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, isPinned]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !isPinned && panelRef.current && !panelRef.current.contains(event.target)) {
        const toggleButton = document.querySelector('[aria-label="Open notes panel"], [aria-label="Close notes panel"]');
        if (toggleButton && !toggleButton.contains(event.target)) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, isPinned]);

  const handleResize = (e) => {
    if (isMobile || isMaximized || !isResizing) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const newWidth = window.innerWidth - clientX;
    
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setWidth(newWidth);
      setPosition({ x: clientX });
    }
  };

  const startResizing = (e) => {
    if (isMobile || isMaximized) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    window.addEventListener('mousemove', handleResize);
    window.addEventListener('mouseup', stopResizing);
    window.addEventListener('touchmove', handleResize);
    window.addEventListener('touchend', stopResizing);
  };

  const stopResizing = () => {
    setIsResizing(false);
    window.removeEventListener('mousemove', handleResize);
    window.removeEventListener('mouseup', stopResizing);
    window.removeEventListener('touchmove', handleResize);
    window.removeEventListener('touchend', stopResizing);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            drag={!isMaximized && !isMobile && !isResizing}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.1}
            dragMomentum={false}
            initial={{ x: "100%" }}
            animate={{
              x: "0%",
              width: isMobile || isMaximized ? "100%" : width,
              height: "100%"
            }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            style={{ 
              position: 'fixed',
              top: 0,
              right: 0,
              zIndex: 50
            }}
            className="bg-white dark:bg-gray-900 shadow-lg flex flex-col border 
              border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 select-none">
              <div className="flex items-center cursor-grab group">
                <FoldHorizontal className="mr-2" />
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {title}
                </span>
              </div>
 
              <div className="flex gap-1">
                {!isMobile && (
                  <button
                    onClick={() => setIsPinned(!isPinned)}
                    className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 
                      transition-colors"
                    aria-label={isPinned ? "Unpin panel" : "Pin panel"}
                  >
                    <Pin
                      size={18}
                      className={`transform transition-transform ${
                        isPinned ? "rotate-45 text-blue-500" : "text-gray-500 dark:text-gray-400"
                      }`}
                    />
                  </button>
                )}
                {!isMobile && (
                  <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 
                      transition-colors"
                    aria-label={isMaximized ? "Restore panel" : "Maximize panel"}
                  >
                    <Maximize2
                      size={18}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 
                    transition-colors"
                  aria-label="Close panel"
                >
                  <Minus
                    size={18}
                    className="text-gray-500 dark:text-gray-400"
                  />
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-auto relative" ref={resizableRef}>
              {children}
              {!isMobile && !isMaximized && (
                <>
                  <div
                    className="absolute top-0 left-0 w-1 h-full cursor-ew-resize 
                      hover:bg-blue-500 transition-colors"
                    onMouseDown={startResizing}
                    onTouchStart={startResizing}
                  />
                  <div
                    className="absolute top-0 right-0 w-1 h-full cursor-ew-resize 
                      hover:bg-blue-500 transition-colors"
                    onMouseDown={startResizing}
                    onTouchStart={startResizing}
                  />
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 
          shadow-lg rounded-full p-3 flex items-center justify-center
          hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
          border border-gray-200 dark:border-gray-700"
        aria-label={isOpen ? "Close notes panel" : "Open notes panel"}
      >
        <NotebookPen size={24} className="text-gray-700 dark:text-gray-300" />
      </motion.button>
    </>
  );
};

export default SideNote;