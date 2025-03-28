"use client";

import { Maximize2, Minimize2, X } from "lucide-react";
import type React from "react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type ResizeDirection =
  | "bottom"
  | "bottomLeft"
  | "bottomRight"
  | "left"
  | "right"
  | "top"
  | "topLeft"
  | "topRight"
  | null;

interface WindowProps {
  children: ReactNode
  className?: string
  defaultHeight?: number
  defaultWidth?: number
  defaultX?: number
  defaultY?: number
  minHeight?: number
  minWidth?: number
  onClose?: () => void
  title: string
}

export default function Window({
  children,
  className,
  defaultHeight = 400,
  defaultWidth = 600,
  defaultX = 100,
  defaultY = 100,
  minHeight = 200,
  minWidth = 300,
  onClose,
  title,
}: WindowProps) {
  const [position, setPosition] = useState({ x: defaultX, y: defaultY });
  const [size, setSize] = useState({
    height: defaultHeight,
    width: defaultWidth,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection]
    = useState<ResizeDirection>(null);
  const [resizeStart, setResizeStart] = useState({
    height: 0,
    left: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
  });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const windowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prevSizeRef = useRef({ height: defaultHeight, width: defaultWidth });
  const prevPositionRef = useRef({ x: defaultX, y: defaultY });

  useEffect(() => {
    function fitToViewport() {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const newWidth = Math.min(size.width, viewportWidth);
      const newHeight = Math.min(size.height, viewportHeight);

      const newX = Math.max(0, Math.min(position.x, viewportWidth - newWidth));
      const newY = Math.max(
        0,
        Math.min(position.y, viewportHeight - newHeight),
      );

      setSize({ height: newHeight, width: newWidth });
      setPosition({ x: newX, y: newY });
    }

    fitToViewport();
    const timer = setTimeout(() => setIsVisible(true), 50);

    window.addEventListener("resize", fitToViewport);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", fitToViewport);
    };
  }, []);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (isDragging) {
        const newPosition = constrainPosition(
          e.clientX - dragOffset.x,
          e.clientY - dragOffset.y,
        );
        setPosition(newPosition);
      }
      else if (isResizing && resizeDirection) {
        let newWidth = size.width;
        let newHeight = size.height;
        let newX = position.x;
        let newY = position.y;

        switch (resizeDirection) {
          case "bottom":
            newHeight = resizeStart.height + (e.clientY - resizeStart.y);
            break;

          case "bottomLeft":
          { const diffXBottomLeft = resizeStart.x - e.clientX;
            newWidth = resizeStart.width + diffXBottomLeft;
            newX = resizeStart.left - diffXBottomLeft;

            newHeight = resizeStart.height + (e.clientY - resizeStart.y);
            break; }

          case "bottomRight":
            newWidth = resizeStart.width + (e.clientX - resizeStart.x);
            newHeight = resizeStart.height + (e.clientY - resizeStart.y);
            break;

          case "left":
          { const diffX = resizeStart.x - e.clientX;
            newWidth = resizeStart.width + diffX;
            newX = resizeStart.left - diffX;
            break; }

          case "right":
            newWidth = resizeStart.width + (e.clientX - resizeStart.x);
            break;

          case "top":
          { const diffY = resizeStart.y - e.clientY;
            newHeight = resizeStart.height + diffY;
            newY = resizeStart.top - diffY;
            break; }

          case "topLeft":
          { const diffXTopLeft = resizeStart.x - e.clientX;
            newWidth = resizeStart.width + diffXTopLeft;
            newX = resizeStart.left - diffXTopLeft;

            const diffYTopLeft = resizeStart.y - e.clientY;
            newHeight = resizeStart.height + diffYTopLeft;
            newY = resizeStart.top - diffYTopLeft;
            break; }

          case "topRight":
          { newWidth = resizeStart.width + (e.clientX - resizeStart.x);

            const diffYTopRight = resizeStart.y - e.clientY;
            newHeight = resizeStart.height + diffYTopRight;
            newY = resizeStart.top - diffYTopRight;
            break; }
        }

        const constrainedSize = constrainSize(newWidth, newHeight, newX, newY);
        const constrainedPosition = constrainPosition(newX, newY);

        setSize(constrainedSize);
        setPosition(constrainedPosition);
      }
    }

    function handleMouseUp() {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection(null);
    }

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    isResizing,
    dragOffset,
    resizeStart,
    minWidth,
    minHeight,
    position,
    size,
  ]);

  function constrainPosition(x: number, y: number) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    return {
      x: Math.max(0, Math.min(x, viewportWidth - size.width)),
      y: Math.max(0, Math.min(y, viewportHeight - size.height)),
    };
  }

  function constrainSize(width: number, height: number, x: number, y: number) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const newWidth = Math.max(minWidth, Math.min(width, viewportWidth - x));
    const newHeight = Math.max(minHeight, Math.min(height, viewportHeight - y));

    return { height: newHeight, width: newWidth };
  }

  function startDrag(e: React.MouseEvent) {
    if (isFullScreen)
      return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  }

  function startResize(e: React.MouseEvent, dir: ResizeDirection) {
    if (isFullScreen)
      return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(dir);
    setResizeStart({
      height: size.height,
      left: position.x,
      top: position.y,
      width: size.width,
      x: e.clientX,
      y: e.clientY,
    });
  }

  function toggleFullScreen() {
    if (!isFullScreen) {
      prevSizeRef.current = { ...size };
      prevPositionRef.current = { ...position };
      setIsFullScreen(true);
    }
    else {
      setIsFullScreen(false);
      const constrained = constrainPosition(
        prevPositionRef.current.x,
        prevPositionRef.current.y,
      );
      setPosition(constrained);
    }
  }

  function handleClose() {
    if (onClose) {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
      }, 300);
    }
  }

  function handleDoubleClick() {
    toggleFullScreen();
  }

  return (
    <div
      className={`absolute shadow-2xl border border-primary-bright/20 rounded-lg overflow-hidden ${className} ${
        isFullScreen ? "fixed inset-0 z-50" : ""
      } transition-all duration-300 ease-in-out ${
        isVisible && !isClosing ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
      ref={windowRef}
      style={{
        height: isFullScreen ? "100%" : `${size.height}px`,
        left: isFullScreen ? 0 : position.x,
        top: isFullScreen ? 0 : position.y,
        transitionProperty:
          isResizing || isDragging ? "opacity, transform" : "all",
        width: isFullScreen ? "100%" : `${size.width}px`,
        zIndex: isDragging ? 10 : 1,
      }}
    >
      <div
        className="bg-background p-4 flex items-center border-b border-primary-bright/20 cursor-move"
        onDoubleClick={handleDoubleClick}
        onMouseDown={startDrag}
      >
        <div className="flex space-x-2">
          <button
            className="w-3 h-3 rounded-full bg-red flex items-center justify-center"
            onClick={handleClose}
          >
            <X className="w-2 h-2 text-background opacity-0 hover:opacity-100" />
          </button>
          <div className="w-3 h-3 rounded-full bg-yellow"></div>
          <button
            className="w-3 h-3 rounded-full bg-green flex items-center justify-center"
            onClick={toggleFullScreen}
          >
            {isFullScreen
              ? (
                  <Minimize2 className="w-2 h-2 text-background opacity-0 hover:opacity-100" />
                )
              : (
                  <Maximize2 className="w-2 h-2 text-background opacity-0 hover:opacity-100" />
                )}
          </button>
        </div>
        <div className="text-xs mx-auto cursor-move select-none">
          {title}
          {" "}
          {!isFullScreen && `(${size.width} x ${size.height})`}
        </div>
      </div>

      <div className="h-[calc(100%-48px)] overflow-hidden" ref={contentRef}>
        {children}
      </div>

      {!isFullScreen && (
        <>
          {[
            { cursor: "cursor-nw-resize", dir: "topLeft", pos: "top-0 left-0", size: "w-4 h-4" },
            { cursor: "cursor-ne-resize", dir: "topRight", pos: "top-0 right-0", size: "w-4 h-4" },
            { cursor: "cursor-sw-resize", dir: "bottomLeft", pos: "bottom-0 left-0", size: "w-4 h-4" },
            { cursor: "cursor-se-resize", dir: "bottomRight", pos: "bottom-0 right-0", size: "w-4 h-4" },
            { cursor: "cursor-n-resize", dir: "top", pos: "top-0 left-6 right-6", size: "h-2" },
            { cursor: "cursor-s-resize", dir: "bottom", pos: "bottom-0 left-6 right-6", size: "h-2" },
            { cursor: "cursor-w-resize", dir: "left", pos: "left-0 top-6 bottom-6", size: "w-2" },
            { cursor: "cursor-e-resize", dir: "right", pos: "right-0 top-6 bottom-6", size: "w-2" },
          ].map(({ cursor, dir, pos, size }) => (
            <div
              className={`absolute ${pos} ${size} ${cursor} z-10`}
              key={dir}
              onMouseDown={(e) => startResize(e, dir as ResizeDirection)}
            />
          ))}
        </>
      )}
    </div>
  );
}
