"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useFollowUser } from "@/features/profile/hooks/use-follow-user";
import { User } from "@/types/user";
import Link from "next/link";

interface UserListModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  type: "followers" | "following" | null;
}

interface UserListItemProps {
  user: Partial<User> & { isFollowing?: boolean };
}

function UserListItem({ user }: UserListItemProps) {
  const { isFollowing, toggleFollow, isLoading } = useFollowUser(
    user._id || user.id || "",
    user.isFollowing
  );

  if (!user.username) return null;

  return (
    <div className="flex items-center justify-between py-2">
      <Link href={`/${user.username}`} className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar className="h-10 w-10 border border-border/40">
          <AvatarImage src={user.profilePicture || user.avatar} />
          <AvatarFallback>
            {user.profilePicture || user.avatar ? (
               user.name?.charAt(0) || "U"
            ) : (
               <Image src="/profile_icon.jpg" alt="Profile" fill className="object-cover" />
            )}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold truncate">{user.name}</span>
          <span className="text-xs text-muted-foreground truncate">@{user.username}</span>
        </div>
      </Link>
      
      <Button
        size="sm"
        variant={isFollowing ? "outline" : "secondary"}
        onClick={(e) => {
          e.preventDefault();
          toggleFollow();
        }}
        disabled={isLoading}
        className="h-8 px-3 ml-2"
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </div>
  );
}

export function UserListModal({ isOpen, onClose, userId, type }: UserListModalProps) {
  const [users, setUsers] = useState<(Partial<User> & { isFollowing?: boolean })[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchUsers = useCallback(async (pageNum: number) => {
    if (!userId || !type) return;
    
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/users/${userId}/${type}?page=${pageNum}&limit=20`);
      if (!res.ok) throw new Error("Failed to fetch users");
      
      const data = await res.json();
      const userList = Array.isArray(data) ? data : (data.users || data.data || []);
      const pagination = data.pagination;

      setUsers(prev => pageNum === 1 ? userList : [...prev, ...userList]);
      
      // Determine if there are more pages
      if (pagination) {
        setHasMore(pageNum < pagination.pages);
      } else {
        // Fallback: if we got less than the limit, assume no more
        setHasMore(userList.length === 20);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [userId, type]);

  useEffect(() => {
    if (isOpen && userId && type) {
      setPage(1);
      setUsers([]);
      setHasMore(true);
      fetchUsers(1);
    } else {
        setUsers([]);
    }
  }, [isOpen, userId, type, fetchUsers]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUsers(nextPage);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="capitalize text-center">
            {type}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto min-h-[300px] pr-2">
          {error && (
            <div className="text-center text-red-500 py-4 text-sm">{error}</div>
          )}
          
          <div className="space-y-1">
            {users.map((user, i) => (
              <UserListItem key={`${user._id || user.id}-${i}`} user={user} />
            ))}
          </div>

          {loading && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {!loading && hasMore && users.length > 0 && (
             <div className="flex justify-center py-2">
               <Button variant="ghost" size="sm" onClick={loadMore}>
                 Load More
               </Button>
             </div>
          )}

          {!loading && users.length === 0 && !error && (
            <div className="text-center text-muted-foreground py-8">
              No {type} found
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
