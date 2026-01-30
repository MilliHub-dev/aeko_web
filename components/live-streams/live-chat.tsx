"use client";
import { ScrollArea } from "@base-ui-components/react/scroll-area";
import { Button } from "../ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
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
    <div className="flex flex-col h-full bg-background border-l border-border">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-lg">Live Chat</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading && messages.length === 0 ? (
          <div className="text-center text-muted-foreground">Loading chat...</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-secondary flex-shrink-0 overflow-hidden">
                <img
                  src={msg.user.avatar || "/placeholder.svg"}
                  alt={msg.user.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-foreground">
                    {msg.user.name}
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

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            placeholder="Say something..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
          <Button size="sm" onClick={handleSend}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
