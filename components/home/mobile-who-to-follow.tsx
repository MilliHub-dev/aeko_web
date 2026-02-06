"use client";

import { useSuggestedUsers } from "@/features/explore/hooks/use-suggested-users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFollowUser } from "@/features/profile/hooks/use-follow-user";
import { SuggestedUser } from "@/types/explore";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export function MobileWhoToFollow() {
  const { users, isLoading } = useSuggestedUsers();

  if (isLoading) {
    return (
      <div className="w-full py-4 pl-4 border-b border-border/40 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center justify-between pr-4 mb-3">
          <h3 className="font-semibold text-lg">Who to follow</h3>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[140px] w-[140px] flex flex-col items-center gap-2 p-3 rounded-xl border border-border/60 bg-card">
              <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
              <div className="w-20 h-4 bg-muted rounded animate-pulse" />
              <div className="w-16 h-8 bg-muted rounded-full animate-pulse mt-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) return null;

  return (
    <div className="w-full py-4 border-b border-border/40 bg-background/50 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 mb-3">
        <h3 className="font-semibold text-lg">Who to follow</h3>
        <Link href="/communities" className="text-sm text-primary font-medium hover:underline">
          See all
        </Link>
      </div>
      
      <div 
        className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none snap-x snap-mandatory"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {users.map((user, index) => (
          <div key={`${user._id}-${index}`} className="snap-center">
            <UserCard user={user} />
          </div>
        ))}
      </div>
    </div>
  );
}

function UserCard({ user }: { user: SuggestedUser }) {
  const { isFollowing, toggleFollow, isLoading } = useFollowUser(
    user._id,
    user.isFollowing
  );

  return (
    <Card className="min-w-[150px] w-[150px] flex flex-col items-center p-3 gap-2 rounded-xl border border-border/60 bg-card hover:bg-muted/50 transition-colors">
      <div className="relative">
        <Avatar className="w-16 h-16 border-2 border-background">
          <AvatarImage src={user.profilePicture} alt={user.name} />
          <AvatarFallback>
            <Image
              src="/profile_icon.jpg"
              alt="Profile"
              fill
              className="object-cover"
            />
          </AvatarFallback>
        </Avatar>
        {user.blueTick && (
          <div className="absolute bottom-0 right-0 rounded-full bg-background p-0.5">
             <Image src="/blue_tick.png" alt="Verified" width={16} height={16} className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="text-center w-full">
        <p className="font-semibold text-sm truncate w-full">{user.name}</p>
        <p className="text-xs text-muted-foreground truncate w-full">@{user.username}</p>
      </div>

      <Button
        size="sm"
        onClick={toggleFollow}
        disabled={isLoading}
        variant={isFollowing ? "outline" : "default"}
        className={`w-full h-8 rounded-full text-xs font-medium ${
          isFollowing 
            ? "border-primary/50 text-primary hover:text-primary hover:bg-primary/10" 
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        {isLoading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : isFollowing ? (
          "Following"
        ) : (
          "Follow"
        )}
      </Button>
    </Card>
  );
}
