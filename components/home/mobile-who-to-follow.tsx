 "use client";

import { useState, useMemo } from "react";
import { useSuggestedUsers } from "@/features/explore/hooks/use-suggested-users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFollowUser } from "@/features/profile/hooks/use-follow-user";
import { SuggestedUser } from "@/types/explore";
import Image from "next/image";
import { Loader2, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUserRelationsStore } from "@/features/profile/stores/user-relations-store";

export function MobileWhoToFollow() {
  const { users, isLoading } = useSuggestedUsers();
  const following = useUserRelationsStore((state) => state.following);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const availableUsers = useMemo(() => {
    const seen = new Set<string>();

    return users.filter((user) => {
      const normalizedId = user._id ? String(user._id) : "";
      const dedupeKey = normalizedId || user.username.toLowerCase();

      if (!dedupeKey || (normalizedId && following.has(normalizedId))) {
        return false;
      }

      if (seen.has(dedupeKey)) {
        return false;
      }

      seen.add(dedupeKey);
      return true;
    });
  }, [users, following]);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return availableUsers;
    return availableUsers.filter((u) =>
      [u.name, u.username]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(q))
    );
  }, [availableUsers, query]);

  if (isLoading) {
    return (
      <div className="w-full py-4 pl-4 border-b border-border/40 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center justify-between pr-4 mb-3">
          <h3 className="font-semibold text-lg">Who to follow</h3>
        </div>
        <div className="flex gap-4 pb-2">
          {[1, 2].map((i) => (
            <div key={i} className="flex-1 max-w-[46vw] flex flex-col items-center gap-2 p-3 rounded-xl border border-border/60 bg-card">
              <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
              <div className="w-20 h-4 bg-muted rounded animate-pulse" />
              <div className="w-16 h-8 bg-muted rounded-full animate-pulse mt-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (availableUsers.length === 0) return null;

  const topUsers = availableUsers.slice(0, 2);

  return (
    <>
      <div className="w-full py-4 border-b border-border/40 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 mb-3">
          <h3 className="font-semibold text-lg">Who to follow</h3>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="text-sm text-primary font-medium hover:underline"
          >
            See all
          </button>
        </div>

        <div className="flex gap-3 px-4">
          {topUsers.map((user, index) => (
            <div
              key={user._id || user.username || index}
              className="flex-1 max-w-[46vw]"
            >
              <UserCard user={user} />
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md w-[95vw] max-h-[80vh] flex flex-col">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-base">Who to follow</DialogTitle>
          </DialogHeader>

          <div className="flex items-center gap-2 mb-3">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search users"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-2">
            {filteredUsers.map((user, index) => (
              <UserRow
                key={user._id || user.username || index}
                user={user}
              />
            ))}

            {filteredUsers.length === 0 && (
              <div className="py-6 text-sm text-muted-foreground text-center">
                No users found
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function UserCard({ user }: { user: SuggestedUser }) {
  const { isFollowing, toggleFollow, isLoading } = useFollowUser(
    user._id,
    user.isFollowing
  );

  return (
    <Card className="w-full flex flex-col items-center p-3 gap-2 rounded-xl border border-border/60 bg-card hover:bg-muted/50 transition-colors">
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
          <div className="absolute bottom-0 right-0 p-0.5">
            <Image
              src="/ticks/blue_tick.jpg"
              alt="Verified"
              width={20}
              height={20}
              className="w-5 h-5"
            />
          </div>
        )}
      </div>

      <div className="text-center w-full">
        <div className="flex items-center justify-center gap-1 max-w-full">
          <p className="font-semibold text-sm truncate">{user.name}</p>
          {user.blueTick && (
            <Image
              src="/ticks/blue_tick.jpg"
              alt="Verified"
              width={16}
              height={16}
              className="h-4 w-4 flex-shrink-0"
            />
          )}
          {user.goldenTick && (
            <Image
              src="/ticks/gold_tick.jpg"
              alt="Gold Verified"
              width={16}
              height={16}
              className="h-4 w-4 flex-shrink-0"
            />
          )}
          {user.prideTick && (
            <Image
              src="/ticks/pride_tick.jpg"
              alt="Pride Verified"
              width={16}
              height={16}
              className="h-4 w-4 flex-shrink-0"
            />
          )}
          {user.businessTick && (
            <Image
              src="/ticks/green_tick.jpg"
              alt="Business Verified"
              width={16}
              height={16}
              className="h-4 w-4 flex-shrink-0"
            />
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate w-full">
          @{user.username}
        </p>
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

function UserRow({ user }: { user: SuggestedUser }) {
  const { isFollowing, toggleFollow, isLoading } = useFollowUser(
    user._id,
    user.isFollowing
  );

  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar className="h-9 w-9 border border-border/40">
          <AvatarImage src={user.profilePicture} />
          <AvatarFallback>
            <Image
              src="/profile_icon.jpg"
              alt="Profile"
              fill
              className="object-cover"
            />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1 max-w-full">
            <span className="text-sm font-semibold truncate">{user.name}</span>
            {user.blueTick && (
              <Image
                src="/ticks/blue_tick.jpg"
                alt="Verified"
                width={16}
                height={16}
                className="h-4 w-4 flex-shrink-0"
              />
            )}
            {user.goldenTick && (
              <Image
                src="/ticks/gold_tick.jpg"
                alt="Gold Verified"
                width={16}
                height={16}
                className="h-4 w-4 flex-shrink-0"
              />
            )}
            {user.prideTick && (
              <Image
                src="/ticks/pride_tick.jpg"
                alt="Pride Verified"
                width={16}
                height={16}
                className="h-4 w-4 flex-shrink-0"
              />
            )}
            {user.businessTick && (
              <Image
                src="/ticks/green_tick.jpg"
                alt="Business Verified"
                width={16}
                height={16}
                className="h-4 w-4 flex-shrink-0"
              />
            )}
          </div>
          <span className="text-xs text-muted-foreground truncate">
            @{user.username}
          </span>
        </div>
      </div>
      <Button
        size="sm"
        onClick={toggleFollow}
        disabled={isLoading}
        variant={isFollowing ? "outline" : "secondary"}
        className="h-8 px-3 text-xs"
      >
        {isLoading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : isFollowing ? (
          "Following"
        ) : (
          "Follow"
        )}
      </Button>
    </div>
  );
}
