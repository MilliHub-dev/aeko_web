"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Define interfaces
interface CategoryTabsProps {
	categories?: string[];
	activeCategory?: string;
	setActiveCategory?: (category: string) => void;
}

const CategoryTabs = ({
	categories,
	activeCategory,
	setActiveCategory
}: CategoryTabsProps) => {
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
		<div className="relative w-full max-w-full min-w-0 overflow-hidden rounded-lg backdrop-blur-md">
			{/* Left Navigation Button */}
			<Button
				variant="ghost"
				size="sm"
				onClick={scrollLeft}
				className="hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-background/90 justify-center items-center"
			>
				<ChevronLeft className="w-4 h-4 text-primary" />
			</Button>

			{/* Right Navigation Button */}
			<Button
				variant="ghost"
				size="sm"
				onClick={scrollRight}
				className="hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-background/90 justify-center items-center"
			>
				<ChevronRight className="w-4 h-4 text-primary" />
			</Button>

			<div
				ref={scrollContainerRef}
				className="flex w-full max-w-full min-w-0 snap-x snap-mandatory overflow-x-auto pb-2 pt-1 no-scrollbar"
			>
				<div className="flex min-w-max gap-2 px-0.5 pr-4 sm:px-2 md:ml-1 lg:ml-6">
					{categories?.map((category) => (
						<button
							key={category}
							onClick={() =>
								setActiveCategory?.(
									category
								)
							}
							className={`snap-center whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
								activeCategory === category
									? "bg-primary text-white"
									: "border border-primary bg-background text-black "
							}`}
						>
							{category}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export { CategoryTabs };
