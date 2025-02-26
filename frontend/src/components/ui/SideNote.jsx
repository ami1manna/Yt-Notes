import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Pin, NotebookPen, Minus, FoldHorizontal, Plus, X } from "lucide-react";

const SideNote = ({
  children,
  defaultWidth = 700,
  minWidth = 300,
  maxWidth = 2500,
  titles = [],
  defaultTab = 0
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [width, setWidth] = useState(defaultWidth);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const panelRef = useRef(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  // Convert children to array if single child
  const tabElements = Array.isArray(children) ? children : [children];
  const tabTitles = titles.length === tabElements.length 
    ? titles 
    : tabElements.map((_, i) => `Tab ${i + 1}`);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setWidth(window.innerWidth);
        setIsMaximized(true);
      } else {
        setWidth(Math.min(defaultWidth, window.innerWidth - 100));
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

  const handleResizeStart = (e) => {
    if (isMobile || isMaximized) return;

    e.preventDefault();
    document.body.style.cursor = 'ew-resize';
    
    startXRef.current = e.clientX || e.touches?.[0]?.clientX;
    startWidthRef.current = width;

    const handleMove = (moveEvent) => {
      const currentX = moveEvent.clientX || moveEvent.touches?.[0]?.clientX;
      const diff = startXRef.current - currentX;
      const newWidth = Math.min(Math.max(startWidthRef.current + diff, minWidth), maxWidth);
      setWidth(newWidth);
    };

    const handleEnd = () => {
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ x: "100%" }}
            animate={{
              x: 0,
              width: isMobile || isMaximized ? "100%" : width
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
              height: '100%',
              zIndex: 50
            }}
            className="bg-white dark:bg-gray-900 shadow-lg flex flex-col border 
              border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3">
              <div className="flex items-center gap-2">
                <FoldHorizontal className="text-gray-500 dark:text-gray-400" />
                {/* Tab Navigation */}
                <div className="flex gap-1 items-center overflow-hidden  ">
                  {tabTitles.map((title, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setActiveTab(index)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        px-3 py-1.5 rounded-lg text-sm font-medium
                        transition-all duration-200 min-w-max
                        ${activeTab === index 
                          ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}
                      `}
                    >
                      {title}
                    </motion.button>
                  ))}
                </div>
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

            <div className="flex-1 overflow-auto relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-4"
                >
                  {tabElements[activeTab]}
                </motion.div>
              </AnimatePresence>
              
              {!isMobile && !isMaximized && (
                <div
                  className="absolute top-0 left-0 w-1 h-full cursor-ew-resize group"
                  onMouseDown={handleResizeStart}
                  onTouchStart={handleResizeStart}
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-transparent 
                    group-hover:bg-blue-500 transition-colors" />
                </div>
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