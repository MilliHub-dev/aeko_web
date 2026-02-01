"use client";

import { ArrowLeft, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/components/shared/user-context";
import { toast } from "sonner";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose
  } from "@/components/ui/dialog";
import { ReportDialog } from "@/components/report/report-dialog";

interface PostDetailHeaderProps {
  onBack?: () => void;
  postId?: string;
  authorId?: string;
}

export function PostDetailHeader({ onBack, postId, authorId }: PostDetailHeaderProps) {
  const router = useRouter();
  const { user } = useUser();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const isOwner = user && authorId && (user._id === authorId || user.id === authorId);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleDelete = async () => {
      if (!postId) return;
      
      setIsDeleting(true);
      try {
        const res = await fetch(`/api/posts/${postId}`, { 
          method: "DELETE",
        });
        
        if (res.ok) {
          toast.success("Post deleted");
          router.replace("/profile");
        } else {
          toast.error("Failed to delete post");
        }
      } catch (err) {
        console.error("Error deleting post:", err);
        toast.error("Error deleting post");
      } finally {
        setIsDeleting(false);
        setShowDeleteDialog(false);
      }
    };

  const handleNotInterested = async () => {
    if (!postId) return;
    
    try {
        const res = await fetch(`/api/posts/${postId}/not-interested`, {
            method: "POST"
        });
        
        if (res.ok) {
            toast.success("Post marked as not interested");
            router.back(); // Or redirect to home/profile since the post is now hidden/uninteresting
        } else {
            toast.error("Failed to mark as not interested");
        }
    } catch (error) {
        console.error(error);
        toast.error("An error occurred");
    }
  };

  return (
    <>
    <div className="sticky top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Title */}
        <h1 className="text-lg font-semibold">Post</h1>

        {/* More Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full hover:bg-secondary">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Copy link</DropdownMenuItem>
            <DropdownMenuSeparator />
            {isOwner ? (
                <>
                <DropdownMenuItem 
                    className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/20"
                    onClick={() => setShowDeleteDialog(true)}
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete post
                </DropdownMenuItem>
                </>
            ) : (
                <>
                <DropdownMenuItem onClick={() => setIsReportDialogOpen(true)}>
                    Report post
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleNotInterested}>
                    Not interested
                </DropdownMenuItem>
                </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md bg-white text-black z-[9999]">
            <DialogHeader>
                <DialogTitle>Delete Post</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete this post? This action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-end gap-2">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cancel
                    </Button>
                </DialogClose>
                <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete"}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    <ReportDialog 
        isOpen={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        entityId={postId || ""}
        entityType="POST"
        reportedId={authorId}
    />
    </>
  );
}
