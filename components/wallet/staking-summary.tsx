"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useWallet } from "./wallet-context";

export const StakingSummary: React.FC = () => {
  const { totalStaked, currentAPR, totalRewards } = useWallet();

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="text-foreground text-xl font-semibold mb-6">
        Staking Summary
      </h3>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Staked</span>
          <span className="text-primary font-semibold">
            ⚡ {totalStaked.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Current APR</span>
          <span className="text-primary font-semibold">
            +{currentAPR.toFixed(1)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Rewards</span>
          <span className="text-primary font-semibold">
            ⚡ {totalRewards.toFixed(2)}
          </span>
        </div>
      </div>

      <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
        <Plus size={18} />
        Stake Now
      </button>
    </div>
  );
};
