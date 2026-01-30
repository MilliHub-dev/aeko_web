"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Check, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SuggestedUser } from "@/types/explore";

interface UserSelectorProps {
  selectedUserIds: string[];
  onToggleUser: (userId: string, user: SuggestedUser) => void;
}

export function UserSelector({ selectedUserIds, onToggleUser }: UserSelectorProps) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<SuggestedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cachedUsers, setCachedUsers] = useState<Record<string, SuggestedUser>>({});

  // Search users
  const searchUsers = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setUsers([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/users?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      
      let foundUsers: SuggestedUser[] = [];
      
      if (data.success && Array.isArray(data.users)) {
        foundUsers = data.users;
      } else if (data.success && Array.isArray(data.data)) {
        foundUsers = data.data;
      } else if (Array.isArray(data)) {
        foundUsers = data;
      }

      setUsers(foundUsers);
      
      // Cache users for display when selected
      setCachedUsers(prev => {
        const newCache = { ...prev };
        foundUsers.forEach(u => {
          newCache[u._id] = u;
        });
        return newCache;
      });
      
    } catch (error) {
      console.error("Failed to search users:", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        searchUsers(query);
      } else {
        setUsers([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchUsers]);

  // Get selected users objects from cache or current search
  const selectedUsersList = selectedUserIds.map(id => cachedUsers[id]).filter(Boolean);

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Selected Users Badges */}
      {selectedUsersList.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px] max-h-[100px] overflow-y-auto">
          {selectedUsersList.map(user => (
            <Badge key={user._id} variant="secondary" className="gap-1 pl-1 pr-2 py-1">
              <Avatar className="w-4 h-4">
                <AvatarImage src={user.profilePicture || user.avatar} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="max-w-[100px] truncate">{user.name}</span>
              <button 
                onClick={() => onToggleUser(user._id, user)}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="pl-9"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Results List */}
      <ScrollArea className="flex-1 -mx-2 px-2 h-[300px]">
        {users.length === 0 && query && !isLoading && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No users found
          </div>
        )}
        
        {users.length === 0 && !query && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Type to search for people to share with
          </div>
        )}

        <div className="space-y-1">
          {users.map(user => {
            const isSelected = selectedUserIds.includes(user._id);
            return (
              <div 
                key={user._id}
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors",
                  isSelected && "bg-primary/5 hover:bg-primary/10"
                )}
                onClick={() => onToggleUser(user._id, user)}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.profilePicture || user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left">
                    <span className="font-medium text-sm">{user.name}</span>
                    <span className="text-xs text-muted-foreground">@{user.username}</span>
                  </div>
                </div>
                
                {isSelected && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
