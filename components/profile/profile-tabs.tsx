"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, Bookmark, Heart, Loader2, MessageCircle } from "lucide-react";
import { ReAeko } from "@/lib/icons";
import Image from "next/image";
import { FeedPost, PaginatedPostsResponse } from "@/types/post";
import Link from "next/link";

interface ProfileTabsProps {
  userId: string;
  isOwnProfile?: boolean;
}

export function ProfileTabs({ userId, isOwnProfile = false }: ProfileTabsProps) {
  // State for Posts
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [postsPage, setPostsPage] = useState(1);
  const [postsLoading, setPostsLoading] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  // State for Saved
  const [savedPosts, setSavedPosts] = useState<FeedPost[]>([]);
  const [savedPage, setSavedPage] = useState(1);
  const [savedLoading, setSavedLoading] = useState(false);
  const [hasMoreSaved, setHasMoreSaved] = useState(true);

  // State for Likes
  const [likedPosts, setLikedPosts] = useState<FeedPost[]>([]);
  const [likedPage, setLikedPage] = useState(1);
  const [likedLoading, setLikedLoading] = useState(false);
  const [hasMoreLiked, setHasMoreLiked] = useState(true);

  const [activeTab, setActiveTab] = useState("grid");

  const fetchPosts = useCallback(async (page: number) => {
    try {
      setPostsLoading(true);
      const res = await fetch(`/api/posts/user/${userId}?page=${page}&limit=12`);
      const data: PaginatedPostsResponse = await res.json();
      
      if (data.posts) {
        setPosts(prev => page === 1 ? data.posts : [...prev, ...data.posts]);
        setHasMorePosts(data.posts.length > 0 && (data.pagination ? page < data.pagination.pages : false));
      } else {
        setHasMorePosts(false);
      }
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setPostsLoading(false);
    }
  }, [userId]);

  const fetchSaved = useCallback(async (page: number) => {
    try {
      setSavedLoading(true);
      const res = await fetch(`/api/posts/user/bookmarks?page=${page}&limit=12`);
      const data: PaginatedPostsResponse = await res.json();
      
      if (data.posts) {
        setSavedPosts(prev => page === 1 ? data.posts : [...prev, ...data.posts]);
        setHasMoreSaved(data.posts.length > 0 && (data.pagination ? page < data.pagination.pages : false));
      } else {
        setHasMoreSaved(false);
      }
    } catch (error) {
      console.error("Failed to fetch saved posts", error);
    } finally {
      setSavedLoading(false);
    }
  }, []);

  const fetchLiked = useCallback(async (page: number) => {
    try {
      setLikedLoading(true);
      const res = await fetch(`/api/posts/user/liked?page=${page}&limit=12`);
      const data: PaginatedPostsResponse = await res.json();
      
      if (data.posts) {
        setLikedPosts(prev => page === 1 ? data.posts : [...prev, ...data.posts]);
        setHasMoreLiked(data.posts.length > 0 && (data.pagination ? page < data.pagination.pages : false));
      } else {
        setHasMoreLiked(false);
      }
    } catch (error) {
      console.error("Failed to fetch liked posts", error);
    } finally {
      setLikedLoading(false);
    }
  }, []);

  // Initial fetch when tab changes
  useEffect(() => {
    if (activeTab === "grid" && posts.length === 0) {
      fetchPosts(1);
    } else if (activeTab === "saved" && savedPosts.length === 0) {
      fetchSaved(1);
    } else if (activeTab === "likes" && likedPosts.length === 0) {
      fetchLiked(1);
    }
  }, [activeTab, fetchPosts, fetchSaved, fetchLiked, posts.length, savedPosts.length, likedPosts.length]);

  const loadMorePosts = () => {
    const nextPage = postsPage + 1;
    setPostsPage(nextPage);
    fetchPosts(nextPage);
  };

  const loadMoreSaved = () => {
    const nextPage = savedPage + 1;
    setSavedPage(nextPage);
    fetchSaved(nextPage);
  };

  const loadMoreLiked = () => {
    const nextPage = likedPage + 1;
    setLikedPage(nextPage);
    fetchLiked(nextPage);
  };

  const PostGrid = ({ 
    items, 
    loading, 
    hasMore, 
    onLoadMore, 
    emptyMessage, 
    emptyIcon 
  }: { 
    items: FeedPost[], 
    loading: boolean, 
    hasMore: boolean, 
    onLoadMore: () => void,
    emptyMessage: string,
    emptyIcon: React.ReactNode
  }) => {
    if (!loading && items.length === 0) {
       return (
         <div className="flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground p-8">
           <div className="p-4 bg-muted rounded-full">
             {emptyIcon}
           </div>
           <p>{emptyMessage}</p>
         </div>
       );
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-0.5 md:gap-4 md:p-4">
          {items.map((post) => {
             const getMediaSource = () => {
                if (post.mediaUrls && post.mediaUrls.length > 0) return post.mediaUrls[0];
                if (Array.isArray(post.media) && post.media.length > 0) return post.media[0];
                if (typeof post.media === 'string') return post.media;
                return post.mediaUrl;
             };
             const mediaUrl = getMediaSource();
             const isVideo = mediaUrl?.endsWith(".mp4") || mediaUrl?.endsWith(".webm") || mediaUrl?.endsWith(".mov") || post.type === "video";
             
             return (
               <Link
                 href={`/${post.user?.username || 'user'}/posts/${post._id}`}
                 key={post._id}
                 className="relative aspect-[4/5] bg-muted overflow-hidden group cursor-pointer"
               >
                 {mediaUrl ? (
                   isVideo ? (
                     <div className="w-full h-full relative">
                       <video 
                         src={mediaUrl} 
                         className="w-full h-full object-cover" 
                         muted 
                         loop
                         playsInline
                       />
                       <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                         <div className="p-2 bg-black/40 rounded-full backdrop-blur-sm">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                             <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                           </svg>
                         </div>
                       </div>
                     </div>
                   ) : (
                     <Image
                       src={mediaUrl}
                       alt={`Post ${post._id}`}
                       fill
                       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                       className="object-cover hover:scale-105 transition-transform duration-300"
                     />
                   )
                 ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground p-4 text-xs text-center">
                        {post.text || "Text Post"}
                    </div>
                 )}

                 {/* Stats Overlay - Always visible on bottom */}
                 <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-between text-white z-10">
                   <div className="flex items-center gap-4 text-xs font-medium">
                     <div className="flex items-center gap-1">
                       <Heart className="w-4 h-4 fill-white text-white" />
                       <span>{post.likesCount || post.engagement?.totalLikes || 0}</span>
                     </div>
                     <div className="flex items-center gap-1">
                       <MessageCircle className="w-4 h-4 fill-white text-white" />
                       <span>{post.commentsCount || post.engagement?.totalComments || 0}</span>
                     </div>
                     <div className="flex items-center gap-1">
                      <ReAeko className="h-3 w-auto text-white" />
                      <span>{post.engagement?.totalShares || 0}</span>
                    </div>
                   </div>
                 </div>
               </Link>
             );
          })}
        </div>
        {hasMore && (
           <div className="flex justify-center my-4">
             <button 
               onClick={onLoadMore} 
               disabled={loading}
               className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md disabled:opacity-50 flex items-center gap-2"
             >
               {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Load More"}
             </button>
           </div>
        )}
      </div>
    );
  };

  return (
    <Tabs defaultValue="grid" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="w-full flex h-12 p-0 bg-transparent border-b border-border/40">
        <TabsTrigger
          value="grid"
          className="flex-1 h-full bg-none rounded-none border-0 data-[state=active]:border-primary-foreground data-[state=active]:border-b-2 data-[state=active]:shadow-none">
          <LayoutGrid className="h-6 w-6" />
        </TabsTrigger>
        {isOwnProfile && (
          <>
            <TabsTrigger
              value="saved"
              className="flex-1 h-full bg-none rounded-none border-0 data-[state=active]:border-b-2 data-[state=active]:shadow-none">
              <Bookmark className="h-6 w-6" />
            </TabsTrigger>
            <TabsTrigger
              value="likes"
              className="flex-1 h-full bg-none rounded-none border-0 data-[state=active]:border-b-2 data-[state=active]:shadow-none">
              <Heart className="h-6 w-6" />
            </TabsTrigger>
          </>
        )}
      </TabsList>

      <TabsContent value="grid" className="mt-0">
        <PostGrid 
          items={posts} 
          loading={postsLoading} 
          hasMore={hasMorePosts} 
          onLoadMore={loadMorePosts}
          emptyMessage="No posts yet. Share your first moment!"
          emptyIcon={<LayoutGrid className="h-8 w-8" />}
        />
      </TabsContent>

      {isOwnProfile && (
        <>
          <TabsContent value="saved" className="mt-0">
            <PostGrid 
              items={savedPosts} 
              loading={savedLoading} 
              hasMore={hasMoreSaved} 
              onLoadMore={loadMoreSaved}
              emptyMessage="Save posts to view them later"
              emptyIcon={<Bookmark className="h-8 w-8" />}
            />
          </TabsContent>

          <TabsContent value="likes" className="mt-0">
            <PostGrid 
              items={likedPosts} 
              loading={likedLoading} 
              hasMore={hasMoreLiked} 
              onLoadMore={loadMoreLiked}
              emptyMessage="Posts you like will appear here"
              emptyIcon={<Heart className="h-8 w-8" />}
            />
          </TabsContent>
        </>
      )}
    </Tabs>
  );
}
