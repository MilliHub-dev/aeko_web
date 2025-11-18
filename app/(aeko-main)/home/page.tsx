import { PostCard } from "@/components/home/post/post-card";
import { getPosts } from "@/lib/get-posts";
import { PostsInitializer } from "@/components/home/post/posts-initializer";

export default async function Home() {
	const posts = await getPosts();

	return (
		<PostsInitializer posts={posts}>
			<div className="mt-20 md:mt-0 flex justify-center items-center flex-col min-h-screen scroll-smooth">
				<div className="flex flex-col">
					{posts.map((post, idx) => (
						<PostCard
							key={`image-${idx}`}
							{...post}
						/>
					))}
				</div>
			</div>
		</PostsInitializer>
	);
}
