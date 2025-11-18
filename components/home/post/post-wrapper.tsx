"use client";

import { useRouter } from "next/navigation";
import clsx from "clsx";
import React from "react";
import { PostActions } from "./post-actions";

interface PostWrapperProps {
	id: string;
	handle: string;
	ref: React.Ref<HTMLDivElement>;
	children?: React.ReactNode;
	isMedia?: boolean;
	likes: string;
	shares: string;
	bookmarks: string;
	comments: string;
	onMouseMove?: (
		event: React.MouseEvent<HTMLDivElement>
	) => void;
	onMouseLeave?: (
		event: React.MouseEvent<HTMLDivElement>
	) => void;
	onTouchStart?: (
		event: React.TouchEvent<HTMLDivElement>
	) => void;
	onTouchEnd?: (
		event: React.TouchEvent<HTMLDivElement>
	) => void;
}

const PostWrapper = ({
	children,
	handle,
	isMedia,
	id,
	ref,
	likes,
	shares,
	bookmarks,
	comments,
	onMouseMove,
	onMouseLeave,
	onTouchStart,
	onTouchEnd
}: PostWrapperProps) => {
	const router = useRouter();

	const handleRoute = (
		event: React.MouseEvent<HTMLDivElement>
	) => {
		if (
			(event.target as HTMLElement).closest(
				"button, a"
			)
		)
			return;
		event.preventDefault();
		event.stopPropagation();
		router.push(`/${handle}/posts/${id}`);
	};

	return (
		<div className="">
			<div className="relative lg:h-screen py-6 max-w-200 snap-center lg:snap-start lg:flex gap-x-6">
				<div
					ref={ref}
					onMouseMove={isMedia ? onMouseMove : undefined}
					onMouseLeave={isMedia ? onMouseLeave : undefined}
					onTouchStart={isMedia ? onTouchStart : undefined}
					onTouchEnd={isMedia ? onTouchEnd : undefined}
					className={clsx(
						"relative flex flex-col justify-between mx-auto w-full max-w-md md:max-w-lg lg:max-w-xl rounded-4xl isolate p-6 ",
						isMedia
							? "flex-1 aspect-9/16 lg:aspect-9/14 xl:aspect-9/16 overflow-hidden outline-primary/30 outline-4 outline-offset-0"
							: "aspect-auto border"
					)}
				>
					{children}
				</div>
				<PostActions
					likes={likes}
					shares={shares}
					bookmarks={bookmarks}
					comments={comments}
					postId={id}
				/>
			</div>
		</div>
	);
};

export { PostWrapper };

