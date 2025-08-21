"use client";

import { Button } from "../ui/button";
import { motion, useSpring } from "motion/react";
import { useRef, useState, useEffect } from "react";

const Stories = () => {
  const wrapperRef = useRef<HTMLDivElement>(null); // Outer fixed wrapper
  const innerRef = useRef<HTMLDivElement>(null); // Inner draggable content

  const [maxDrag, setMaxDrag] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);
  const x = useSpring(0, { stiffness: 300, damping: 30 });

  const calculateDragLimits = () => {
    if (wrapperRef.current && innerRef.current) {
      const wrapperWidth = wrapperRef.current.offsetWidth;
      const innerWidth = innerRef.current.scrollWidth;

      const firstItem = innerRef.current.querySelector(
        ".snap-start"
      ) as HTMLElement | null;
      if (firstItem) {
        const style = window.getComputedStyle(firstItem);
        const marginRight = parseFloat(style.marginRight);
        setItemWidth(firstItem.offsetWidth + marginRight);
      }

      // Max drag is the difference between inner content and visible area
      setMaxDrag(innerWidth - wrapperWidth);
    }
  };

  useEffect(() => {
    calculateDragLimits();
    window.addEventListener("resize", calculateDragLimits);
    return () => {
      window.removeEventListener("resize", calculateDragLimits);
    };
  }, []);

  const handleDragEnd = () => {
    const currentX = x.get();
    const snapTo = Math.round(currentX / itemWidth) * itemWidth;
    const clamped = Math.max(Math.min(snapTo, 0), -maxDrag);
    x.set(clamped);
  };

  return (
    <div className="w-full max-w-[100vw] sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto relative isolate mb-8">
      {/* Outer Wrapper */}
      <div ref={wrapperRef} className="overflow-hidden pl-10 sm:px-4 md:px-6">
        {/* Draggable Inner */}
        <motion.div
          ref={innerRef}
          className="flex gap-3 sm:gap-4 md:gap-5 snap-x snap-mandatory cursor-grab active:cursor-grabbing -mx-6"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -maxDrag, right: 0 }}
          dragElastic={0.2}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
        >
          {/* Add Story */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2 snap-start">
            <Button
              variant="outline"
              className="w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-border/30 bg-muted shrink-0 hover:bg-primary/10"
            >
              <span className="text-xl sm:text-2xl">+</span>
            </Button>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate w-14 sm:w-16 md:w-20 lg:w-24 text-center">
              Add Story
            </p>
          </div>

          {/* Story Circles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex flex-col items-center gap-2 snap-start"
            >
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-primary bg-muted cursor-pointer hover:border-primary/70 transition-colors" />
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate w-14 sm:w-16 md:w-20 lg:w-24 text-center">
                user_{i + 1}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export { Stories };
