"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType, EmblaCarouselType, EmblaPluginType } from "embla-carousel";
import { cn } from "@/lib/utils";

type CarouselContextValue = {
	orientation: "horizontal" | "vertical";
	scrollPrev: () => void;
	scrollNext: () => void;
	canScrollPrev: boolean;
	canScrollNext: boolean;
	viewportRef: (node: HTMLElement | null) => void;
	api: EmblaCarouselType | undefined;
};

const CarouselContext =
	React.createContext<CarouselContextValue | null>(null);

export function useCarousel() {
	const ctx = React.useContext(CarouselContext);
	if (!ctx)
		throw new Error(
			"useCarousel must be used within <Carousel>"
		);
	return ctx;
}

type CarouselProps =
	React.HTMLAttributes<HTMLDivElement> & {
		opts?: EmblaOptionsType;
		orientation?: "horizontal" | "vertical";
		setApi?: (api: EmblaCarouselType) => void;
		plugins?: EmblaPluginType[];
	};

export function Carousel({
	orientation = "horizontal",
	opts,
	setApi,
	plugins,
	className,
	children,
	...props
}: CarouselProps) {
	const [viewportRef, api] = useEmblaCarousel(
		{ align: "start", loop: true, ...opts },
		plugins
	);
	const [canScrollPrev, setCanScrollPrev] =
		React.useState(false);
	const [canScrollNext, setCanScrollNext] =
		React.useState(false);

	const onSelect = React.useCallback(
		(embla: EmblaCarouselType) => {
			setCanScrollPrev(embla.canScrollPrev());
			setCanScrollNext(embla.canScrollNext());
		},
		[]
	);

	React.useEffect(() => {
		if (!api) return;
		setApi?.(api);
		onSelect(api);
		api.on("select", () => onSelect(api));
		api.on("reInit", () => onSelect(api));
	}, [api, onSelect, setApi]);

	const scrollPrev = React.useCallback(
		() => api?.scrollPrev(),
		[api]
	);
	const scrollNext = React.useCallback(
		() => api?.scrollNext(),
		[api]
	);

	return (
		<CarouselContext.Provider
			value={{
				orientation,
				scrollPrev,
				scrollNext,
				canScrollPrev,
				canScrollNext,
				viewportRef,
				api
			}}
		>
			<div
				className={cn("relative", className)}
				role="region"
				aria-roledescription="carousel"
				{...props}
			>
				{children}
			</div>
		</CarouselContext.Provider>
	);
}

export const CarouselContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
	const { viewportRef, orientation } = useCarousel();
	return (
		<div
			ref={(node) => viewportRef(node)}
			className={cn(
				"overflow-hidden",
				orientation === "vertical" && "h-full",
				className
			)}
		>
			<div
				ref={ref}
				className={cn(
					"flex",
					orientation === "vertical"
						? "h-full flex-col"
						: "-ml-4",
					className
				)}
				{...props}
			>
				{children}
			</div>
		</div>
	);
});
CarouselContent.displayName = "CarouselContent";

export const CarouselItem = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"min-w-0 shrink-0 grow-0 basis-auto pl-4",
			className
		)}
		role="group"
		aria-roledescription="slide"
		{...props}
	/>
));
CarouselItem.displayName = "CarouselItem";

export const CarouselPrevious = React.forwardRef<
	HTMLButtonElement,
	React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
	const { scrollPrev, canScrollPrev } = useCarousel();
	return (
		<button
			ref={ref}
			type="button"
			aria-label="Previous slide"
			onClick={scrollPrev}
			disabled={!canScrollPrev}
			className={cn(
				"absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 hover:bg-white shadow p-2",
				className
			)}
			{...props}
		>
			‹
		</button>
	);
});
CarouselPrevious.displayName = "CarouselPrevious";

export const CarouselNext = React.forwardRef<
	HTMLButtonElement,
	React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
	const { scrollNext, canScrollNext } = useCarousel();
	return (
		<button
			ref={ref}
			type="button"
			aria-label="Next slide"
			onClick={scrollNext}
			disabled={!canScrollNext}
			className={cn(
				"absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 hover:bg-white shadow p-2",
				className
			)}
			{...props}
		>
			›
		</button>
	);
});
CarouselNext.displayName = "CarouselNext";
