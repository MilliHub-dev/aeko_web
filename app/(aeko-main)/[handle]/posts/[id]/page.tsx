import { getPost } from "@/lib/get-posts";
import { PostDetailHeader } from "@/components/home/post/post-detail-header";
import { PostDetailText } from "@/components/home/post/post-detail-text";
import { PostDetailMedia } from "@/components/home/post/post-detail-media";
import { PostDetailActions } from "@/components/home/post/post-detail-actions";
import { CommentSection } from "@/components/home/post/post-modal-comment";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ handle: string; id: string }>;
}) {
  const { handle, id } = await params;
  const post = await getPost(handle, id);

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Post not found</h2>
          <p className="text-muted-foreground">
            This post may have been deleted or doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const isMedia = post.type === "image" || post.type === "video";

  return (
    <div className="relative min-h-[100dvh] bg-background">
      {/* Header */}
      <PostDetailHeader 
        postId={post._id}
        authorId={post.user?._id}
        initialPost={post}
      />

      {/* Content (conditional based on type) */}
      <div className="pt-0">
        {isMedia ? (
          <PostDetailMedia
            post={post}
            className="min-h-0 h-[calc(100dvh-4rem)]"
          />
        ) : (
          <div className="mx-auto w-full max-w-3xl px-4 py-4 md:px-6">
            <PostDetailText post={post} />
          </div>
        )}

        {/* Actions Row */}
        <div className="sticky bottom-0 z-50 bg-background border-t border-border">
          <PostDetailActions
            postId={post._id}
            post={post}
            likes={post.likesCount}
            shares={post.engagement?.totalShares || 0}
            bookmarks={0}
            comments={post.commentsCount}
            reposts={post.reposts?.length || 0}
          />
        </div>

        {/* Comments Section */}
        <div className="mx-auto w-full max-w-3xl px-4 py-6 md:px-6">
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          <CommentSection postId={post._id} />
        </div>
      </div>
    </div>
  );
}
