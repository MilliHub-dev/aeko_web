"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AtSign,
  Bell,
  Check,
  Heart,
  Loader2,
  Mail,
  MessageCircle,
  Sparkles,
  Trash2,
  UserPlus,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Notification, NotificationType } from "@/types/notification";
import { cn } from "@/lib/utils";

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

type FilterValue = "all" | "unread";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data.notifications)
            ? data.notifications
            : Array.isArray(data.data)
              ? data.data
              : Array.isArray(data.items)
                ? data.items
                : [];
        setNotifications(items);

        const unreadRes = await fetch("/api/notifications/unread-count");
        if (unreadRes.ok) {
          const unreadData = await unreadRes.json();
          const resolvedUnreadCount =
            unreadData.count ??
            unreadData.unreadCount ??
            unreadData.data?.count ??
            unreadData.data?.unreadCount ??
            items.filter((item: Notification) => !item.isRead).length;
          setUnreadCount(resolvedUnreadCount || 0);
        } else {
          setUnreadCount(items.filter((item: Notification) => !item.isRead).length);
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

  const withBusyId = (id: string, busy: boolean) => {
    setBusyIds((prev) => {
      const next = new Set(prev);
      if (busy) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const markAsRead = async (id: string) => {
    try {
      withBusyId(id, true);
      const res = await fetch(`/api/notifications/${id}/read`, { method: "PUT" });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to mark as read", error);
    } finally {
      withBusyId(id, false);
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter((notification) => !notification.isRead);
    if (unreadNotifications.length === 0) return;

    try {
      setIsMarkingAll(true);
      await Promise.all(
        unreadNotifications.map(async (notification) => {
          const res = await fetch(`/api/notifications/${notification._id}/read`, {
            method: "PUT",
          });
          if (!res.ok) {
            throw new Error(`Failed to mark ${notification._id} as read`);
          }
        }),
      );

      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read", error);
    } finally {
      setIsMarkingAll(false);
    }
  };

  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      withBusyId(id, true);
      const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      if (res.ok) {
        const deleted = notifications.find((notification) => notification._id === id);
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        if (deleted && !deleted.isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error("Failed to delete notification", error);
    } finally {
      withBusyId(id, false);
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "LIKE":
        return <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />;
      case "COMMENT":
        return <MessageCircle className="h-4 w-4 text-sky-500" />;
      case "FOLLOW":
        return <UserPlus className="h-4 w-4 text-emerald-500" />;
      case "MENTION":
        return <AtSign className="h-4 w-4 text-amber-500" />;
      case "MESSAGE":
        return <Mail className="h-4 w-4 text-violet-500" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
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

  const getNotificationHref = (notification: Notification) => {
    if (notification.type === "FOLLOW" && notification.sender.username) {
      return `/${notification.sender.username}`;
    }

    if (notification.entityId && notification.sender.username) {
      return `/${notification.sender.username}/posts/${notification.entityId}`;
    }

    return "#";
  };

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "unread") {
      return notifications.filter((notification) => !notification.isRead);
    }
    return notifications;
  }, [activeFilter, notifications]);

  const latestNotification = notifications[0];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-24 pt-4 md:px-6 md:pt-6">
      <section className="overflow-hidden rounded-[32px] border border-border/60 bg-[radial-gradient(140%_120%_at_0%_0%,rgba(0,127,109,0.18),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,248,247,0.92))] shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)]">
        <div className="flex flex-col gap-5 p-5 md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Activity
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  Notifications
                </h1>
                <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                  Keep up with follows, comments, mentions, and messages without losing the thread.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:w-fit">
              <div className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3 shadow-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Unread
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{unreadCount}</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3 shadow-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Total
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{notifications.length}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background/80 p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  activeFilter === "all"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("unread")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  activeFilter === "unread"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Unread
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={fetchNotifications}
                disabled={isLoading}
              >
                Refresh
              </Button>
              <Button
                className="rounded-full"
                onClick={markAllAsRead}
                disabled={unreadCount === 0 || isMarkingAll}
              >
                {isMarkingAll ? "Updating..." : "Mark all as read"}
              </Button>
            </div>
          </div>

          {latestNotification && (
            <div className="rounded-[28px] border border-border/60 bg-background/85 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Latest
              </p>
              <div className="mt-3 flex items-start gap-3">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                  {getIcon(latestNotification.type)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{latestNotification.sender.name}</span>{" "}
                    {getMessage(latestNotification)}
                  </p>
                  {latestNotification.text && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {latestNotification.text}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {timeAgo(latestNotification.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-3">
        {isLoading ? (
          <div className="flex min-h-[16rem] items-center justify-center rounded-[28px] border border-border/60 bg-card/60 shadow-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading notifications...</span>
            </div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-border/70 bg-card/40 px-6 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-foreground">
              {activeFilter === "unread" ? "You’re all caught up" : "No notifications yet"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {activeFilter === "unread"
                ? "Everything important has been seen. New activity will show up here as it happens."
                : "When people interact with your posts, follow you, or message you, this inbox will light up."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification, index) => {
            const href = getNotificationHref(notification);
            const isBusy = busyIds.has(notification._id);

            return (
              <Link
                key={`${notification._id}-${index}`}
                href={href}
                className={cn(
                  "group block overflow-hidden rounded-[28px] border shadow-sm transition-all duration-200",
                  !notification.isRead
                    ? "border-primary/20 bg-[linear-gradient(180deg,rgba(0,127,109,0.08),rgba(255,255,255,0.96))] hover:border-primary/35 hover:shadow-[0_20px_50px_-40px_rgba(0,127,109,0.55)]"
                    : "border-border/60 bg-card/70 hover:border-border hover:bg-card/90",
                )}
                onClick={() => !notification.isRead && markAsRead(notification._id)}
              >
                <div className="flex gap-4 p-4 md:p-5">
                  <div className="relative mt-1 shrink-0">
                    <Avatar className="h-12 w-12 border border-border/60 shadow-sm">
                      <AvatarImage src={notification.sender.profilePicture} />
                      <AvatarFallback>
                        {notification.sender.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-background bg-background shadow-sm">
                      {getIcon(notification.type)}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm leading-6 text-foreground md:text-[15px]">
                          <span className="font-semibold">{notification.sender.name}</span>{" "}
                          <span className="text-muted-foreground">{getMessage(notification)}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @{notification.sender.username}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {!notification.isRead && (
                          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {timeAgo(notification.createdAt)}
                        </span>
                      </div>
                    </div>

                    {notification.text && (
                      <div className="mt-3 rounded-2xl border border-border/60 bg-background/75 px-4 py-3">
                        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                          {notification.text}
                        </p>
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        {notification.type.toLowerCase()}
                      </p>

                      <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
                        {!notification.isRead && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 rounded-full text-primary hover:bg-primary/10 hover:text-primary"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              markAsRead(notification._id);
                            }}
                            disabled={isBusy}
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={(e) => deleteNotification(notification._id, e)}
                          disabled={isBusy}
                          title="Delete"
                        >
                          {isBusy ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </section>
    </div>
  );
}
