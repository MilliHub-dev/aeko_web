"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SingleCommunityApiResponse } from "@/types/explore";

interface CreateCommunityDialogProps {
  trigger?: React.ReactNode;
}

export function CreateCommunityDialog({ trigger }: CreateCommunityDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setIsPrivate(false);
    setTags([]);
    setTagInput("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Community name is required");
      return;
    }

    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/communities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          isPrivate,
          tags,
        }),
      });

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        // Try to parse error message from response
        let errorMessage = "Failed to create community";
        try {
          const errorData = await response.json();
          // Handle server error response format: { success: false, message: "..." }
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If parsing fails, use status-based message
          errorMessage = `Failed to create community (${response.status})`;
        }
        setError(errorMessage);
        setIsLoading(false); // Stop loading before returning
        return; // Stop execution here if there's an error
      }

      // Parse successful response
      const data: SingleCommunityApiResponse = await response.json();

      // Success - close dialog and navigate to community page
      setOpen(false);
      resetForm();
      router.push(`/communities/${data._id}`);
    } catch (err) {
      console.error("Error creating community:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create community"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full rounded-full text-sm">
            <Plus className="mr-2 h-4 w-4" />
            Create community
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create a Community</DialogTitle>
          <DialogDescription>
            Build a space for people to connect and share ideas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Community Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Community Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Web3 Developers"
              maxLength={50}
              disabled={isLoading}
              className="rounded-xl"
            />
            <p className="text-xs text-muted-foreground">
              {name.length}/50 characters
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is your community about?"
              rows={4}
              maxLength={500}
              disabled={isLoading}
              className="resize-none rounded-xl"
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/500 characters
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (optional)</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a tag and press Enter"
                disabled={isLoading || tags.length >= 5}
                className="rounded-xl"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tags.length >= 5 || isLoading}
                variant="outline"
                size="sm"
                className="shrink-0 rounded-xl">
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="gap-1 rounded-full px-3 py-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      disabled={isLoading}
                      className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {tags.length}/5 tags
            </p>
          </div>

          {/* Privacy */}
          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="privacy" className="text-sm font-medium">
                Private Community
              </Label>
              <p className="text-xs text-muted-foreground">
                Only members can see posts and content
              </p>
            </div>
            <Switch
              id="privacy"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
              disabled={isLoading}
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
              disabled={isLoading}
              className="flex-1 rounded-full">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !name.trim() || !description.trim()}
              className="flex-1 rounded-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Community"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
