"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { usePostsStore } from "@/features/posts/stores";

interface EditPostDialogProps {
  postId: string;
  currentText: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPostDialog({ 
  postId, 
  currentText, 
  isOpen, 
  onOpenChange 
}: EditPostDialogProps) {
  const [text, setText] = useState(currentText);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { editPost } = usePostsStore();

  // Reset text when dialog opens or currentText changes
  useEffect(() => {
    if (isOpen) {
        setText(currentText);
    }
  }, [isOpen, currentText]);

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error("Post content cannot be empty");
      return;
    }

    if (text === currentText) {
        onOpenChange(false);
        return;
    }

    setIsSubmitting(true);
    try {
      const success = await editPost(postId, text);
      
      if (success) {
        toast.success("Post updated successfully");
        onOpenChange(false);
      } else {
        toast.error("Failed to update post");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Make changes to your post content here.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            className="min-h-[150px] resize-none"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !text.trim() || text === currentText}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
