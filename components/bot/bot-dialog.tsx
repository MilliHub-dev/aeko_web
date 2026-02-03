"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { BotChat } from "./bot-chat";
import { BotSettings } from "./bot-settings";

export function BotDialog({ trigger, chatId }: { trigger: React.ReactNode; chatId?: string }) {
  const [view, setView] = useState<"chat" | "settings">("chat");

  return (
    <Dialog onOpenChange={(open) => {
      if (!open) {
        // Reset view when closed after a short delay or immediately
        setTimeout(() => setView("chat"), 300);
      }
    }}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] h-[600px] p-0 overflow-hidden flex flex-col">
        <DialogTitle className="sr-only">Bot Interaction</DialogTitle>
        {view === "chat" ? (
          <BotChat onOpenSettings={() => setView("settings")} chatId={chatId} />
        ) : (
          <BotSettings onBack={() => setView("chat")} />
        )}
      </DialogContent>
    </Dialog>
  );
}
