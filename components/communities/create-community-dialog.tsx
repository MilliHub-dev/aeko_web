"use client";

import { useState, useEffect, useRef } from "react";
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
import { Plus, Loader2, X, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SingleCommunityApiResponse } from "@/types/explore";
import { toast } from "sonner";

interface CreateCommunityDialogProps {
  trigger?: React.ReactNode;
}

export function CreateCommunityDialog({ trigger }: CreateCommunityDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasGoldenTick, setHasGoldenTick] = useState(false);
  const [hasTwoFactor, setHasTwoFactor] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Check for Golden Tick when dialog opens
  useEffect(() => {
    if (open) {
      checkUserStatus();
    }
  }, [open]);

  const checkUserStatus = async () => {
    setIsCheckingUser(true);
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        // Check both direct property and nested user property
        const user = data.user || data;
        setHasGoldenTick(!!user?.goldenTick);
        setHasTwoFactor(!!user?.twoFactorAuth?.isEnabled || !!user?.twoFactorEnabled);
      }
    } catch (err) {
      console.error("Failed to check user status:", err);
    } finally {
      setIsCheckingUser(false);
    }
  };

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
    setIsPaid(false);
    setPrice("");
    setTags([]);
    setTagInput("");
    setAvatarFile(null);
    setCoverFile(null);
    setAvatarPreviewUrl(null);
    setCoverPreviewUrl(null);
    setError(null);
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover"
  ) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    if (type === "avatar") {
      setAvatarFile(file);
      setAvatarPreviewUrl(previewUrl);
    } else {
      setCoverFile(file);
      setCoverPreviewUrl(previewUrl);
    }
  };

  const uploadCommunityPhoto = async (
    communityId: string,
    type: "avatar" | "cover",
    file: File
  ) => {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("photo", file);
    const res = await fetch(`/api/community-profiles/${communityId}/upload-photo`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.error || `Failed to upload ${type}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasGoldenTick) return;
    if (!hasTwoFactor) {
      setError("Two-factor authentication (2FA) is required to create a community");
      return;
    }

    if (!name.trim()) {
      setError("Community name is required");
      return;
    }

    if (name.trim().length < 3) {
      setError("Community name must be at least 3 characters");
      return;
    }

    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    if (description.trim().length < 10) {
      setError("Description must be at least 10 characters");
      return;
    }

    if (isPaid && (!price || parseFloat(price) <= 0)) {
      setError("Please enter a valid price for paid community");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        isPrivate,
        tags,
        settings: {
          payment: {
            isPaidCommunity: isPaid,
            price: isPaid ? parseFloat(price) : 0,
            currency: "USD", // Default to USD for now
            subscriptionType: "monthly",
          }
        }
      };

      const response = await fetch("/api/communities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        // Try to parse error message from response
        let errorMessage = "Failed to create community";
        try {
          const errorData = await response.json();
          // Handle server error response format: { success: false, message: "..." }
          errorMessage =
            errorData.message ||
            errorData.error ||
            errorData?.details?.message ||
            errorMessage;

          if (errorData?.details?.fieldErrors && typeof errorData.details.fieldErrors === "object") {
            const entries = Object.entries(errorData.details.fieldErrors) as Array<
              [string, string[]]
            >;
            const flat = entries
              .flatMap(([field, messages]) =>
                (messages || []).map((msg) => `${field}: ${msg}`)
              )
              .filter(Boolean);
            if (flat.length > 0) {
              errorMessage = flat.slice(0, 5).join(" • ");
            }
          }
        } catch {
          // If parsing fails, use status-based message
          errorMessage = `Failed to create community (${response.status})`;
        }
        setError(errorMessage);
        setIsLoading(false); // Stop loading before returning
        return; // Stop execution here if there's an error
      }

      // Parse successful response
      const raw = await response.json();
      const community: SingleCommunityApiResponse =
        raw?.data || raw?.community || raw;
      const communityId =
        community?._id ||
        (community as any)?.id ||
        raw?._id ||
        raw?.id ||
        raw?.data?._id ||
        raw?.data?.id;

      if (!communityId) {
        throw new Error("Community created, but no community id was returned");
      }

      try {
        if (coverFile) {
          await uploadCommunityPhoto(communityId, "cover", coverFile);
        }
        if (avatarFile) {
          await uploadCommunityPhoto(communityId, "avatar", avatarFile);
        }
      } catch (uploadError) {
        toast.error(
          uploadError instanceof Error
            ? uploadError.message
            : "Failed to upload community photos"
        );
      }

      // Success - close dialog and navigate to community page
      setOpen(false);
      resetForm();
      router.push(`/communities/${communityId}`);
      router.refresh();
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

        {isCheckingUser ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Checking eligibility...</p>
          </div>
        ) : !hasGoldenTick ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 rounded-full bg-amber-100 p-4 dark:bg-amber-900/20">
              <Crown className="h-10 w-10 text-amber-500" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Verified Users Only</h3>
            <p className="mb-6 max-w-xs text-sm text-muted-foreground">
              Community creation is currently available only to users with a Golden Tick.
            </p>
            <Button onClick={() => setOpen(false)} variant="outline">
              Close
            </Button>
          </div>
        ) : !hasTwoFactor ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 rounded-full bg-amber-100 p-4 dark:bg-amber-900/20">
              <Crown className="h-10 w-10 text-amber-500" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">2FA Required</h3>
            <p className="mb-6 max-w-xs text-sm text-muted-foreground">
              Enable two-factor authentication (2FA) to create a community.
            </p>
            <Button onClick={() => setOpen(false)} variant="outline">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div
                className="relative h-32 w-full overflow-hidden rounded-xl border border-border/60 bg-muted/40 cursor-pointer"
                onClick={() => coverInputRef.current?.click()}
              >
                {coverPreviewUrl ? (
                  <img
                    src={coverPreviewUrl}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                    Add community banner
                  </div>
                )}
              </div>
              <Input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e, "cover")}
                disabled={isLoading}
              />

              <div className="flex items-center gap-4">
                <div
                  className="relative h-16 w-16 overflow-hidden rounded-full border border-border/60 bg-muted/40 cursor-pointer"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  {avatarPreviewUrl ? (
                    <img
                      src={avatarPreviewUrl}
                      alt="Avatar preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      Add photo
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Community profile picture
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Upload a logo/avatar and a banner image.
                  </p>
                </div>
              </div>
              <Input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e, "avatar")}
                disabled={isLoading}
              />
            </div>

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
                  variant="secondary"
                  onClick={handleAddTag}
                  disabled={isLoading || !tagInput.trim() || tags.length >= 5}
                  className="rounded-xl"
                >
                  Add
                </Button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1 rounded-md px-2 py-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {tag}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Maximum 5 tags
              </p>
            </div>

            {/* Privacy & Payment Settings */}
            <div className="space-y-4 rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Private Community</Label>
                  <p className="text-xs text-muted-foreground">
                    Only members can see posts and join
                  </p>
                </div>
                <Switch
                  checked={isPrivate}
                  onCheckedChange={setIsPrivate}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label className="text-base">Paid Membership</Label>
                    <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/50">Premium</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Users must pay to join
                  </p>
                </div>
                <Switch
                  checked={isPaid}
                  onCheckedChange={setIsPaid}
                  disabled={isLoading}
                />
              </div>

              {isPaid && (
                <div className="animate-in fade-in slide-in-from-top-2 pt-2">
                  <Label htmlFor="price">Monthly Subscription Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="9.99"
                    className="mt-1.5 rounded-xl"
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="rounded-xl bg-primary hover:bg-primary/90"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Community
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
