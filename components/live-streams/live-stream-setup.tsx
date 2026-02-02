"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Mic,
  MicOff,
  Upload,
  X,
  Loader2,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { createLivestream, uploadThumbnail } from "@/lib/livestream-service";
import type { LivestreamCreateData } from "@/types/livestream";
import type { useCamera } from "@/hooks/use-camera";
import { cn } from "@/lib/utils";

interface LiveStreamSetupProps {
  camera: ReturnType<typeof useCamera>;
  onStreamCreated: (streamId: string, data: LivestreamCreateData) => void;
}

const CATEGORIES = [
  "Gaming",
  "Music",
  "Talk Shows",
  "Sports",
  "Education",
  "Creative",
  "Technology",
  "Entertainment",
];

const STREAM_TYPES = ["Public", "Private", "Unlisted"];

export function LiveStreamSetup({
  camera,
  onStreamCreated,
}: LiveStreamSetupProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [streamType, setStreamType] = useState("Public");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleAddTag = () => {
    if (currentTag.trim() && tags.length < 5) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!category) {
      setError("Please select a category");
      return;
    }

    try {
      setIsSubmitting(true);

      const data: LivestreamCreateData = {
        title: title.trim(),
        description: description.trim(),
        category: category.toLowerCase(),
        streamType: streamType.toLowerCase(),
        features: {},
        quality: {
          resolution: "1080p",
          bitrate: "high",
        },
        tags,
        scheduledFor: new Date().toISOString(),
        monetization: {},
      };

      const response = await createLivestream(data);
      console.log("Create livestream response:", response);

      const streamId = response.livestream?._id;

      if (!streamId) {
        console.error("Missing stream ID in response:", response);
        throw new Error("Failed to get stream ID from server");
      }

      // Upload thumbnail if provided
      if (thumbnail) {
        await uploadThumbnail(streamId, thumbnail);
      }

      onStreamCreated(streamId, data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create livestream"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const cameras = camera.devices.filter((d) => d.kind === "videoinput");
  const microphones = camera.devices.filter((d) => d.kind === "audioinput");

  return (
    <div className="relative h-[85vh] w-full overflow-hidden bg-black rounded-xl border border-white/10">
      {/* Camera Feed Background */}
      <div className="absolute inset-0">
        {camera.hasPermission ? (
          <video
            ref={camera.videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
            <div className="text-center text-white">
              <Camera className="mx-auto mb-4 h-16 w-16 opacity-50" />
              <p className="text-lg">Camera access needed</p>
              <p className="mt-2 text-sm opacity-75">
                Please allow camera permissions to continue
              </p>
            </div>
          </div>
        )}

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-black/80" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-4 safe-top">
        <h2 className="text-xl font-semibold text-white">Setup Livestream</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={camera.toggleMute}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-md transition-colors hover:bg-black/60">
            {camera.isMuted ? (
              <MicOff className="h-5 w-5 text-red-400" />
            ) : (
              <Mic className="h-5 w-5 text-white" />
            )}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-md transition-colors hover:bg-black/60">
            <Settings className="h-5 w-5 text-white" />
          </button>
        </div>
      </header>

      {/* Settings Drawer */}
      {showSettings && (
        <div className="absolute inset-x-0 top-16 z-30 mx-4 rounded-[24px] border border-white/20 bg-black/60 p-4 backdrop-blur-xl safe-top">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Camera & Audio</h3>
            <button onClick={() => setShowSettings(false)}>
              <ChevronUp className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-xs text-white/80">Camera</Label>
              <Select
                value={camera.selectedCamera}
                onValueChange={camera.switchCamera}
                disabled={cameras.length === 0}>
                <SelectTrigger className="mt-1 border-white/20 bg-black/40 text-white backdrop-blur-sm">
                  <SelectValue placeholder="Select camera" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20 text-white backdrop-blur-xl">
                  {cameras.map((device) => (
                    <SelectItem key={device.deviceId} value={device.deviceId} className="focus:bg-white/20 focus:text-white">
                      {device.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-white/80">Microphone</Label>
              <Select
                value={camera.selectedMicrophone}
                onValueChange={camera.switchMicrophone}
                disabled={microphones.length === 0}>
                <SelectTrigger className="mt-1 border-white/20 bg-black/40 text-white backdrop-blur-sm">
                  <SelectValue placeholder="Select microphone" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20 text-white backdrop-blur-xl">
                  {microphones.map((device) => (
                    <SelectItem key={device.deviceId} value={device.deviceId} className="focus:bg-white/20 focus:text-white">
                      {device.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Main Form - Centered Overlay */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-10 md:pb-safe-bottom md:safe-bottom">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-lg space-y-3 pb-8">
          {error && (
            <div className="rounded-2xl border border-red-500/50 bg-red-500/20 px-4 py-3 text-sm text-white backdrop-blur-md">
              {error}
            </div>
          )}

          {/* Title Input - Most Prominent */}
          <div className="rounded-2xl border border-white/20 bg-black/40 p-4 backdrop-blur-xl">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your stream a catchy title..."
              className="border-0 bg-transparent text-lg font-semibold text-white placeholder:text-white/50 focus-visible:ring-0"
              required
              maxLength={100}
            />
            <p className="mt-1 text-right text-xs text-white/60">
              {title.length}/100
            </p>
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-white/20 bg-black/40 p-4 backdrop-blur-xl">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers what to expect..."
              className="border-0 bg-transparent text-white placeholder:text-white/50 focus-visible:ring-0"
              rows={2}
              maxLength={500}
            />
            <p className="mt-1 text-right text-xs text-white/60">
              {description.length}/500
            </p>
          </div>

          {/* Category & Stream Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/20 bg-black/40 p-4 backdrop-blur-xl">
              <Label className="mb-2 block text-xs text-white/80">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="border-0 bg-transparent p-0 text-white focus:ring-0">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20 text-white backdrop-blur-xl">
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="focus:bg-white/20 focus:text-white">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-2xl border border-white/20 bg-black/40 p-4 backdrop-blur-xl">
              <Label className="mb-2 block text-xs text-white/80">
                Privacy
              </Label>
              <Select value={streamType} onValueChange={setStreamType}>
                <SelectTrigger className="border-0 bg-transparent p-0 text-white focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20 text-white backdrop-blur-xl">
                  {STREAM_TYPES.map((type) => (
                    <SelectItem key={type} value={type} className="focus:bg-white/20 focus:text-white">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="rounded-2xl border border-white/20 bg-black/40 p-4 backdrop-blur-xl">
            <Label className="mb-2 block text-xs text-white/80">
              Tags (max 5)
            </Label>
            <div className="flex gap-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add a tag..."
                className="border-0 bg-white/10 text-white placeholder:text-white/50 focus-visible:ring-1 focus-visible:ring-white/30"
                disabled={tags.length >= 5}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                disabled={!currentTag.trim() || tags.length >= 5}
                className="shrink-0"
                size="sm">
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer rounded-full bg-white/20 text-white hover:bg-white/30"
                    onClick={() => handleRemoveTag(index)}>
                    #{tag}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail Upload */}
          <div className="rounded-2xl border border-white/20 bg-black/40 p-4 backdrop-blur-xl">
            <Label className="mb-2 block text-xs text-white/80">
              Thumbnail (Optional)
            </Label>
            {thumbnailPreview ? (
              <div className="relative">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="h-24 w-full rounded-lg object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute right-2 top-2 h-8 w-8 rounded-full p-0"
                  onClick={() => {
                    setThumbnail(null);
                    setThumbnailPreview(null);
                  }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label
                htmlFor="thumbnail"
                className="flex h-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-white/30 hover:border-white/50">
                <div className="text-center">
                  <Upload className="mx-auto h-6 w-6 text-white/60" />
                  <p className="mt-1 text-xs text-white/60">Upload image</p>
                </div>
                <input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailChange}
                />
              </label>
            )}
          </div>

          {/* Create Button */}
          <Button
            type="submit"
            size="lg"
            className="h-14 w-full rounded-full text-lg font-semibold shadow-2xl"
            disabled={
              isSubmitting ||
              !camera.hasPermission ||
              !title.trim() ||
              !category
            }>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Stream"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
