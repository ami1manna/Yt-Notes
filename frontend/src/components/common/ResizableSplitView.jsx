import { useRef, useState, useEffect } from "react";

const ResizableSplitView = ({
  left,
  right,
  minLeftWidth = 300,
  minRightWidth = 200,
  minTopHeight = 200,
  minBottomHeight = 200,
}) => {
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const [isVertical, setIsVertical] = useState(false); // vertical = mobile mode
  const [primarySize, setPrimarySize] = useState(500); // width or height depending on mode

  // Toggle vertical mode on screen size change
  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setIsVertical(true);
      setPrimarySize(300); // initial top height
    } else {
      setIsVertical(false);
      setPrimarySize(500); // initial left width
    }
  };

  useEffect(() => {
    handleResize(); // initialize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = () => {
    isDragging.current = true;
    document.body.style.cursor = isVertical ? "row-resize" : "col-resize";
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    if (isVertical) {
      const newHeight = e.clientY - rect.top;
      const totalHeight = containerRef.current.offsetHeight;
      if (
        newHeight >= minTopHeight &&
        totalHeight - newHeight >= minBottomHeight
      ) {
        setPrimarySize(newHeight);
      }
    } else {
      const newWidth = e.clientX - rect.left;
      const totalWidth = containerRef.current.offsetWidth;
      if (
        newWidth >= minLeftWidth &&
        totalWidth - newWidth >= minRightWidth
      ) {
        setPrimarySize(newWidth);
      }
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.cursor = "default";
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isVertical]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-1 overflow-hidden relative ${
        isVertical ? "flex-col" : "flex-row"
      }`}
    >
      {/* Primary Section (Left or Top) */}
      <div
        className="overflow-auto"
        style={
          isVertical
            ? { height: `${primarySize}px`, minHeight: `${minTopHeight}px` }
            : { width: `${primarySize}px`, minWidth: `${minLeftWidth}px` }
        }
      >
        {left}
      </div>

      {/* Resizer */}
      <div
        className={`${
          isVertical
            ? "h-2 cursor-row-resize w-full"
            : "w-2 cursor-col-resize h-full"
        } bg-gray-300 hover:bg-gray-400 transition-colors`}
        onMouseDown={handleMouseDown}
      />

      {/* Secondary Section (Right or Bottom) */}
      <div
        className="flex-1 overflow-auto min-w-0 min-h-0"
        style={
          isVertical
            ? { minHeight: `${minBottomHeight}px` }
            : { minWidth: `${minRightWidth}px` }
        }
      >
        {right}
      </div>
    </div>
  );
};

export default ResizableSplitView;
