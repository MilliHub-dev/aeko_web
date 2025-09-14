import { Story, UserStoryGroup } from "@/types/story";
import { PostProps } from "../types/post";

export const posts: PostProps[] = [
	{
		id: "1",
		type: "image",
		username: "Lisa Wong",
		handle: "lisawongdesigns",
		profileImage: "/users/lisa-wong.jpeg",
		backgroundImage: "/posts/interior-design-4x5.jpg",
		content:
			"Just finished this minimalist living room project! Love how the natural light plays with the neutral tones. Swipe for before photos ➡️ #InteriorDesign",
		likes: "4.2K",
		shares: "892",
		bookmarks: "345",
		commentMetric: "167",
		hashtags: [
			"interiordesign",
			"minimalism",
			"homedecor",
			"design",
			"architecture"
		],
		timePosted: "3h",
		comments: [
			{
				id: "1",
				user: {
					name: "John Doe",
					avatar: "/users/john-doe.jpg",
					isOnline: true
				},
				text: "Nice job on the project! I love the natural light and the neutral tones. Do you have any tips for improving the lighting in the room?",
				timeAgo: "2m",
				liked: true
			},
			{
				id: "2",
				user: {
					name: "Jane Smith",
					avatar: "/users/jane-smith.jpg"
				},
				text: "Great job on the project! I love the natural light and the neutral tones. Do you have any tips for improving the lighting in the room?",
				timeAgo: "1h",
				liked: false
			},
			{
				id: "3",
				user: {
					name: "Mike Johnson",
					avatar: "/users/mike-johnson.jpg"
				},
				text: "Great job on the project! I love the natural light and the neutral tones. Do you have any tips for improving the lighting in the room?",
				timeAgo: "2h",
				liked: true
			}
		]
	},
	{
		id: "2",
		type: "video",
		username: "Mike Chen",
		handle: "chefmikechen",
		profileImage: "/users/mike-chen.jpg",
		backgroundImage: "/posts/cooking-thumbnail.jpg",
		videoSrc: "/posts/ramen-recipe.mp4",
		content:
			"The secret to perfect tonkotsu ramen! � Been perfecting this recipe for months. Full recipe in bio! #Cooking",
		likes: "89.4K",
		shares: "12.3K",
		bookmarks: "15.2K",
		commentMetric: "3.4K",
		hashtags: [
			"cooking",
			"foodie",
			"ramen",
			"recipe",
			"chefsofinstagram"
		],
		timePosted: "5h",
		comments: [
			{
				id: "1",
				user: {
					name: "John Doe",
					avatar: "/users/john-doe.jpg",
					isOnline: true
				},
				text: "Nice job on the project! I love the natural light and the neutral tones. Do you have any tips for improving the lighting in the room?",
				timeAgo: "2m",
				liked: true
			},
			{
				id: "2",
				user: {
					name: "Jane Smith",
					avatar: "/users/jane-smith.jpg"
				},
				text: "Great job on the project! I love the natural light and the neutral tones. Do you have any tips for improving the lighting in the room?",
				timeAgo: "1h",
				liked: false
			},
			{
				id: "3",
				user: {
					name: "Mike Johnson",
					avatar: "/users/mike-johnson.jpg"
				},
				text: "Great job on the project! I love the natural light and the neutral tones. Do you have any tips for improving the lighting in the room?",
				timeAgo: "2h",
				liked: true
			}
		]
	},
	{
		id: "3",
		type: "text",
		username: "Sarah Johnson",
		handle: "sarahcodes",
		profileImage: "/users/sarah-johnson.jpeg",
		content:
			"🎉 Big news! After 6 months of hard work, we've just open-sourced our React state management library. Already 2.5k stars on GitHub in just 24 hours! Check it out: github.com/statex/react\n\nProud of what our small team has accomplished. Threading some key features below... 🧵",
		likes: "3.1K",
		shares: "945",
		bookmarks: "721",
		commentMetric: "234",
		hashtags: [
			"opensource",
			"reactjs",
			"javascript",
			"webdev",
			"programming"
		],
		timePosted: "1h",
		comments: [
			{
				id: "1",
				user: {
					name: "John Doe",
					avatar: "/users/john-doe.jpg",
					isOnline: true
				},
				text: "Nice job on the project! I love the natural light and the neutral tones. Do you have any tips for improving the lighting in the room?",
				timeAgo: "2m",
				liked: true
			},
			{
				id: "2",
				user: {
					name: "Jane Smith",
					avatar: "/users/jane-smith.jpg"
				},
				text: "Great job on the project! I love the natural light and the neutral tones. Do you have any tips for improving the lighting in the room?",
				timeAgo: "1h",
				liked: false
			},
			{
				id: "3",
				user: {
					name: "Mike Johnson",
					avatar: "/users/mike-johnson.jpg"
				},
				text: "Great job on the project! I love the natural light and the neutral tones. Do you have any tips for improving the lighting in the room?",
				timeAgo: "2h",
				liked: true
			}
		]
	},
	{
		id: "4",
		type: "image",
		username: "Alex Rivera",
		handle: "arivera.photo",
		profileImage: "/users/alex-rivera.jpg",
		backgroundImage:
			"/posts/street-photography-4x5.jpg",
		content:
			"Rainy evening in Tokyo. The neon lights reflecting off the wet streets create such a cyberpunk atmosphere. Shot on Sony A7IV, 35mm f/1.4 📸",
		likes: "12.5K",
		shares: "2.8K",
		bookmarks: "1.9K",
		commentMetric: "428",
		hashtags: [
			"photography",
			"tokyo",
			"streetphotography",
			"nightlife",
			"urban"
		],
		timePosted: "8h",
		comments: [
			{
				id: "1",
				user: {
					name: "John Doe",
					avatar: "/users/john-doe.jpg",
					isOnline: true
				},
				text: "Nice job on the project! I love the natural light and the neutral tones. Do you have any tips for improving the lighting in the room?",
				timeAgo: "2m",
				liked: true
			},
			{
				id: "2",
				user: {
					name: "Jane Smith",
					avatar: "/users/jane-smith.jpg"
				},
				text: "Great job on the project! I love the natural light and the neutral tones. Do you have any tips for improving the lighting in the room?",
				timeAgo: "1h",
				liked: false
			},
			{
				id: "3",
				user: {
					name: "Mike Johnson",
					avatar: "/users/mike-johnson.jpg"
				},
				text: "Great job on the project! I love the natural light and the neutral tones. Do you have any tips for improving the lighting in the room?",
				timeAgo: "2h",
				liked: true
			}
		]
	},
	{
		id: "5",
		type: "text",
		username: "Dr. Emily Carter",
		handle: "dr_carter",
		profileImage: "/users/emily-carter.jpg",
		content:
			"Just published our research on AI-assisted cancer detection in Nature Medicine! Our model achieved 94% accuracy, potentially reducing diagnostic time by 60%.\n\nThank you to my amazing team and all the healthcare workers who helped validate the results. 🧬🔬\n\nLink to paper: nature.com/articles/s41591...",
		likes: "15.7K",
		shares: "8.9K",
		bookmarks: "6.2K",
		commentMetric: "892",
		hashtags: [
			"science",
			"AI",
			"healthcare",
			"research",
			"medicine"
		],
		timePosted: "12h",
		comments: [
			{
				id: "1",
				user: {
					name: "John Doe",
					avatar: "/users/john-doe.jpg",
					isOnline: true
				},
				text: "Nice job on the project! I love the natural light and the neutral tones. Do you have any tips for improving the lighting in the room?",
				timeAgo: "2m",
				liked: true
			},
			{
				id: "2",
				user: {
					name: "Jane Smith",
					avatar: "/users/jane-smith.jpg"
				},
				text: "Great job on the project! I love the natural light and the neutral tones. Do you have any tips for improving the lighting in the room?",
				timeAgo: "1h",
				liked: false
			},
			{
				id: "3",
				user: {
					name: "Mike Johnson",
					avatar: "/users/mike-johnson.jpg"
				},
				text: "Great job on the project! I love the natural light and the neutral tones. Do you have any tips for improving the lighting in the room?",
				timeAgo: "2h",
				liked: true
			}
		]
	}
];

