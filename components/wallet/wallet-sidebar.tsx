"use client";

import React from "react";
import {
  LayoutGrid,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowDownToLine,
  Coins,
  History,
  Settings,
  ChevronDown,
} from "lucide-react";
import { useWallet } from "./wallet-context";

export const WalletSidebar: React.FC = () => {
  const { activeView, setActiveView } = useWallet();

  const menuItems = [
    { id: "dashboard", icon: LayoutGrid, label: "Dashboard" },
    { id: "withdraw", icon: ArrowDownLeft, label: "Withdraw" },
    { id: "send", icon: ArrowUpRight, label: "Send" },
    { id: "receive", icon: ArrowDownToLine, label: "Receive" },
    { id: "stake", icon: Coins, label: "Stake" },
    { id: "history", icon: History, label: "History" },
  ];

  return (
    <div className="hidden lg:flex w-72 bg-background border-r border-border flex-col h-full min-h-screen">
      {/* Wallet Header */}
      <div className="p-6 border-b border-border">
        <button className="flex items-center gap-2 text-foreground hover:bg-secondary/50 px-3 py-2 rounded-lg w-full transition-colors">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <span className="font-medium">Aeko wallet</span>
          <ChevronDown size={16} className="ml-auto" />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-colors ${
              activeView === item.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}>
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-border">
        <button className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-lg w-full transition-colors">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};
