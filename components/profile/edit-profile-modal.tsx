"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Camera, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/components/shared/user-context";
import { useEffect } from "react";
import { Switch } from "@/components/ui/switch";

interface UserProfile {
  name: string;
  username: string;
  bio: string;
  profilePicture: string;
  coverPicture?: string;
  email: string;
  location?: string;
  blueTick?: boolean;
  goldenTick?: boolean;
  prideTick?: boolean;
  businessTick?: boolean;
  subscriptionStatus?: string;
}

interface EditProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileModal({ user, isOpen, onOpenChange }: EditProfileModalProps) {
  const router = useRouter();
  const { refreshUser } = useUser();
  const [username, setUsername] = useState(user.username || "");
  const [bio, setBio] = useState(user.bio || "");
  const [location, setLocation] = useState(user.location || "");
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [coverPicFile, setCoverPicFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [prideTick, setPrideTick] = useState<boolean>(!!user.prideTick);
  const [businessTick, setBusinessTick] = useState<boolean>(!!user.businessTick);

  useEffect(() => {
    if (isOpen) {
      setUsername(user.username || "");
      setBio(user.bio || "");
      setLocation(user.location || "");
      setPrideTick(!!user.prideTick);
      setBusinessTick(!!user.businessTick);
    }
  }, [isOpen, user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'profile') {
        setProfilePicFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setCoverPicFile(file);
        setCoverPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      let newProfilePicUrl = "";
      let newCoverPicUrl = "";

      // 1. Upload profile picture if changed
      if (profilePicFile) {
        const formData = new FormData();
        formData.append("image", profilePicFile);

        const uploadRes = await fetch("/api/users/profile-picture", {
          method: "PUT",
          body: formData, 
        });

        if (!uploadRes.ok) {
           const errorData = await uploadRes.json().catch(() => ({}));
           throw new Error(errorData.message || "Failed to upload profile picture");
        }
        
        const data = await uploadRes.json();
        // Assuming the backend returns the updated user object or the url directly
        newProfilePicUrl = data.profilePicture || data.url || data.avatar || "";
      }

      // 2. Upload cover picture if changed
      if (coverPicFile) {
        try {
          const formData = new FormData();
          formData.append("image", coverPicFile);

          const uploadRes = await fetch("/api/users/cover-picture", {
            method: "PUT",
            body: formData, 
          });

          if (!uploadRes.ok) {
             const errorData = await uploadRes.json().catch(() => ({}));
             console.error("Cover upload failed:", errorData);
             toast.error("Cover picture upload failed: Endpoint not found on server.");
             // We continue execution so at least profile text/avatar changes are saved
          } else {
             const data = await uploadRes.json();
             newCoverPicUrl = data.coverPicture || data.coverPic || data.url || "";
          }
        } catch (error) {
           console.error("Cover picture upload error:", error);
           toast.error("Failed to upload cover picture");
        }
      }

      // 3. Update text fields and image URLs
      const updatePayload: any = {
        username,
        bio,
        location,
      };

      if (user.subscriptionStatus === "active") {
        updatePayload.prideTick = prideTick;
        updatePayload.businessTick = businessTick;
      }
      
      if (newProfilePicUrl) updatePayload.profilePic = newProfilePicUrl;
      if (newCoverPicUrl) updatePayload.coverPic = newCoverPicUrl;
      
      const updateRes = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      });

      if (!updateRes.ok) {
        const errorData = await updateRes.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update profile info");
      }

      toast.success("Profile updated successfully");
      await refreshUser(); // Update client-side context
      router.refresh(); // Update server components
      onOpenChange(false);
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Cover Picture Section */}
          <div className="flex flex-col gap-2">
             <div 
               className="relative w-full h-32 rounded-lg bg-muted overflow-hidden group cursor-pointer border-2 border-border border-dashed flex items-center justify-center"
               onClick={() => coverInputRef.current?.click()}
             >
                {(coverPreviewUrl || user.coverPicture) ? (
                  <img 
                    src={coverPreviewUrl || user.coverPicture} 
                    alt="Cover" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-muted-foreground text-sm">No Cover Photo</span>
                )}
                
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Camera className="h-6 w-6 text-white" />
                </div>
             </div>
             <Input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'cover')}
              />
              <p className="text-xs text-muted-foreground text-center">Click to change cover photo</p>
          </div>

          {/* Profile Picture Section - Overlapping or separate? Keeping it separate for clarity in modal */}
          <div className="flex flex-col items-center gap-4 -mt-8 relative z-10">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={previewUrl || user.profilePicture} className="object-cover" />
                <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </Avatar>
              <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full shadow-sm border-2 border-background">
                  <Upload className="h-3 w-3" />
              </div>
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, 'profile')}
            />
            <p className="text-xs text-muted-foreground">Change profile picture</p>
          </div>

          {/* Text Fields */}
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="@username"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              className="resize-none"
              rows={4}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country"
            />
          </div>

          {user.subscriptionStatus === "active" && (
            <div className="rounded-xl border border-border/60 bg-muted/40 px-4 py-3 space-y-3">
              <p className="text-sm font-medium">Profile badges</p>
              <p className="text-xs text-muted-foreground">
                Choose an additional badge to display on your verified tick if it fits you.
              </p>
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Pride tick</span>
                  <span className="text-xs text-muted-foreground">
                    For members of the pride community.
                  </span>
                </div>
                <Switch
                  checked={prideTick}
                  onCheckedChange={(checked) => {
                    setPrideTick(checked);
                    if (checked) setBusinessTick(false);
                  }}
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Business tick</span>
                  <span className="text-xs text-muted-foreground">
                    For businesses and brands.
                  </span>
                </div>
                <Switch
                  checked={businessTick}
                  onCheckedChange={(checked) => {
                    setBusinessTick(checked);
                    if (checked) setPrideTick(false);
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
