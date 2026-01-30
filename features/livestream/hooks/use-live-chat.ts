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

export function useLiveChat(streamId: string) {
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/livestream/${streamId}/messages`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
      // Don't set global error for polling/background fetch to avoid UI flicker
    }
  }, [streamId]);

  const sendMessage = async (text: string) => {
    try {
      const res = await fetch(`/api/livestream/${streamId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      
      if (!res.ok) throw new Error("Failed to send message");
      
      const newMessage = await res.json();
      setMessages(prev => [...prev, newMessage]);
    } catch (err) {
      console.error(err);
      setError("Failed to send message");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchMessages().finally(() => setIsLoading(false));

    // Poll every 3 seconds for new messages
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage
  };
}
