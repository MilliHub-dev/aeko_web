import { getProfile } from "@/lib/get-profile";
import { User } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileEditButton } from "@/components/profile/profile-edit-button";
import { ProfileStats } from "@/components/profile/profile-stats";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import Image from "next/image";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/config";

import { MapPin, CalendarDays } from "lucide-react";

export default async function ProfilePage() {
  let user: User | null = await getProfile();

  if (user) {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("token");
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (token?.value) {
        headers["Authorization"] = `Bearer ${token.value}`;
      }

      const res = await fetch(`${API_BASE_URL}/api/users/${user._id || user.id}`, {
        headers,
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        const detailedUser = data.user || data.data || data;
        // Normalize cover picture in detailed stats
        if (detailedUser && !detailedUser.coverPicture && detailedUser.coverPic) {
          detailedUser.coverPicture = detailedUser.coverPic;
        }
        // Merge detailed stats into the user object
        user = { ...user, ...detailedUser };
      } else {
        console.error(`Failed to fetch detailed stats: ${res.status}`);
      }
    } catch (error) {
      console.error("Failed to fetch detailed user stats:", error);
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen -mt-24 pb-20 md:pb-0 md:mt-0 bg-background">
      {/* Header / Cover */}
      <div className="relative h-60 md:h-64 w-full bg-muted/30">
        <Image
          src={user.coverPicture || "/cover.png"} 
          alt="Cover"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="px-4 relative">
        <div className="absolute top-2 right-4 z-10">
          <ProfileEditButton user={user} />
        </div>

        {/* Profile Info Header - Centered */}
        <div className="flex flex-col items-center -mt-16 mb-6">
          <Avatar className="h-32 w-32 border-4 border-background shadow-sm">
            <AvatarImage
              src={user.profilePicture}
              alt={user.name}
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
              {user.name}
              {user.blueTick && (
                <Image
                  src="/ticks/blue_tick.jpg"
                  alt="Verified"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
              )}
              {user.goldenTick && (
                <Image
                  src="/ticks/gold_tick.jpg"
                  alt="Gold Verified"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
              )}
              {user.prideTick && (
                <Image
                  src="/ticks/pride_tick.jpg"
                  alt="Pride Verified"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
              )}
              {user.businessTick && (
                <Image
                  src="/ticks/green_tick.jpg"
                  alt="Business Verified"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
              )}
            </h1>
            <p className="text-muted-foreground">@{user.username}</p>
            {user.location && (
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{user.location}</span>
              </div>
            )}
            {user.createdAt && (
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <CalendarDays className="w-3 h-3" />
                <span>
                  Joined {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric"
                  })}
                </span>
              </div>
            )}
            {user.bio && (
              <p className="text-sm text-muted-foreground max-w-xs mx-auto text-center leading-relaxed mt-2">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        {/* Stats - Centered Row */}
        <ProfileStats user={user} />
      </div>

      {/* Tabs with Icons */}
      <ProfileTabs userId={user._id || user.id} isOwnProfile={true} />
    </div>
  );
}
