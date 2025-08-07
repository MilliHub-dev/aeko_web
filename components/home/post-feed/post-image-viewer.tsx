"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { ReactNode } from "react";

interface PostImageViewerProps {
	backgroundImage: string;
	profileImage: string;
	header?: ReactNode;
	footer?: ReactNode;
	onOpenModal?: () => void;
	showOverlay?: boolean;
}

const PostImageViewer = ({
	backgroundImage,
	header,
	footer,
	onOpenModal,
	showOverlay = true
}: PostImageViewerProps) => {
	return (
		<>
			{/* Image Media */}
			<Image
				src={backgroundImage}
				alt="Post media"
				fill
				className="object-cover"
				priority
			/>

			{/* Overlay Gradient */}
			<motion.div
				className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"
				animate={{ opacity: showOverlay ? 1 : 0 }}
				transition={{ duration: 0.3 }}
				onClick={onOpenModal}
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
		</>
	);
};

export { PostImageViewer };
