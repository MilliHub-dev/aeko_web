import { motion } from "motion/react";

const FloatingCards = ({
	images
}: {
	images: string[];
}) => {
	return (
		<div className="flex flex-wrap items-end justify-center gap-3 lg:gap-4">
			{images.map((src, i) => (
				<motion.div
					key={i}
					initial={{ opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						delay: i * 0.07,
						type: "spring",
						stiffness: 280,
						damping: 22
					}}
					whileHover={{
						y: -6,
						rotateZ: 0,
						rotateX: 2,
						scale: 1.03
					}}
					className={`card-tilt w-40 h-32 lg:w-72 lg:h-46 xl:w-86 xl:h-50  ${
						[
							"-rotate-8",
							"-rotate-3",
							"rotate-2",
							"rotate-6"
						][i % 4]
					}`}
				>
					<img
						src={src}
						alt="cover"
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent" />
				</motion.div>
			))}
		</div>
	);
};

export { FloatingCards };
