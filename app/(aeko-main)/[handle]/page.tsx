import { getProfile } from "@/lib/get-profile";
import { getUserByHandle } from "@/lib/get-user-by-handle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileEditButton } from "@/components/profile/profile-edit-button";
import { FollowButton } from "@/components/profile/follow-button";
import { ProfileStats } from "@/components/profile/profile-stats";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { MessageCircle, MapPin, CalendarDays } from "lucide-react";
import { ReportDialog } from "@/components/report/report-dialog";
import { UserReportButton } from "@/components/profile/user-report-button";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PageProps {
  params: Promise<{ handle: string }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  const { handle } = await params;
  
  // Clean handle (remove @ if present)
  const cleanHandle = decodeURIComponent(handle).replace(/^@/, '');

  // Parallel fetch: current user and target user
  const [currentUser, targetUser] = await Promise.all([
    getProfile(),
    getUserByHandle(cleanHandle)
  ]);

  if (!targetUser) {
    notFound();
  }

  // Check if viewing own profile
  const isOwnProfile = currentUser && (
    (currentUser._id && targetUser._id && currentUser._id === targetUser._id) || 
    (currentUser.id && targetUser.id && currentUser.id === targetUser.id)
  );

  // If it's own profile, redirect to /profile for consistency
  if (isOwnProfile) {
    redirect("/profile");
  }

  // Check if following (simple check based on current user's following list if available)
  // Ideally, the user object returned by getUserByHandle should have an `isFollowing` field 
  // or we check currentUser.following.
  // For now, we'll pass false and let the client-side store sync or fetch if needed, 
  // or rely on the store's state if we visited this user before.
  // Actually, let's see if we can check it.
  const isFollowing = currentUser?.following?.includes(targetUser._id || targetUser.id) || false;

  return (
    <div className="flex flex-col min-h-screen -mt-24 pb-20 md:pb-0 md:mt-0 bg-background">
      {/* Header / Cover */}
      <div className="relative h-60 md:h-64 w-full bg-muted/30">
        <Image
          src={targetUser.coverPicture || "/cover.png"} 
          alt="Cover"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="px-4 relative">
        <div className="absolute top-2 right-4 z-10 flex gap-2">
          {isOwnProfile ? (
            <ProfileEditButton user={targetUser} />
          ) : (
            <>
              <Button variant="secondary" size="icon" className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90" asChild>
                <Link href={`/messages/${targetUser.username || targetUser._id || targetUser.id}`}>
                  <MessageCircle className="w-5 h-5" />
                </Link>
              </Button>
              <FollowButton 
                userId={targetUser._id || targetUser.id} 
                initialIsFollowing={isFollowing}
              />
              <UserReportButton userId={targetUser._id || targetUser.id} />
            </>
          )}
        </div>

        {/* Profile Info Header - Centered */}
        <div className="flex flex-col items-center -mt-16 mb-6">
          <Avatar className="h-32 w-32 border-4 border-background shadow-sm">
            <AvatarImage
              src={targetUser.profilePicture}
              alt={targetUser.name}
              className="object-cover"
            />
            <AvatarFallback className="text-4xl">
              <Image
                src="/profile_icon.jpg"
                alt="Profile"
                fill
                className="object-cover"
              />
            </AvatarFallback>
          </Avatar>

          <div className="mt-3 text-center space-y-1">
            <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-1">
              {targetUser.name}
              {targetUser.blueTick && (
                <Image
                  src="/blue_tick.png"
                  alt="Verified"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              )}
              {targetUser.goldenTick && (
                <Image
                  src="/gold_tick.png"
                  alt="Gold Verified"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              )}
            </h1>
            <p className="text-muted-foreground">@{targetUser.username}</p>
            {targetUser.location && (
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{targetUser.location}</span>
              </div>
            )}
            {targetUser.createdAt && (
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <CalendarDays className="w-3 h-3" />
                <span>
                  Joined {new Date(targetUser.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric"
                  })}
                </span>
              </div>
            )}
            {targetUser.bio && (
              <p className="text-sm text-muted-foreground max-w-xs mx-auto text-center leading-relaxed mt-2">
                {targetUser.bio}
              </p>
            )}
          </div>
        </div>

        {/* Stats - Centered Row */}
        <ProfileStats user={targetUser} />
      </div>

      {/* Tabs with Icons */}
      <ProfileTabs userId={targetUser._id || targetUser.id} isOwnProfile={false} />
    </div>
  );
}
