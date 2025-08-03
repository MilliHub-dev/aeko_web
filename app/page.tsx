import { Post, PostProps, PostType } from "@/components/home/post-feed/post";
import { Stories } from "@/components/home/stories";

export default function Home() {
	const posts: PostProps[] = [
		{
			type: "image",
			username: "Lisa Wong",
			handle: "@lisawongdesigns",
			profileImage: "/users/lisa-wong.jpeg",
			backgroundImage: "/posts/interior-design.jpg",
			content:
				"Just finished this minimalist living room project! Love how the natural light plays with the neutral tones. Swipe for before photos ➡️ #InteriorDesign",
			likes: "4.2K",
			shares: "892",
			bookmarks: "345",
			comments: "167",
			hashtags: [
				"interiordesign",
				"minimalism",
				"homedecor",
				"design",
				"architecture"
			],
			timePosted: "3h"
		},
		{
			type: "video",
			username: "Mike Chen",
			handle: "@chefmikechen",
			profileImage: "/users/mike-chen.jpg",
			backgroundImage: "/posts/cooking-thumbnail.jpg",
			videoSrc: "/posts/ramen-recipe.mp4",
			content:
				"The secret to perfect tonkotsu ramen! � Been perfecting this recipe for months. Full recipe in bio! #Cooking",
			likes: "89.4K",
			shares: "12.3K",
			bookmarks: "15.2K",
			comments: "3.4K",
			hashtags: ["cooking", "foodie", "ramen", "recipe", "chefsofinstagram"],
			timePosted: "5h"
		},
		{
			type: "text",
			username: "Sarah Johnson",
			handle: "@sarahcodes",
			profileImage: "/users/sarah-johnson.jpeg",
			content:
				"🎉 Big news! After 6 months of hard work, we've just open-sourced our React state management library. Already 2.5k stars on GitHub in just 24 hours! Check it out: github.com/statex/react\n\nProud of what our small team has accomplished. Threading some key features below... 🧵",
			likes: "3.1K",
			shares: "945",
			bookmarks: "721",
			comments: "234",
			hashtags: ["opensource", "reactjs", "javascript", "webdev", "programming"],
			timePosted: "1h"
		},
		{
			type: "image",
			username: "Alex Rivera",
			handle: "@arivera.photo",
			profileImage: "/users/alex-rivera.jpg",
			backgroundImage: "/posts/street-photography.jpg",
			content:
				"Rainy evening in Tokyo. The neon lights reflecting off the wet streets create such a cyberpunk atmosphere. Shot on Sony A7IV, 35mm f/1.4 📸",
			likes: "12.5K",
			shares: "2.8K",
			bookmarks: "1.9K",
			comments: "428",
			hashtags: ["photography", "tokyo", "streetphotography", "nightlife", "urban"],
			timePosted: "8h"
		},
		{
			type: "text",
			username: "Dr. Emily Carter",
			handle: "@dr_carter",
			profileImage: "/users/emily-carter.jpg",
			content:
				"Just published our research on AI-assisted cancer detection in Nature Medicine! Our model achieved 94% accuracy, potentially reducing diagnostic time by 60%.\n\nThank you to my amazing team and all the healthcare workers who helped validate the results. 🧬🔬\n\nLink to paper: nature.com/articles/s41591...",
			likes: "15.7K",
			shares: "8.9K",
			bookmarks: "6.2K",
			comments: "892",
			hashtags: ["science", "AI", "healthcare", "research", "medicine"],
			timePosted: "12h"
		}
	];

	return (
		<div className="py-20 md:py-8">
			{/* <Stories /> */}
			<div className="w-full mx-auto snap-y snap-mandatory space-y-5">
				<div className="flex flex-col gap-8">
					{posts.map((post, idx) => (
						<Post
							key={`image-${idx}`}
							{...post}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
