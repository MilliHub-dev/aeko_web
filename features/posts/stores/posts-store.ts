import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FeedPost } from "@/types/post";
import { Comment } from "@/types/comment";

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

interface PostState {
  posts: FeedPost[];
  selectedPost: FeedPost | null;
  likedPosts: Set<string>;
  bookmarkedPosts: Set<string>;
  lastFetchedAt: number | null;
  isFetching: boolean;

  // Actions
  setPosts: (posts: FeedPost[]) => void;
  setSelectedPost: (post: FeedPost | null) => void;
  updatePost: (id: string, updates: Partial<FeedPost>) => void;
  toggleLike: (postId: string) => void;
  toggleBookmark?: (postId: string) => void;
  incrementComment: (postId: string) => void;
  incrementShare?: (postId: string) => void;
  addComment: (postId: string, comment: Comment) => void;
  setIsFetching: (isFetching: boolean) => void;
  shouldRefetch: () => boolean;
}

export const usePostsStore = create<PostState>()(
  persist(
    (set, get) => ({
      posts: [],
      selectedPost: null,
      likedPosts: new Set(),
      bookmarkedPosts: new Set(),
      lastFetchedAt: null,
      isFetching: false,

      setPosts: (posts) =>
        set({ posts, lastFetchedAt: Date.now(), isFetching: false }),

      setSelectedPost: (post) => set({ selectedPost: post }),

      updatePost: (id, updates) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post._id === id ? { ...post, ...updates } : post
          ),
          selectedPost:
            state.selectedPost?._id === id
              ? { ...state.selectedPost, ...updates }
              : state.selectedPost,
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
              const currentLikes = post.likesCount || 0;
              return {
                ...post,
                likesCount: isLiked
                  ? Math.max(0, currentLikes - 1)
                  : currentLikes + 1,
              };
            }
            return post;
          };

          return {
            likedPosts: newLikedPosts,
            posts: state.posts.map(updatePostLikes),
            selectedPost: state.selectedPost
              ? updatePostLikes(state.selectedPost)
              : null,
          };
        }),

      toggleBookmark: (postId) =>
        set((state) => {
          const isBookmarked = state.bookmarkedPosts.has(postId);
          const newBookmarkedPosts = new Set(state.bookmarkedPosts);

          if (isBookmarked) {
            newBookmarkedPosts.delete(postId);
          } else {
            newBookmarkedPosts.add(postId);
          }

          return {
            bookmarkedPosts: newBookmarkedPosts,
          };
        }),

      incrementShare: (postId) =>
        set((state) => {
          const updatePostShares = (post: FeedPost) => {
            if (post._id === postId) {
              const currentShares = post.engagement?.totalShares || 0;
              return {
                ...post,
                engagement: {
                  ...post.engagement,
                  totalShares: currentShares + 1,
                },
              };
            }
            return post;
          };

          return {
            posts: state.posts.map(updatePostShares),
            selectedPost: state.selectedPost
              ? updatePostShares(state.selectedPost)
              : null,
          };
        }),

      incrementComment: (postId) =>
        set((state) => {
          const updatePostComments = (post: FeedPost) => {
            if (post._id === postId) {
              const currentComments = post.commentsCount || 0;
              return {
                ...post,
                commentsCount: currentComments + 1,
              };
            }
            return post;
          };

          return {
            posts: state.posts.map(updatePostComments),
            selectedPost: state.selectedPost
              ? updatePostComments(state.selectedPost)
              : null,
          };
        }),

      addComment: (postId, comment) =>
        set((state) => {
          const updatePostWithComment = (post: FeedPost) => {
            if (post._id === postId) {
              const currentComments = post.comments || [];
              const currentCommentCount = post.commentsCount || 0;
              return {
                ...post,
                comments: [...currentComments, comment],
                commentsCount: currentCommentCount + 1,
              };
            }
            return post;
          };

          return {
            posts: state.posts.map(updatePostWithComment),
            selectedPost: state.selectedPost
              ? updatePostWithComment(state.selectedPost)
              : null,
          };
        }),

      setIsFetching: (isFetching) => set({ isFetching }),

      shouldRefetch: () => {
        const state = get();
        // Should refetch if:
        // 1. Never fetched before (lastFetchedAt is null)
        // 2. Cache is stale (older than CACHE_DURATION)
        // 3. No posts in store
        if (!state.lastFetchedAt || state.posts.length === 0) {
          return true;
        }
        const now = Date.now();
        const timeSinceLastFetch = now - state.lastFetchedAt;
        return timeSinceLastFetch > CACHE_DURATION;
      },
    }),
    {
      name: "posts-storage",
      partialize: (state) => ({
        likedPosts: Array.from(state.likedPosts),
        bookmarkedPosts: Array.from(state.bookmarkedPosts),
        posts: state.posts,
        lastFetchedAt: state.lastFetchedAt,
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
              bookmarkedPosts: new Set(parsed.state?.bookmarkedPosts || []),
            },
          };
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
