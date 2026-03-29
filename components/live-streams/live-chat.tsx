"use client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { useLiveChat } from "@/features/livestream/hooks/use-live-chat";

interface LiveChatProps {
  streamId: string;
}

export function LiveChat({ streamId }: LiveChatProps) {
  const [inputText, setInputText] = useState("");
  const { messages, sendMessage, isLoading } = useLiveChat(streamId);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col bg-transparent">
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {isLoading && messages.length === 0 ? (
          <div className="text-center text-muted-foreground">Loading chat...</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex gap-3 rounded-[22px] border border-black/5 bg-black/[0.02] p-3">
              <div className="h-8 w-8 rounded-full bg-secondary flex-shrink-0 overflow-hidden">
                <img
                  src={msg.user?.avatar || "/placeholder.svg"}
                  alt={msg.user?.name || "User"}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-foreground">
                    {msg.user?.name || "Unknown"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {msg.timestamp}
                  </span>
                </div>
                <p className="text-sm text-foreground/90">{msg.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-black/6 px-5 py-4">
        <div className="flex gap-2">
          <Input
            placeholder="Say something..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="rounded-full border-black/8 bg-black/[0.03] px-4 focus-visible:ring-1 focus-visible:ring-primary"
          />
          <Button size="sm" onClick={handleSend} className="rounded-full px-5">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
