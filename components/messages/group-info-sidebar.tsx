"use client";

import { useState, useRef } from "react";
import { useChatStore } from "@/features/chat/stores/chat-store";
import { useUser } from "@/components/shared/user-context";
import { Chat } from "@/features/chat/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Link as LinkIcon, 
  Camera, 
  Trash2, 
  Copy, 
  Check, 
  ShieldAlert,
  X,
  LogOut
} from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is used, or alert/console for now

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";

interface GroupInfoSidebarProps {
  chat: Chat;
  onClose?: () => void;
}

export function GroupInfoSidebar({ chat, onClose }: GroupInfoSidebarProps) {
  const { user } = useUser();
  const { updateGroupIcon, removeGroupMember, generateInviteLink, leaveGroup, error } = useChatStore();
  const [inviteLink, setInviteLink] = useState<{ inviteCode: string; inviteLink: string } | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isRemoveMemberDialogOpen, setIsRemoveMemberDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Robust admin check: compare string IDs
  const myId = user?.id || user?._id;
  const adminId = chat.groupAdminId || chat.adminId;
  const isAdmin = myId && adminId && String(adminId) === String(myId);
  
  // Participants list - prioritize members array if available
  const participants = chat.members || chat.participants || [];

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Re-check admin status before action
      if (!isAdmin) {
         toast.error("Only admins can update the group icon");
         return;
      }
      
      const success = await updateGroupIcon(chat.id, file);
      if (success) {
        toast.success("Group icon updated successfully");
      } else {
        // Use error from store if available, or generic message
        const storeError = useChatStore.getState().error;
        toast.error(storeError || "Failed to update group icon");
      }
    }
  };

  const handleGenerateLink = async () => {
    if (!isAdmin) return;
    setIsGeneratingLink(true);
    const result = await generateInviteLink(chat.id);
    if (result) {
      setInviteLink(result);
    }
    setIsGeneratingLink(false);
  };

  const copyToClipboard = () => {
    const link = inviteLink?.inviteLink || chat.inviteCode ? `${window.location.origin}/invite/${chat.inviteCode}` : "";
    // Fallback if we only have code or logic differs
    const textToCopy = inviteLink?.inviteLink || link;
    
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleRemoveMember = (userId: string) => {
    setMemberToRemove(userId);
    setIsRemoveMemberDialogOpen(true);
  };

  const confirmRemoveMember = async () => {
    if (memberToRemove) {
      await removeGroupMember(chat.id, memberToRemove);
      setMemberToRemove(null);
      setIsRemoveMemberDialogOpen(false);
    }
  };

  const handleLeaveGroup = () => {
    setIsLeaveDialogOpen(true);
  };

  const confirmLeaveGroup = async () => {
    const success = await leaveGroup(chat.id, myId);
    if (success) {
      setIsLeaveDialogOpen(false);
      if (onClose) onClose();
    } else {
      toast.error("Failed to leave group");
    }
  };

  if (!chat.isGroup) return null;

  return (
    <div className="w-80 border-l border-border bg-background flex flex-col h-full absolute right-0 top-0 bottom-0 z-20 shadow-xl md:static md:shadow-none">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-lg">Group Info</h2>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="md:hidden">
            <X size={20} />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Group Header / Icon */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-secondary">
                <AvatarImage src={chat.groupIcon || chat.avatar} />
                <AvatarFallback className="text-2xl">{chat.groupName?.[0] || chat.name?.[0] || "G"}</AvatarFallback>
              </Avatar>
              {isAdmin && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleIconUpload}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                  >
                    <Camera size={24} />
                  </button>
                </>
              )}
            </div>
            <div className="text-center">
              <h3 className="font-bold text-xl">{chat.groupName || chat.name}</h3>
              <p className="text-muted-foreground text-sm">{participants.length} members</p>
            </div>
          </div>

          <Separator />

          {/* Invite Link Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-medium text-sm text-muted-foreground">
              <LinkIcon size={16} />
              <span>Invite Link</span>
            </div>
            {isAdmin ? (
              <div className="space-y-2">
                {!inviteLink && !chat.inviteCode ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={handleGenerateLink}
                    disabled={isGeneratingLink}
                  >
                    {isGeneratingLink ? "Generating..." : "Generate Invite Link"}
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Input 
                      readOnly 
                      value={inviteLink?.inviteLink || (chat.inviteCode ? `${window.location.origin}/invite/${chat.inviteCode}` : "")} 
                      className="text-xs h-8"
                    />
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={copyToClipboard}>
                      {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
               <p className="text-xs text-muted-foreground italic">Only admins can invite via link.</p>
            )}
          </div>

          <Separator />

          {/* Members Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-medium text-sm text-muted-foreground">
              <Users size={16} />
              <span>Members</span>
            </div>
            <div className="space-y-3">
              {participants.map((member) => (
                <div key={member.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.profilePicture || member.avatar} />
                      <AvatarFallback>{member.name?.[0] || "?"}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {member.id === user?.id || member.id === user?._id ? "You" : member.name}
                        {(member.id === chat.groupAdminId || member.id === chat.adminId) && <span className="ml-1 text-xs text-primary">(Admin)</span>}
                      </p>
                    </div>
                  </div>
                  
                  {isAdmin && member.id !== user?.id && member.id !== user?._id && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Leave Group Button */}
          <div className="pt-2">
            <Button 
              variant="destructive" 
              className="w-full gap-2" 
              onClick={handleLeaveGroup}
            >
              <LogOut size={16} />
              Leave Group
            </Button>
          </div>
        </div>
      </ScrollArea>

      <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave this group? You will no longer receive messages from this group.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLeaveDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmLeaveGroup}>Leave</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRemoveMemberDialogOpen} onOpenChange={setIsRemoveMemberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this member from the group?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRemoveMemberDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmRemoveMember}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
