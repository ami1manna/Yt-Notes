import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Pin, NotebookPen, Minus, FoldHorizontal } from "lucide-react";

const SideNote = ({
  children,
  defaultWidth = 700,
  minWidth = 500,
  maxWidth = 1000,
  title = "Notes"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [width, setWidth] = useState(defaultWidth);
  const [position, setPosition] = useState({ x: window.innerWidth - defaultWidth });
  const panelRef = useRef(null);
  const resizableRef = useRef(null);
  const dragRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen && !isPinned) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, isPinned]);

  // Handle focus management
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

  const handleResize = (e, direction) => {
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;

    if (direction === 'left') {
      const newWidth = width + (position.x - clientX);
      const newPosition = clientX;

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
        setPosition({ x: newPosition });
      }
    } else {
      const newWidth = window.innerWidth - clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    }
  };

  const startResizing = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();

    const events = {
      move: e.touches ? "touchmove" : "mousemove",
      end: e.touches ? "touchend" : "mouseup"
    };

    const handleResizeWithDirection = (event) => handleResize(event, direction);

    document.addEventListener(events.move, handleResizeWithDirection);
    document.addEventListener(events.end, () => stopResizing(handleResizeWithDirection));
  };

  const stopResizing = (handler) => {
    document.removeEventListener("mousemove", handler);
    document.removeEventListener("mouseup", handler);
    document.removeEventListener("touchmove", handler);
    document.removeEventListener("touchend", handler);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            drag={!isMaximized}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.1}
            dragMomentum={false}
            initial={{ x: "100%" }}
            animate={{
              x: "0%",
              width: isMaximized ? "100%" : width,
              height: "100%"
            }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className={`
              fixed top-0 right-0 bg-white dark:bg-gray-900 
              shadow-lg flex flex-col border border-gray-200 
              dark:border-gray-800 z-50 overflow-hidden
              ${isMaximized ? 'rounded-none' : 'rounded-lg'}
            `}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 select-none"

            >
               
                {!isMaximized && (
                  <>
                    {/* Left resize handle */}
                    <div
                      className="flex items-center  cursor-ew-resize group"
                      onMouseDown={(e) => startResizing(e, 'left')}
                      onTouchStart={(e) => startResizing(e, 'left')}
                      role="separator"
                      aria-label="Resize panel left"
                    >


                      <FoldHorizontal/>
                      <span className="font-medium text-gray-700 dark:text-gray-200 mx-7">
                        {title}
                      </span>
                    </div>

                  </>
                )}
               
              <div className="flex gap-1">
                <button
                  onClick={() => setIsPinned(!isPinned)}
                  className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label={isPinned ? "Unpin panel" : "Pin panel"}
                >
                  <Pin
                    size={18}
                    className={`transform transition-transform ${isPinned ? "rotate-45 text-blue-500" : "text-gray-500 dark:text-gray-400"
                      }`}
                  />
                </button>
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label={isMaximized ? "Restore panel" : "Maximize panel"}
                >
                  <Maximize2
                    size={18}
                    className="text-gray-500 dark:text-gray-400"
                  />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close panel"
                >
                  <Minus
                    size={18}
                    className="text-gray-500 dark:text-gray-400"
                  />
                </button>
              </div>
            </div>

            {/* Resizable Content */}
            <div className="flex-1 p-4 overflow-auto relative" ref={resizableRef}>
              {children}
              {!isMaximized && (
                <>
                  {/* Left resize handle */}
                  <div
                    className="absolute top-[88%] bottom-0 left-0   cursor-ew-resize group"
                    onMouseDown={(e) => startResizing(e, 'left')}
                    onTouchStart={(e) => startResizing(e, 'left')}
                    role="separator"
                    aria-label="Resize panel left"
                  >

                    <div className="absolute inset-y-0 left-0 w-1 bg-blue-600 group-hover:bg-blue-500 transition-colors" />

                  </div>

                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
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