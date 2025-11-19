import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FeedPost } from "@/types/post";
import { Comment } from "@/types/comment";

interface PostState {
	posts: FeedPost[];
	selectedPost: FeedPost | null;
	likedPosts: Set<string>;
	bookmarkedPosts: Set<string>;

	// Actions
	setPosts: (posts: FeedPost[]) => void;
	setSelectedPost: (post: FeedPost | null) => void;
	updatePost: (id: string, updates: Partial<FeedPost>) => void;
	toggleLike: (postId: string) => void;
	toggleBookmark?: (postId: string) => void;
	incrementComment: (postId: string) => void;
	incrementShare?: (postId: string) => void;
	addComment: (postId: string, comment: Comment) => void;
}

export const usePostsStore = create<PostState>()(
	persist(
		(set) => ({
			posts: [],
			selectedPost: null,
			likedPosts: new Set(),
			bookmarkedPosts: new Set(),

			setPosts: (posts) => set({ posts }),

			setSelectedPost: (post) => set({ selectedPost: post }),

			updatePost: (id, updates) =>
				set((state) => ({
					posts: state.posts.map((post) =>
						post._id === id ? { ...post, ...updates } : post
					),
					selectedPost:
						state.selectedPost?._id === id
							? { ...state.selectedPost, ...updates }
							: state.selectedPost
				})),

			toggleLike: (postId) =>
				set((state) => {
					const isLiked = state.likedPosts.has(postId);
					const newLikedPosts = new Set(state.likedPosts);

					if (isLiked) {
						newLikedPosts.delete(postId);
					} else {
						newLikedPosts.add(postId);
					}

					const updatePostLikes = (post: FeedPost) => {
						if (post._id === postId) {
							const currentLikes = Number(post.likesCount) || 0;
							return {
								...post,
								likes: isLiked
									? String(Math.max(0, currentLikes - 1))
									: String(currentLikes + 1)
							};
						}
						return post;
					};

					return {
						likedPosts: newLikedPosts,
						posts: state.posts.map(updatePostLikes),
						selectedPost: state.selectedPost ? updatePostLikes(state.selectedPost) : null
					};
				}),

			// toggleBookmark: (postId) =>
			// 	set((state) => {
			// 		const isBookmarked = state.bookmarkedPosts.has(postId);
			// 		const newBookmarkedPosts = new Set(state.bookmarkedPosts);

			// 		if (isBookmarked) {
			// 			newBookmarkedPosts.delete(postId);
			// 		} else {
			// 			newBookmarkedPosts.add(postId);
			// 		}

			// 		const updatePostBookmarks = (post: FeedPost) => {
			// 			if (post._id === postId) {
			// 				const currentBookmarks = Number(post.bookmarks) || 0;
			// 				return {
			// 					...post,
			// 					bookmarks: isBookmarked
			// 						? String(Math.max(0, currentBookmarks - 1))
			// 						: String(currentBookmarks + 1)
			// 				};
			// 			}
			// 			return post;
			// 		};

			// 		return {
			// 			bookmarkedPosts: newBookmarkedPosts,
			// 			posts: state.posts.map(updatePostBookmarks),
			// 			selectedPost: state.selectedPost
			// 				? updatePostBookmarks(state.selectedPost)
			// 				: null
			// 		};
			// 	}),

			incrementComment: (postId) =>
				set((state) => {
					const updatePostComments = (post: FeedPost) => {
						if (post._id === postId) {
							const currentComments = Number(post.comments) || 0;
							return {
								...post,
								commentMetric: String(currentComments + 1)
							};
						}
						return post;
					};

					return {
						posts: state.posts.map(updatePostComments),
						selectedPost: state.selectedPost
							? updatePostComments(state.selectedPost)
							: null
					};
				}),

			// incrementShare: (postId) =>
			// 	set((state) => {
			// 		const updatePostShares = (post: FeedPost) => {
			// 			if (post._id === postId) {
			// 				const currentShares = Number(post.shares) || 0;
			// 				return {
			// 					...post,
			// 					shares: String(currentShares + 1)
			// 				};
			// 			}
			// 			return post;
			// 		};

			// 		return {
			// 			posts: state.posts.map(updatePostShares),
			// 			selectedPost: state.selectedPost ? updatePostShares(state.selectedPost) : null
			// 		};
			// 	}),

			addComment: (postId, comment) =>
				set((state) => {
					const updatePostWithComment = (post: FeedPost) => {
						if (post._id === postId) {
							const currentComments = post.comments || [];
							const currentCommentCount = Number(post.commentsCount) || 0;
							return {
								...post,
								comments: [...currentComments, comment],
								commentMetric: String(currentCommentCount + 1)
							};
						}
						return post;
					};

					return {
						posts: state.posts.map(updatePostWithComment),
						selectedPost: state.selectedPost
							? updatePostWithComment(state.selectedPost)
							: null
					};
				})
		}),
		{
			name: "posts-storage",
			partialize: (state) => ({
				likedPosts: Array.from(state.likedPosts),
				bookmarkedPosts: Array.from(state.bookmarkedPosts)
			}),
			storage: {
				getItem: (name) => {
					const str = localStorage.getItem(name);
					if (!str) return null;
					const parsed = JSON.parse(str);
					return {
						...parsed,
						state: {
							...parsed.state,
							likedPosts: new Set(parsed.state?.likedPosts || []),
							bookmarkedPosts: new Set(parsed.state?.bookmarkedPosts || [])
						}
					};
				},
				setItem: (name, value) => {
					localStorage.setItem(name, JSON.stringify(value));
				},
				removeItem: (name) => localStorage.removeItem(name)
			}
		}
	)
);
