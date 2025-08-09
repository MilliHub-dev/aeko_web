"use client";

import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const Stories = () => {
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const scroll = (direction: "left" | "right") => {
		if (scrollContainerRef.current) {
			const container = scrollContainerRef.current;
			const scrollAmount = container.clientWidth * 0.9; // 90% ensures perfect alignment
			container.scrollBy({
				left: direction === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth"
			});
		}
	};

	return (
		<div className="w-full max-w-[100vw] sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto relative isolate">
			<div className="flex items-center relative">
				{/* Left Navigation Button */}
				<Button
					variant="ghost"
					size="icon"
					onClick={() => scroll("left")}
					className="hidden md:flex absolute left-0 z-10 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-background transition-colors justify-center items-center -translate-x-1/2"
				>
					<ChevronLeft className="w-5 h-5 text-primary" />
				</Button>

				{/* Scrollable Stories Container */}
				<div
					ref={scrollContainerRef}
					className="w-full overflow-x-auto no-scrollbar snap-x snap-mandatory py-4 px-3 sm:px-4 md:px-6"
				>
					<div className="flex gap-3 sm:gap-4 md:gap-5">
						{/* Add Story */}
						<div className="flex-shrink-0 flex flex-col items-center gap-2 snap-start">
							<Button
								variant="outline"
								className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-border/30 bg-muted shrink-0 hover:bg-primary/10"
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
								<div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-primary bg-muted cursor-pointer hover:border-primary/70 transition-colors" />
								<p className="text-[10px] sm:text-xs text-muted-foreground truncate w-14 sm:w-16 md:w-20 lg:w-24 text-center">
									user_{i + 1}
								</p>
							</div>
						))}
					</div>
				</div>

				{/* Right Navigation Button */}
				<Button
					variant="ghost"
					size="icon"
					onClick={() => scroll("right")}
					className="hidden md:flex absolute right-0 z-10 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-background transition-colors justify-center items-center translate-x-1/2"
				>
					<ChevronRight className="w-5 h-5 text-primary" />
				</Button>
			</div>
		</div>
	);
};

export { Stories };
