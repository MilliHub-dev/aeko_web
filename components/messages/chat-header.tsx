"use client";

import { ArrowLeft, MoreHorizontal, Bot, Phone, Video, Trash2, Info, LogOut } from "lucide-react";
import Image from "next/image";
import { useChat } from "@/contexts/ChatContext";
import { useCall } from "@/contexts/CallContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import { BotDialog } from "../bot/bot-dialog";
import { useUser } from "@/components/shared/user-context";
import { useChatStore } from "@/features/chat/stores/chat-store";
import { getChatDisplayName, getChatDisplayImage, getChatDisplayUsername, getOtherParticipant } from "@/lib/chat-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ChatHeader = ({ onToggleGroupInfo }: { onToggleGroupInfo?: () => void }) => {
  const router = useRouter();
  const { selectedChat } = useChat();
  const { startCall } = useCall();
  const { deleteChat, leaveGroup } = useChatStore();
  const { user } = useUser();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  if (!selectedChat) return null;

  const isGroup = selectedChat.isGroup;
  const adminId = selectedChat.groupAdminId || selectedChat.adminId;

  const handleDeleteChat = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleLeaveGroup = () => {
    setIsLeaveDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedChat) return;
    await deleteChat(selectedChat.id);
    setIsDeleteDialogOpen(false);
    router.push('/messages');
  };

  const confirmLeave = async () => {
    if (!selectedChat) return;
    const success = await leaveGroup(selectedChat.id, myId);
    if (success) {
      setIsLeaveDialogOpen(false);
      router.push('/messages');
    }
    // Error is handled in store/logged, maybe show toast here if we had toast imported?
    // ChatHeader doesn't seem to import toast. Let's leave it simple for now or check imports.
  };

  const myId = user?.id || user?._id;
  
  const displayName = getChatDisplayName(selectedChat, myId);
  const displayUsername = getChatDisplayUsername(selectedChat, myId);
  const displayAvatar = getChatDisplayImage(selectedChat, myId);
  const otherParticipant = getOtherParticipant(selectedChat, myId);
  const otherId = otherParticipant?.id || (otherParticipant as any)?._id || (otherParticipant as any)?.userId;
  const otherSocketId = otherParticipant?.socketId || (otherParticipant as any)?.socket_id;
  const callTarget = otherSocketId || otherId;

  return (
    <>
      <div className="border-b border-border p-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-secondary/80 rounded-full transition-colors"
          aria-label="Back to chat list">
          <ArrowLeft size={20} />
        </button>
        <Avatar className="h-10 w-10">
          <AvatarImage src={displayAvatar} alt={displayName} />
          <AvatarFallback>{displayName[0] || "?"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-foreground truncate flex items-center gap-1">
            {displayName}
            {!isGroup && otherParticipant?.blueTick && (
              <Image
                src="/ticks/blue_tick.jpg"
                alt="Verified"
                width={16}
                height={16}
                className="h-4 w-4"
              />
            )}
            {!isGroup && otherParticipant?.goldenTick && (
              <Image
                src="/ticks/gold_tick.jpg"
                alt="Gold Verified"
                width={16}
                height={16}
                className="h-4 w-4"
              />
            )}
            {!isGroup && otherParticipant?.prideTick && (
              <Image
                src="/ticks/pride_tick.jpg"
                alt="Pride Verified"
                width={16}
                height={16}
                className="h-4 w-4"
              />
            )}
            {!isGroup && otherParticipant?.businessTick && (
              <Image
                src="/ticks/green_tick.jpg"
                alt="Business Verified"
                width={16}
                height={16}
                className="h-4 w-4"
              />
            )}
          </h2>
          {displayUsername && (
            <p className="text-sm text-muted-foreground truncate">
              @{displayUsername}
            </p>
          )}
        </div>
        
        {otherId && !isGroup && (
          <>
            <button 
              onClick={() => callTarget && startCall(callTarget, "voice", otherId)}
              className="p-2 hover:bg-secondary/80 rounded-full transition-colors" 
              aria-label="Voice Call"
            >
              <Phone size={20} />
            </button>
            <button 
              onClick={() => callTarget && startCall(callTarget, "video", otherId)}
              className="p-2 hover:bg-secondary/80 rounded-full transition-colors" 
              aria-label="Video Call"
            >
              <Video size={20} />
            </button>
          </>
        )}

        {isGroup && (
          <button
            onClick={onToggleGroupInfo}
            className="p-2 hover:bg-secondary/80 rounded-full transition-colors"
            aria-label="Group Info"
          >
            <Info size={20} />
          </button>
        )}

        <BotDialog 
          trigger={
            <button className="p-2 hover:bg-secondary/80 rounded-full transition-colors text-primary" aria-label="Open Bot">
              <Bot size={20} />
            </button>
          }
          chatId={selectedChat.id}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-secondary/80 rounded-full transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {displayUsername && (
              <DropdownMenuItem onClick={() => router.push(`/${displayUsername}`)}>
                View Profile
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-destructive">
              Block User
            </DropdownMenuItem>
            {isGroup && (
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleLeaveGroup}>
                <LogOut className="w-4 h-4 mr-2" />
                Leave Group
              </DropdownMenuItem>
            )}
            {(!isGroup || adminId === myId) && (
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDeleteChat}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete {isGroup ? "Group" : "Chat"}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this chat? This action cannot be undone and will remove the chat for everyone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <Button variant="destructive" onClick={confirmLeave}>Leave</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { ChatHeader };
