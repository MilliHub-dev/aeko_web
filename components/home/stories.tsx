"use client";

import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const Stories = () => {
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const scrollLeft = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({
				left: -200,
				behavior: "smooth"
			});
		}
	};

	const scrollRight = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({
				left: 200,
				behavior: "smooth"
			});
		}
	};

	return (
		<div className="w-full max-w-[100vw] sm:max-w-md lg:max-w-2xl mx-auto relative">
			<div className="flex items-center px-2 sm:px-4">
				{/* Left Navigation Button */}
				<Button
					variant="ghost"
					size="icon"
					onClick={scrollLeft}
					className="hidden md:flex absolute left-0 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-background/90 justify-center items-center -translate-x-1/2"
				>
					<ChevronLeft className="w-4 h-4 text-primary" />
				</Button>

				{/* Stories Container */}
				<div
					ref={scrollContainerRef}
					className="w-full overflow-x-scroll no-scrollbar snap-x snap-mandatory py-4"
				>
					<div className="flex gap-4 px-2">
						{/* Add Story Button */}
						<div className="flex-shrink-0 flex flex-col items-center gap-2 snap-center">
							<Button
								variant="outline"
								className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-border/30 bg-muted shrink-0 hover:bg-primary/10"
							>
								<span className="text-xl">+</span>
							</Button>
							<p className="text-xs text-muted-foreground truncate w-16 text-center">
								Add Story
							</p>
						</div>

						{/* Story Circles */}
						{Array.from({ length: 10 }).map((_, i) => (
							<div
								key={i}
								className="flex-shrink-0 flex flex-col items-center gap-2 snap-center"
							>
								<div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-primary bg-muted cursor-pointer hover:border-normal-hover transition-colors outline-4 outline-secondary" />
								<p className="text-xs text-muted-foreground truncate w-16 text-center">
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
					onClick={scrollRight}
					className="hidden md:flex absolute right-0 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-background/90 justify-center items-center translate-x-1/2"
				>
					<ChevronRight className="w-4 h-4 text-primary" />
				</Button>
			</div>
		</div>
	);
};

export { Stories };