import { useState, useEffect, useCallback } from "react";

export interface LiveChatMessage {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  message: string;
  timestamp: string;
}

function normalizeLiveChatMessage(message: any): LiveChatMessage {
  const sender = message.sender || message.user || message.author || {};

  return {
    id: String(message.id || message._id || crypto.randomUUID()),
    user: {
      name: sender.name || sender.username || "Unknown",
      username: sender.username || sender.handle || "unknown",
      avatar: sender.avatar || sender.profilePicture || "/placeholder.svg",
    },
    message: message.content || message.message || "",
    timestamp: message.createdAt || message.timestamp || new Date().toISOString(),
  };
}

export function useLiveChat(streamId: string, initialChatId?: string) {
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [chatId, setChatId] = useState<string | null>(initialChatId || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialChatId) {
      setChatId(initialChatId);
    }
  }, [initialChatId]);

  const resolveChatId = useCallback(async () => {
    if (!streamId) {
      setChatId(null);
      return null;
    }

    try {
      const res = await fetch(`/api/livestream/${streamId}`);
      if (!res.ok) {
        return null;
      }

      const data = await res.json();
      const stream = data?.data?.stream || data?.stream || data?.data || data;
      const nextChatId =
        stream?.chatId ||
        data?.data?.chatId ||
        data?.chatId ||
        null;

      setChatId(nextChatId);
      return nextChatId;
    } catch (err) {
      console.error("Failed to resolve livestream chat id:", err);
      setChatId(null);
      return null;
    }
  }, [streamId]);

  const fetchMessages = useCallback(async () => {
    const resolvedChatId = chatId || (await resolveChatId());

    if (!resolvedChatId) {
      setMessages([]);
      return;
    }

    try {
      const res = await fetch(`/api/enhanced-chat/messages/${resolvedChatId}`);
      if (!res.ok) {
        return;
      }

      const data = await res.json();
      const rawMessages = Array.isArray(data) ? data : data.messages || data.data || [];
      const normalized = Array.isArray(rawMessages)
        ? rawMessages.map(normalizeLiveChatMessage)
        : [];

      setMessages(normalized);
    } catch {
      // Keep polling silent to avoid noisy livestream UI
    }
  }, [chatId, resolveChatId]);

  const sendMessage = async (text: string) => {
    const resolvedChatId = chatId || (await resolveChatId());

    if (!resolvedChatId) {
      setError("Live chat is unavailable for this stream");
      return;
    }

    try {
      const res = await fetch("/api/enhanced-chat/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: resolvedChatId,
          content: text,
          messageType: "text",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const response = await res.json();
      const newMessage = normalizeLiveChatMessage(
        response.message || response.data || response
      );

      setMessages((prev) => [...prev, newMessage]);
    } catch (err) {
      console.error(err);
      setError("Failed to send message");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchMessages().finally(() => setIsLoading(false));

    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
}
