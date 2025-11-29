"use client";

import React from "react";
import { Link, MoreVertical, Plus } from "lucide-react";
import { useWallet } from "./wallet-context";

export const ConnectedWallet: React.FC = () => {
  const { connectedWallet } = useWallet();

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="text-foreground text-xl font-semibold mb-6">
        Connected Wallet
      </h3>

      <div className="flex items-center justify-between mb-6 p-3 bg-secondary rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <Link size={16} className="text-primary-foreground" />
          </div>
          <span className="text-foreground font-mono text-sm">
            {connectedWallet}
          </span>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreVertical size={20} />
        </button>
      </div>

      <button className="w-full border-2 border-dashed border-border hover:border-primary text-muted-foreground hover:text-primary py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
        <Plus size={18} />
        Add Wallet
      </button>
    </div>
  );
};
