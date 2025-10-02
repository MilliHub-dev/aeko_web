import { Metric } from "@/components/home/post/post-metric";
import { CommentSection } from "@/components/home/post/post-modal-comment";
import { getPost } from "@/lib/get-posts";
import { ReplyOutline } from "@/lib/icons";
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Share2 } from "lucide-react";
import Link from "next/link";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ handle: string; id: string }>;
}) {
  const { handle, id } = await params;
  const post = await getPost(handle, id);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="bg-background flex flex-col relative min-h-screen">
      {/* Top overlay controls */}
      <div className="absolute top-10 z-20 isolate left-0 w-full flex justify-between py-2 px-6">
        <Link href="/home" className="rounded-full flex items-center justify-center bg-secondary h-12.5 w-12.5 drop-shadow-xl">
          <ReplyOutline />
        </Link>
        <Link href="#" className="rounded-full flex items-center justify-center bg-secondary h-12.5 w-12.5 drop-shadow-xl">
          <MoreHorizontal />
        </Link>
      </div>

      {/* Media or text section */}
      {post.type === "text" && (
        <div className="relative w-full min-w-[100vw] mt-30 py-4 px-6 space-y-4 border-b border-border">
          <div className="space-y-3">
            <p className="text-xl leading-relaxed">{post.content}</p>
            <div className="flex flex-wrap gap-2">
              {post.hashtags?.map((tag, i) => (
                <span key={i} className="text-primary hover:underline cursor-pointer text-lg">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between gap-x-6 pt-2 text-foreground">
            <Metric icon={<Heart className="w-6 h-6" />} value={post.likes!} />
            <Metric icon={<Share2 className="w-6 h-6" />} value={post.shares!} />
            <Metric icon={<Bookmark className="w-6 h-6" />} value={post.bookmarks!} />
            <Metric icon={<MessageCircle className="w-6 h-6" />} value={post.commentMetric!} />
          </div>
        </div>
      )}

      {post.type === "image" && post.backgroundImage && (
        <div className="h-screen">
          <img src={post.backgroundImage} alt="Post media" className="w-full h-full object-cover" />
        </div>
      )}

      {post.type === "video" && post.videoSrc && (
        <div className="h-screen">
          <video
            src={post.videoSrc}
            className="min-w-[100vw] h-full object-cover"
            autoPlay
            poster={post.backgroundImage}
            loop
            muted
          />
        </div>
      )}

      {/* Comments Section */}
      <div className="w-full max-w-screen-sm mx-auto px-6 py-6">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <CommentSection postId={post.id} />
      </div>
    </div>
  );
}

