export type NotificationType = "FOLLOW" | "LIKE" | "COMMENT" | "MENTION" | "MESSAGE";

export interface NotificationSender {
  _id: string;
  name: string;
  username: string;
  profilePicture: string;
}

export interface Notification {
  _id: string;
  recipient: string;
  sender: NotificationSender;
  type: NotificationType;
  entityId?: string; // ID of the post, comment, etc.
  entityType?: string; // "post", "comment", etc.
  text?: string; // Optional text preview
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  unreadCount: number;
}
