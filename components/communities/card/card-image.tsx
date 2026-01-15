"use client";

import { useOverlay } from "@/contexts/OverlayContext";
import { motion } from "motion/react";
import Image from "next/image";
import { ReactNode } from "react";

interface PostImageViewerProps {
  backgroundImage?: string;
  header?: ReactNode;
  footer?: ReactNode;
}

const CardImage = ({
  backgroundImage,
  header,
  footer,
}: PostImageViewerProps) => {
  const { showOverlay, setShowOverlay } = useOverlay();

  return (
    <div className="isolate">
      {/* Image Media */}
      <Image
        src={backgroundImage!}
        alt="Post media"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay Gradient */}
      <motion.div
        className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/20"
        animate={{ opacity: showOverlay ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onMouseOver={() => setShowOverlay?.(true)}
        onMouseOut={() => setShowOverlay?.(false)}
      />

      {/* Header */}
      {header && (
        <motion.div
          className="absolute top-4 left-4 right-4"
          animate={{ opacity: showOverlay ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {header}
        </motion.div>
      )}

      {/* Footer */}
      {footer && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-4"
          animate={{ opacity: showOverlay ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {footer}
        </motion.div>
      )}
    </div>
  );
};

export { CardImage };
