"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Heart, 
  MessageCircle, 
  UserPlus, 
  AtSign, 
  Mail, 
  Trash2,
  Check
} from "lucide-react";
import { Notification, NotificationType } from "@/types/notification";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Helper for date formatting if date-fns is not available
function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        
        // Fetch unread count separately or derive it
        const unreadRes = await fetch("/api/notifications/unread-count");
        if (unreadRes.ok) {
          const unreadData = await unreadRes.json();
          setUnreadCount(unreadData.count || 0);
        }
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, { method: "PUT" });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "LIKE":
        return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
      case "COMMENT":
        return <MessageCircle className="w-5 h-5 text-blue-500 fill-blue-500" />;
      case "FOLLOW":
        return <UserPlus className="w-5 h-5 text-primary fill-primary" />;
      case "MENTION":
        return <AtSign className="w-5 h-5 text-orange-500" />;
      case "MESSAGE":
        return <Mail className="w-5 h-5 text-purple-500" />;
      default:
        return <div className="w-5 h-5 rounded-full bg-gray-400" />;
    }
  };

  const getMessage = (notification: Notification) => {
    switch (notification.type) {
      case "LIKE":
        return "liked your post";
      case "COMMENT":
        return "commented on your post";
      case "FOLLOW":
        return "started following you";
      case "MENTION":
        return "mentioned you in a post";
      case "MESSAGE":
        return "sent you a message";
      default:
        return "interacted with you";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-20">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
            {unreadCount} new
          </span>
        )}
      </div>

      <div className="divide-y">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No notifications yet</div>
        ) : (
          notifications.map((notification, index) => (
            <div
              key={`${notification._id}-${index}`}
              className={cn(
                "p-4 flex gap-4 transition-colors hover:bg-muted/50 cursor-pointer relative group",
                !notification.isRead && "bg-primary/5 hover:bg-primary/10"
              )}
              onClick={() => !notification.isRead && markAsRead(notification._id)}
            >
              <div className="mt-1">
                {getIcon(notification.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={notification.sender.profilePicture} />
                      <AvatarFallback>{notification.sender.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-sm hover:underline">
                      {notification.sender.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {getMessage(notification)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {timeAgo(notification.createdAt)}
                  </span>
                </div>
                
                {notification.text && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1 pl-10 border-l-2 border-muted ml-0">
                    {notification.text}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity self-center">
                 {!notification.isRead && (
                   <Button 
                     size="icon" 
                     variant="ghost" 
                     className="h-8 w-8 text-primary" 
                     onClick={(e) => {
                       e.stopPropagation();
                       markAsRead(notification._id);
                     }}
                     title="Mark as read"
                   >
                     <Check className="w-4 h-4" />
                   </Button>
                 )}
                 <Button 
                   size="icon" 
                   variant="ghost" 
                   className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" 
                   onClick={(e) => deleteNotification(notification._id, e)}
                   title="Delete"
                 >
                   <Trash2 className="w-4 h-4" />
                 </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
