"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Search, X, Users, Loader2 } from "lucide-react";
import { useChatStore } from "@/features/chat/stores/chat-store";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { ChatUser } from "@/features/chat/types";
import { useUser } from "@/components/shared/user-context";

export interface CreateGroupDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateGroupDialog({ 
  trigger,
  open,
  onOpenChange
}: CreateGroupDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<ChatUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { createChat } = useChatStore();
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (!isOpen) return;
    
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const query = debouncedSearch ? `?q=${encodeURIComponent(debouncedSearch)}` : "";
        const res = await fetch(`/api/enhanced-chat/users${query}`);
        if (res.ok) {
          const data = await res.json();
          // Handle { users: [] } or { data: [] } or []
          const userList = data.users || data.data || (Array.isArray(data) ? data : []);
          setUsers(userList);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [isOpen, debouncedSearch]);

  const toggleUser = (user: ChatUser) => {
    if (selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) return;

    setIsCreating(true);
    try {
      const participantIds = selectedUsers.map(u => u.id || (u as any)._id);
      
      // Include current user in participants if not already selected (usually backend handles this, but good to be safe)
      const myId = user?.id || user?._id;
      if (myId && !participantIds.includes(myId)) {
          participantIds.push(myId);
      }

      const chatId = await createChat(participantIds, { 
        isGroup: true, 
        groupName: groupName.trim(),
        groupAdminId: myId
      });

      if (chatId) {
        if (setIsOpen) setIsOpen(false);
        setGroupName("");
        setSelectedUsers([]);
        router.push(`/messages/${chatId}`);
      }
    } catch (error) {
      console.error("Failed to create group", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon">
            <Users className="h-5 w-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create Group Chat</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          {/* Group Name Input */}
          <div className="space-y-2">
            <Input
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="font-medium"
            />
          </div>

          {/* Selected Users Chips */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
              {selectedUsers.map(user => (
                <div key={user.id} className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                  <span>{user.name}</span>
                  <button onClick={() => toggleUser(user)} className="hover:text-primary/80">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* User Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {isLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center text-muted-foreground p-4 text-sm">
                No users found
              </div>
            ) : (
              users.map(user => {
                const isSelected = !!selectedUsers.find(u => u.id === user.id);
                return (
                  <div 
                    key={user.id}
                    onClick={() => toggleUser(user)}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected ? "bg-primary/10" : "hover:bg-secondary"
                    }`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profilePicture || user.avatar} />
                      <AvatarFallback>{user.name?.[0] || "?"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                  </div>
                );
              })
            )}
          </div>

          <Button 
            onClick={handleCreateGroup} 
            disabled={!groupName.trim() || selectedUsers.length === 0 || isCreating}
            className="w-full"
          >
            {isCreating ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
            Create Group
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
