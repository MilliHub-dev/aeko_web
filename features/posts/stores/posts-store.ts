import { create } from "zustand";
import { FeedPost } from "@/types/post";
import { Comment } from "@/types/comment";

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

interface PostState {
  posts: FeedPost[];
  selectedPost: FeedPost | null;

  bookmarkedPosts: Set<string>;
  lastFetchedAt: number | null;
  lastAttemptedAt: number | null;
  isFetching: boolean;

  // Actions
  setPosts: (posts: FeedPost[]) => void;
  setSelectedPost: (post: FeedPost | null) => void;
  updatePost: (id: string, updates: Partial<FeedPost>) => void;
  syncPost: (post: FeedPost) => void;
  toggleLike: (postId: string, userId: string) => void;
  toggleBookmark?: (postId: string) => void;
  incrementComment: (postId: string) => void;
  incrementShare?: (postId: string) => void;
  incrementRepost?: (postId: string) => void;
  addComment: (postId: string, comment: Comment) => void;
  setIsFetching: (isFetching: boolean) => void;
  markAttempt: () => void;
  shouldRefetch: () => boolean;
  repost: (postId: string) => Promise<void>;
  shareToStatus: (postId: string, content: string) => Promise<void>;
  fetchBookmarks: () => Promise<void>;
  recordView: (postId: string) => Promise<void>;
}

