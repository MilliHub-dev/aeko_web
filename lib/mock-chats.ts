export interface Chat {
  id: number;
  name: string;
  username: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
}

export const mockChats: Chat[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    username: "sarahj",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "That sounds great! When should we meet?",
    time: "2m",
    unread: 2,
  },
  {
    id: 2,
    name: "Tech Team",
    username: "techteam",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Alex: The deployment is scheduled for tomorrow",
    time: "15m",
    unread: 0,
  },
  {
    id: 3,
    name: "Mike Chen",
    username: "mikechen",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thanks for the update!",
    time: "1h",
    unread: 0,
  },
  {
    id: 4,
    name: "Design Squad",
    username: "designsquad",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "You: Sharing the latest mockups",
    time: "3h",
    unread: 0,
  },
  {
    id: 5,
    name: "Emma Wilson",
    username: "emmaw",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Did you see the presentation?",
    time: "5h",
    unread: 1,
  },
  {
    id: 6,
    name: "John Doe",
    username: "johnd",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I'm doing well, thanks!",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: 7,
    name: "Jane Smith",
    username: "janes",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "See you tomorrow!",
    time: "2 days ago",
    unread: 0,
  },
];

export interface Message {
  id: number;
  text: string;
  sent: boolean;
  time: string;
}

export const getMockMessages = (chatId: number): Message[] => [
  {
    id: 1,
    text: "Hey! How are you doing?",
    sent: false,
    time: "10:30 AM",
  },
  {
    id: 2,
    text: "I'm great! Just working on the new project",
    sent: true,
    time: "10:32 AM",
  },
  {
    id: 3,
    text: "That sounds great! When should we meet?",
    sent: false,
    time: "10:35 AM",
  },
  {
    id: 4,
    text: "How about tomorrow at 2 PM?",
    sent: true,
    time: "10:36 AM",
  },
  {
    id: 5,
    text: "Perfect! I'll add it to my calendar",
    sent: false,
    time: "10:37 AM",
  },
  {
    id: 6,
    text: "Great, see you then!",
    sent: true,
    time: "10:38 AM",
  },
];
