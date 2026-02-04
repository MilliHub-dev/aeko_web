"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, UserPen, Camera, Upload } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

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
    <div className="flex flex-col min-h-screen bg-background px-4 py-8 md:px-8 max-w-7xl mx-auto w-full">
      {/* Header with back navigation */}
      <div className="flex items-center mb-8 gap-4">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" asChild>
          <Link href="/settings/account">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Profile</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Update your public profile information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 max-w-4xl mx-auto w-full">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <UserPen className="w-5 h-5" />
              </div>
              <CardTitle>Profile Details</CardTitle>
            </div>
            <CardDescription>Customize how you appear to others</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Images Section */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Cover Photo</Label>
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted group cursor-pointer border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-colors">
                  <Image
                    src={coverPreview}
                    alt="Cover preview"
                    fill
                    className="object-cover transition-opacity group-hover:opacity-75"
                    unoptimized
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                     <Camera className="w-8 h-8 text-white drop-shadow-md" />
                  </div>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange(setCoverPic)} 
                    className="absolute inset-0 opacity-0 cursor-pointer h-full" 
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                    <AvatarImage src={profilePreview} alt="Profile preview" />
                    <AvatarFallback className="text-xl">{name?.charAt(0) ?? "U"}</AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 cursor-pointer">
                    <Camera className="w-6 h-6 text-white drop-shadow-md" />
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange(setProfilePic)} 
                      className="absolute inset-0 opacity-0 cursor-pointer h-full rounded-full" 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">Profile Picture</h3>
                  <p className="text-xs text-muted-foreground">
                    Recommended dimensions: 400x400px.<br/>
                    Supported formats: JPG, PNG, GIF.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setTouched(true);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                  <Input
                    id="username"
                    placeholder="username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setTouched(true);
                    }}
                    className="pl-7"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setTouched(true);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us a little about yourself"
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  setTouched(true);
                }}
                className="resize-none min-h-[100px]"
              />
              <div className="text-xs text-right text-muted-foreground">
                {bioRemaining} characters remaining
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={!canSubmit} size="lg">
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
