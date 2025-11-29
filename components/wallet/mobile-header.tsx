"use client";

import React from "react";
import { ScanLine, ChevronDown, Settings } from "lucide-react";
import { useWallet } from "./wallet-context";

export const MobileHeader: React.FC = () => {
  const { setIsMobileMenuOpen } = useWallet();

  return (
    <div className="lg:hidden fixed top-0 left-0 md:left-20 right-0 bg-background z-10 px-4 py-4 flex items-center justify-between border-b border-border">
      <button className="p-2 hover:bg-secondary rounded-lg">
        <ScanLine size={24} className="text-muted-foreground" />
      </button>

      <button className="flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded-lg">
        <div className="w-2 h-2 bg-primary rounded-full"></div>
        <span className="font-semibold text-foreground">Aeko wallet</span>
        <ChevronDown size={16} className="text-muted-foreground" />
      </button>

      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="p-2 hover:bg-secondary rounded-lg">
        <Settings size={24} className="text-muted-foreground" />
      </button>
    </div>
  );
};
