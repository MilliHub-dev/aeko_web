interface PostMediaWrapperProps {
	type: "image" | "video";
	children: React.ReactNode;
	containerRef: React.RefObject<HTMLDivElement>;
	onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
	onMouseLeave: () => void;
}

const PostMediaWrapper = ({
	type,
	children,
	containerRef,
	onMouseMove,
	onMouseLeave
}: PostMediaWrapperProps) => (
	<div
		ref={containerRef}
		className="relative flex-1 w-full max-w-sm md:max-w-xl mx-auto aspect-[4/4] rounded-2xl overflow-hidden"
		onMouseMove={onMouseMove}
		onMouseLeave={onMouseLeave}
	>
		{children}
	</div>
);
export { PostMediaWrapper };
