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
  X,
} from "lucide-react";
import { useWallet } from "./wallet-context";

export const MobileMenu: React.FC = () => {
  const { isMobileMenuOpen, setIsMobileMenuOpen, activeView, setActiveView } =
    useWallet();

  const menuItems = [
    { id: "dashboard", icon: LayoutGrid, label: "Dashboard" },
    { id: "withdraw", icon: ArrowDownLeft, label: "Withdraw" },
    { id: "send", icon: ArrowUpRight, label: "Send" },
    { id: "receive", icon: ArrowDownToLine, label: "Receive" },
    { id: "stake", icon: Coins, label: "Stake" },
    { id: "history", icon: History, label: "History" },
  ];

  if (!isMobileMenuOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Menu</h2>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-colors ${
                activeView === item.id
                  ? "bg-emerald-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}>
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
          <div className="pt-4 border-t border-gray-200">
            <button className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg w-full transition-colors">
              <Settings size={20} />
              <span className="font-medium">Settings</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};
