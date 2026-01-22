"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function EditProfilePage() {
  // ==== Form state ====
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [coverPic, setCoverPic] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [touched, setTouched] = useState(false);

  // ==== Derived UI values ====
  const bioRemaining = 276 - bio.length;
  const canSubmit =
    touched &&
    name.trim() !== "" &&
    username.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    bio.length <= 276;

  // ==== Handlers ====
  const handleFileChange =
    (setter: typeof setProfilePic | typeof setCoverPic) => (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      setter(file);
      setTouched(true);
    };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    // In a real app you would send this FormData to your backend.
    const formData = new FormData();
    if (profilePic) formData.append("profilePic", profilePic);
    if (coverPic) formData.append("coverPic", coverPic);
    formData.append("name", name);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("bio", bio);

    console.log("Submitting profile update:", Object.fromEntries(formData));
    alert("Profile updated (demo)");
  };

  // ==== Preview URLs ====
  const profilePreview = profilePic ? URL.createObjectURL(profilePic) : "/users/default-avatar.png";
  const coverPreview = coverPic ? URL.createObjectURL(coverPic) : "/cover.png";

  return (
    <div className="flex flex-col min-h-screen bg-background p-6 max-w-5xl mx-auto">
      {/* Header with back navigation */}
      <div className="flex items-center mb-6">
        <Link href="/settings/account" legacyBehavior>
          <Button variant="ghost" className="p-0 mr-2">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Cover Photo */}
        <Card>
          <CardHeader className="flex flex-col items-center">
            <CardTitle>Cover Photo</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
              <Image
                src={coverPreview}
                alt="Cover preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <Input type="file" accept="image/*" onChange={handleFileChange(setCoverPic)} />
          </CardContent>
        </Card>

        {/* Profile Photo & Details */}
        <Card>
          <CardHeader className="flex flex-col items-center">
            <Avatar className="h-32 w-32 border-4 border-background shadow-sm">
              <AvatarImage src={profilePreview} alt="Profile preview" />
              <AvatarFallback>{name?.charAt(0) ?? "U"}</AvatarFallback>
            </Avatar>
            <CardTitle className="mt-4">Profile Photo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input type="file" accept="image/*" onChange={handleFileChange(setProfilePic)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="flex flex-col space-y-1">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setTouched(true);
                  }}
                  required
                />
              </div>

              {/* Username */}
              <div className="flex flex-col space-y-1">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setTouched(true);
                  }}
                  required
                />
              </div>

              {/* Email (full‑width) */}
              <div className="flex flex-col space-y-1 md:col-span-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setTouched(true);
                  }}
                  required
                />
              </div>
            </div>

            {/* Bio */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="bio" className="text-sm font-medium">
                Bio (max 276 characters)
              </label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => {
                  if (e.target.value.length <= 276) {
                    setBio(e.target.value);
                    setTouched(true);
                  }
                }}
                rows={4}
                placeholder="Tell us a little about yourself..."
              />
              <p className="text-sm text-muted-foreground text-right">
                {bioRemaining} characters remaining
              </p>
            </div>

            <Button type="submit" disabled={!canSubmit} className="self-end">
              Update Changes
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
