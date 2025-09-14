import { PostCard } from "@/components/home/post/post-card";

import { getPosts } from "@/lib/get-posts";

export default async function Home() {
	const posts = await getPosts();

	return (
		<div className="pb-30 mt-20 md:mt-0 flex justify-center items-center flex-col min-h-screen scroll-smooth">
			<div className="flex flex-col">
				{posts.map((post, idx) => (
					<PostCard
						key={`image-${idx}`}
						{...post}
					/>
				))}
			</div>
		</div>
	);
}