export const usePostsStore = create<PostState>()(
    (set, get) => ({
      posts: [],
      selectedPost: null,

      bookmarkedPosts: new Set(),
      lastFetchedAt: null,
      lastAttemptedAt: null,
      isFetching: false,

      setPosts: (posts) =>
        set({ posts, lastFetchedAt: Date.now(), isFetching: false }),

      setSelectedPost: (post) => set({ selectedPost: post }),

      updatePost: (id, updates) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post._id === id ? { ...post, ...updates } : post,
          ),
          selectedPost:
            state.selectedPost?._id === id
              ? { ...state.selectedPost, ...updates }
              : state.selectedPost,
        })),

      syncPost: (post) =>
        set((state) => {
          const exists = state.posts.some((p) => p._id === post._id);
          if (exists) {
            return {
              posts: state.posts.map((p) =>
                p._id === post._id ? { ...p, ...post } : p,
              ),
            };
          }
          return {
            posts: [...state.posts, post],
          };
        }),

      toggleLike: async (postId, userId) => {
        const state = get();
        const previousPosts = [...state.posts];
        const previousSelectedPost = state.selectedPost
          ? { ...state.selectedPost }
          : null;

        // Optimistic update
        set((state) => {
          const updatePostLikes = (post: FeedPost) => {
            if (post._id === postId) {
              const currentLikes = post.likes || [];
              const isLiked = currentLikes.includes(userId);
              const newLikes = isLiked
                ? currentLikes.filter((id) => id !== userId)
                : [...currentLikes, userId];

              return {
                ...post,
                likes: newLikes,
                likesCount: newLikes.length,
              };
            }
            return post;
          };

          return {
            posts: state.posts.map(updatePostLikes),
            selectedPost: state.selectedPost
              ? updatePostLikes(state.selectedPost)
              : null,
          };
        });

        try {
          const response = await fetch(`/api/posts/like/${postId}`, {
            method: "POST",
          });

          if (!response.ok) {
            throw new Error("Failed to toggle like");
          }

          const data = await response.json();
          
          // Update with server data if available
          if (data.post) {
             set((state) => ({
                posts: state.posts.map((p) => 
                  p._id === postId ? { ...p, ...data.post } : p
                ),
                selectedPost: state.selectedPost?._id === postId 
                  ? { ...state.selectedPost, ...data.post }
                  : state.selectedPost
             }));
          }
        } catch (error) {
          console.error("Error toggling like:", error);
          // Revert changes on error
          set({
            posts: previousPosts,
            selectedPost: previousSelectedPost,
          });
        }
      },

      toggleBookmark: async (postId) => {
        const state = get();
        const previousPosts = [...state.posts];
        const previousSelectedPost = state.selectedPost
          ? { ...state.selectedPost }
          : null;
        const previousBookmarkedPosts = new Set(state.bookmarkedPosts);

        // Optimistic update
        set((state) => {
          const isBookmarked = state.bookmarkedPosts.has(postId);
          const newBookmarkedPosts = new Set(state.bookmarkedPosts);

          if (isBookmarked) {
            newBookmarkedPosts.delete(postId);
          } else {
            newBookmarkedPosts.add(postId);
          }

          const updatePostBookmarks = (post: FeedPost) => {
            if (post._id === postId) {
              const currentBookmarks = post.bookmarks || [];
              const newBookmarks = isBookmarked
                ? currentBookmarks.filter(
                    (id) => id !== state.bookmarkedPosts.values().next().value,
                  )
                : [...currentBookmarks, "current-user-id"]; // This will be updated by API response

              return {
                ...post,
                bookmarks: newBookmarks,
                bookmarksCount: newBookmarks.length,
              };
            }
            return post;
          };

          return {
            bookmarkedPosts: newBookmarkedPosts,
            posts: state.posts.map(updatePostBookmarks),
            selectedPost: state.selectedPost
              ? updatePostBookmarks(state.selectedPost)
              : null,
          };
        });

        try {
          const response = await fetch(`/api/posts/${postId}/bookmark`, {
            method: "POST",
          });

          if (!response.ok) {
            throw new Error("Failed to toggle bookmark");
          }

          const data = await response.json();

          // Update with actual data from API
          set((state) => {
            const updatePostWithApiData = (post: FeedPost) => {
              if (post._id === postId) {
                return {
                  ...post,
                  bookmarksCount: data.totalBookmarks || post.bookmarksCount,
                };
              }
              return post;
            };

            return {
              posts: state.posts.map(updatePostWithApiData),
              selectedPost: state.selectedPost
                ? updatePostWithApiData(state.selectedPost)
                : null,
            };
          });
        } catch (error) {
          console.error("Error toggling bookmark:", error);
          // Revert changes on error
          set({
            posts: previousPosts,
            selectedPost: previousSelectedPost,
            bookmarkedPosts: previousBookmarkedPosts,
          });
        }
      },

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

      incrementRepost: (postId) =>
        set((state) => {
          const updatePostReposts = (post: FeedPost) => {
            if (post._id === postId) {
              const currentReposts = post.reposts || [];
              // Since we don't have the full repost object, we just push a placeholder
              // or rely on the length check if reposts is an array of objects
              // The type says reposts: [], so we assume it's an array.
              // We'll just push "optimistic" string if it's string[], or just rely on length update if possible
              // But FeedPost type says reposts: [], which usually implies any[].
              // Let's check type again. FeedPost has reposts: [].
              
              return {
                ...post,
                reposts: [...currentReposts, "optimistic-repost"] as any,
              };
            }
            return post;
          };

          return {
            posts: state.posts.map(updatePostReposts),
            selectedPost: state.selectedPost
              ? updatePostReposts(state.selectedPost)
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

      markAttempt: () => set({ lastAttemptedAt: Date.now() }),

      shouldRefetch: () => {
        const state = get();
        const now = Date.now();
        
        // If last attempt was very recent (e.g. < 5s), don't fetch again to avoid loops
        // Check this FIRST before checking lastFetchedAt to prevent infinite initial retry loops
        if (state.lastAttemptedAt && now - state.lastAttemptedAt < 5000) {
          return false;
        }

        if (!state.lastFetchedAt) return true;
        
        const timeSinceLastFetch = now - state.lastFetchedAt;
        return timeSinceLastFetch > CACHE_DURATION;
      },
      
      repost: async (postId) => {
        const state = get();
        // Optimistic update (increment share count and repost count)
        state.incrementShare?.(postId);
        state.incrementRepost?.(postId);

        try {
          const res = await fetch(`/api/posts/repost/${postId}`, {
            method: "POST",
          });
          if (!res.ok) throw new Error("Failed to repost");
        } catch (error) {
          console.error(error);
          // Revert if needed, though simple share count increment is low risk
        }
      },

      shareToStatus: async (postId: string, content: string) => {
         try {
          const res = await fetch(`/api/posts/${postId}/share-to-status`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ additionalContent: content }),
          });
          if (!res.ok) throw new Error("Failed to share to status");
        } catch (error) {
          console.error(error);
          throw error;
        }
      },

      fetchBookmarks: async () => {
        try {
          const res = await fetch("/api/posts/user/bookmarks");
          if (!res.ok) throw new Error("Failed to fetch bookmarks");
          const data = await res.json();
          // Assuming data.posts is the array of bookmarked posts
          const bookmarkedIds = new Set<string>(data.posts.map((p: any) => p._id));
          set({ bookmarkedPosts: bookmarkedIds });
        } catch (error) {
          console.error("Error fetching bookmarks:", error);
        }
      },

      recordView: async (postId: string) => {
        try {
          // Optimistically update view count?
          // For views, we might not want to optimistically update since it's passive
          // and relies on server-side logic (unique viewers, etc.)
          
          await fetch(`/api/posts/${postId}/view`, {
            method: "POST",
          });
          
          // Optionally, refetch post or update views if response returns new count
          // But usually views are just fire-and-forget for analytics
        } catch (error) {
          console.error("Error recording view:", error);
        }
      },
    })
);
