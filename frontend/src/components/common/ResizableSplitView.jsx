import { useRef, useState, useEffect } from "react";

const ResizableSplitView = ({
  left,
  right,
  initialLeftWidth = 5, // value from 1–10 → 10%–100%
  minLeftWidth = 300,
  minRightWidth = 200,
  minTopHeight = 200,
  minBottomHeight = 200,
}) => {
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const [isVertical, setIsVertical] = useState(false);
  const [primarySize, setPrimarySize] = useState(500); // px

  // Converts 1–10 to percent-based width (desktop)
  const calculateInitialSize = () => {
    if (isVertical) return 300; // default top height

    const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;

    const clamped = Math.max(1, Math.min(initialLeftWidth, 10)); // clamp to 1-10
    const percent = (clamped / 10) * containerWidth;

    // Ensure it respects min/max widths
    return Math.max(minLeftWidth, Math.min(percent, containerWidth - minRightWidth));
  };

  // Set initial layout mode and size
  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setIsVertical(true);
      setPrimarySize(300); // mobile height
    } else {
      setIsVertical(false);
      setPrimarySize(calculateInitialSize());
    }
  };

  useEffect(() => {
    handleResize();
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