export const usersStories: UserStoryGroup[] = [
	{
		userId: "u1",
		username: "mich_dev",
		avatarUrl: "/avatars/mich.jpeg",
		stories: [
			{
				id: "s1",
				userId: "u1",
				mediaUrl: "/stories/u1/story1.mp4",
				mediaType: "video",
				duration: 5,
				postedAt: "2025-09-10T08:30:00Z",
				expiresAt: "2025-09-11T08:30:00Z",
				seen: true
			},
			{
				id: "s2",
				userId: "u1",
				mediaUrl: "/stories/u1/story2.mp4",
				mediaType: "video",
				duration: 12,
				postedAt: "2025-09-10T09:15:00Z",
				expiresAt: "2025-09-11T09:15:00Z",
				seen: true
			},
			{
				id: "s3",
				userId: "u1",
				mediaUrl: "/stories/u1/story3.jpg",
				mediaType: "image",
				duration: 12,
				postedAt: "2025-09-10T09:15:00Z",
				expiresAt: "2025-09-11T09:15:00Z",
				seen: true
			},
			{
				id: "s4",
				userId: "u1",
				mediaUrl: "/stories/u1/story4.jpg",
				mediaType: "image",
				duration: 12,
				postedAt: "2025-09-10T09:15:00Z",
				expiresAt: "2025-09-11T09:15:00Z",
				seen: true
			}
		]
	},
	{
		userId: "u2",
		username: "blessing",
		avatarUrl: "/avatars/blessing.png",
		stories: [
			{
				id: "s3",
				userId: "u2",
				mediaUrl: "/stories/u2/story1.mp4",
				mediaType: "video",
				duration: 15,
				postedAt: "2025-09-10T10:00:00Z",
				expiresAt: "2025-09-11T10:00:00Z",
				seen: true
			}
		]
	},
	{
		userId: "u3",
		username: "tunde",
		avatarUrl: "/avatars/tunde.png",
		stories: [
			{
				id: "s4",
				userId: "u3",
				mediaUrl: "/stories/u3/story1.jpg",
				mediaType: "image",
				duration: 6,
				postedAt: "2025-09-09T22:00:00Z",
				expiresAt: "2025-09-10T22:00:00Z",
				seen: false
			},
			{
				id: "s5",
				userId: "u3",
				mediaUrl: "/stories/u3/story2.mp4",
				mediaType: "video",
				duration: 10,
				postedAt: "2025-09-10T06:30:00Z",
				expiresAt: "2025-09-11T06:30:00Z",
				seen: false
			}
		]
	},
	{
		userId: "u4",
		username: "amara",
		avatarUrl: "/avatars/amara.png",
		stories: [
			{
				id: "s6",
				userId: "u4",
				mediaUrl: "/stories/u4/story1.jpg",
				mediaType: "image",
				duration: 7,
				postedAt: "2025-09-10T12:00:00Z",
				expiresAt: "2025-09-11T12:00:00Z",
				seen: false
			}
		]
	},
	{
		userId: "u5",
		username: "chioma",
		avatarUrl: "/avatars/chioma.png",
		stories: [
			{
				id: "s7",
				userId: "u5",
				mediaUrl: "/stories/u5/story1.mp4",
				mediaType: "video",
				duration: 20,
				postedAt: "2025-09-10T11:45:00Z",
				expiresAt: "2025-09-11T11:45:00Z",
				seen: false
			},
			{
				id: "s8",
				userId: "u5",
				mediaUrl: "/stories/u5/story2.jpg",
				mediaType: "image",
				duration: 5,
				postedAt: "2025-09-10T12:30:00Z",
				expiresAt: "2025-09-11T12:30:00Z",
				seen: false
			}
		]
	},
	{
		userId: "u6",
		username: "david",
		avatarUrl: "/avatars/david.png",
		stories: [
			{
				id: "s9",
				userId: "u6",
				mediaUrl: "/stories/u6/story1.jpg",
				mediaType: "image",
				duration: 6,
				postedAt: "2025-09-10T07:20:00Z",
				expiresAt: "2025-09-11T07:20:00Z",
				seen: true
			}
		]
	},
	{
		userId: "u7",
		username: "zainab",
		avatarUrl: "/avatars/zainab.png",
		stories: [
			{
				id: "s10",
				userId: "u7",
				mediaUrl: "/stories/u7/story1.mp4",
				mediaType: "video",
				duration: 18,
				postedAt: "2025-09-10T13:00:00Z",
				expiresAt: "2025-09-11T13:00:00Z",
				seen: true
			},
			{
				id: "s11",
				userId: "u7",
				mediaUrl: "/stories/u7/story2.jpg",
				mediaType: "image",
				duration: 4,
				postedAt: "2025-09-10T13:30:00Z",
				expiresAt: "2025-09-11T13:30:00Z",
				seen: false
			}
		]
	}
];
