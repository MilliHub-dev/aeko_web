"use client";

import { motion } from "motion/react";

interface PostOverlayProps {
	show: boolean;
}

const PostOverlay = ({ show }: PostOverlayProps) => (
	<motion.div
		className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/40 z-5 isolate"
		animate={{ opacity: show ? 1 : 0 }}
		transition={{ duration: 0.3 }}
	/>
);

export { PostOverlay };
