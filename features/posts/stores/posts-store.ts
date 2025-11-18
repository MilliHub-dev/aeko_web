import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PostProps } from "@/types/post";
import { Comment } from "@/types/comment";

interface PostState {
  posts: PostProps[];
  selectedPost: PostProps | null;
  likedPosts: Set<string>;
  bookmarkedPosts: Set<string>;

  // Actions
  setPosts: (posts: PostProps[]) => void;
  setSelectedPost: (post: PostProps | null) => void;
  updatePost: (id: string, updates: Partial<PostProps>) => void;
  toggleLike: (postId: string) => void;
  toggleBookmark: (postId: string) => void;
  incrementComment: (postId: string) => void;
  incrementShare: (postId: string) => void;
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
            post.id === id ? { ...post, ...updates } : post
          ),
          selectedPost:
            state.selectedPost?.id === id
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

          const updatePostLikes = (post: PostProps) => {
            if (post.id === postId) {
              const currentLikes = Number(post.likes) || 0;
              return {
                ...post,
                likes: isLiked
                  ? String(Math.max(0, currentLikes - 1))
                  : String(currentLikes + 1),
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

          const updatePostBookmarks = (post: PostProps) => {
            if (post.id === postId) {
              const currentBookmarks = Number(post.bookmarks) || 0;
              return {
                ...post,
                bookmarks: isBookmarked
                  ? String(Math.max(0, currentBookmarks - 1))
                  : String(currentBookmarks + 1),
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
        }),

      incrementComment: (postId) =>
        set((state) => {
          const updatePostComments = (post: PostProps) => {
            if (post.id === postId) {
              const currentComments = Number(post.commentMetric) || 0;
              return {
                ...post,
                commentMetric: String(currentComments + 1),
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

      incrementShare: (postId) =>
        set((state) => {
          const updatePostShares = (post: PostProps) => {
            if (post.id === postId) {
              const currentShares = Number(post.shares) || 0;
              return {
                ...post,
                shares: String(currentShares + 1),
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

      addComment: (postId, comment) =>
        set((state) => {
          const updatePostWithComment = (post: PostProps) => {
            if (post.id === postId) {
              const currentComments = post.comments || [];
              const currentCommentCount = Number(post.commentMetric) || 0;
              return {
                ...post,
                comments: [...currentComments, comment],
                commentMetric: String(currentCommentCount + 1),
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
    }),
    {
      name: "posts-storage",
      partialize: (state) => ({
        likedPosts: Array.from(state.likedPosts),
        bookmarkedPosts: Array.from(state.bookmarkedPosts),
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
