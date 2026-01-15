"use client";

import React from "react";
import { Eye } from "lucide-react";

export const DesktopHeader: React.FC = () => {
  return (
    <div className="hidden lg:flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <h1 className="text-foreground text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">
            Token
          </button>
          <button className="px-4 py-2 bg-secondary text-muted-foreground rounded-lg text-sm hover:text-foreground transition-colors">
            NFTs
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors">
          <Eye size={20} className="text-foreground" />
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-foreground font-medium">Rayyan Breem</p>
            <p className="text-muted-foreground text-sm">xkgdrvvv6123</p>
          </div>
          <div className="w-10 h-10 bg-linear-to-br from-primary to-primary/80 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
