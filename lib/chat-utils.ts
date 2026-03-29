
import { Chat, ChatUser } from "@/features/chat/types";

export const getOtherParticipant = (chat: Chat, currentUserId?: string): ChatUser | undefined => {
  const participants = chat.participants || chat.members || [];
  if (!participants || participants.length === 0) return undefined;

  // Normalize IDs to strings for comparison
  const myIdStr = String(currentUserId || "");

  // Helper to extract ID from a participant object
  const getParticipantId = (p: any): string => {
    return String(p.id || p._id || p.userId || "");
  };

  // Find the participant that is NOT the current user
  let other = participants.find(p => {
    const pId = getParticipantId(p);
    // If myId is present, exclude me. If myId is missing, just take the first one (fallback).
    return myIdStr ? pId !== myIdStr : true;
  });

  // Fallback: if no "other" found (e.g. only me in chat?), take the first one
  if (!other) {
    other = participants[0];
  }

  // Deep resolve user info if nested
  // Some APIs return { user: { ... } } or { _id: ..., ... }
  const resolved: any = { ...other };

  // If there's a nested 'user' object, merge it up
  if ((other as any).user) {
    Object.assign(resolved, (other as any).user);
  }

  const nestedUser = (other as any).user || {};

  // Map common field variations
  resolved.id = resolved.id || resolved._id || resolved.userId;
  resolved.socketId =
    resolved.socketId ||
    resolved.socket_id ||
    resolved.userSocketId ||
    nestedUser?.socketId ||
    nestedUser?.socket_id;
  
  if (resolved.name) {
    // Keep existing name
  } else if (resolved.fullName) {
    resolved.name = resolved.fullName;
  } else if (resolved.firstName) {
    resolved.name = `${resolved.firstName} ${resolved.lastName || ""}`.trim();
  }

  resolved.username = resolved.username || resolved.email?.split('@')[0]; // Fallback to email prefix
  
  // Prioritize profilePicture as per new API spec
  resolved.avatar = resolved.profilePicture || resolved.avatar || resolved.profile_picture || resolved.image;
  
  // Ensure booleans are preserved and check for aliases
  if (other.blueTick !== undefined) resolved.blueTick = other.blueTick;
  if (other.goldenTick !== undefined) resolved.goldenTick = other.goldenTick;

  // Aggressive check for verification status (handle nested user or aliases)
  resolved.blueTick = resolved.blueTick || nestedUser.blueTick || resolved.isVerified || nestedUser.isVerified || false;
  resolved.goldenTick = resolved.goldenTick || nestedUser.goldenTick || false;

  return resolved as ChatUser;
};

export const getChatDisplayName = (chat: Chat, currentUserId?: string): string => {
  if (chat.isGroup && chat.groupName) return chat.groupName;
  if (chat.name) return chat.name;
  
  const other = getOtherParticipant(chat, currentUserId);
  return other?.name || other?.username || "Unknown User";
};

export const getChatDisplayImage = (chat: Chat, currentUserId?: string): string => {
  if (chat.isGroup) {
    // Return group icon or a default group placeholder
    return chat.groupIcon || chat.avatar || "/placeholder.svg?height=40&width=40";
  }
  if (chat.avatar) return chat.avatar;
  
  const other = getOtherParticipant(chat, currentUserId);
  return other?.avatar || "/placeholder.svg?height=40&width=40";
};

export const getChatDisplayUsername = (chat: Chat, currentUserId?: string): string | undefined => {
  if (chat.isGroup) return undefined; // Groups don't have a handle/username
  if (chat.username) return chat.username;

  const other = getOtherParticipant(chat, currentUserId);
  return other?.username;
};
