"use client";

import React from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowDownToLine,
  Coins,
} from "lucide-react";
import { useWallet } from "./wallet-context";

export const BalanceCard: React.FC = () => {
  const { balance, usdValue, percentChange } = useWallet();

  return (
    <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 shadow-sm">
      <div className="text-center lg:text-left mb-6 lg:mb-8">
        <p className="text-muted-foreground text-sm mb-2">Aekocoin Bal.</p>
        <h2 className="text-foreground text-4xl lg:text-5xl font-bold mb-2">
          {balance.toFixed(8)}
        </h2>
        <p className="text-muted-foreground">
          ${usdValue.toFixed(2)} (USD){" "}
          <span className="text-primary text-sm">+{percentChange}%</span>
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2 lg:flex lg:gap-3">
        <button className="flex flex-col lg:flex-row items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-3 lg:px-6 py-3 rounded-lg lg:rounded-xl transition-colors">
          <ArrowDownLeft size={20} />
          <span className="text-xs lg:text-base font-medium">Withdraw</span>
        </button>
        <button className="flex flex-col lg:flex-row items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground px-3 lg:px-6 py-3 rounded-lg lg:rounded-xl transition-colors">
          <ArrowUpRight size={20} />
          <span className="text-xs lg:text-base font-medium">Send</span>
        </button>
        <button className="flex flex-col lg:flex-row items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground px-3 lg:px-6 py-3 rounded-lg lg:rounded-xl transition-colors">
          <ArrowDownToLine size={20} />
          <span className="text-xs lg:text-base font-medium">Receive</span>
        </button>
        <button className="flex flex-col lg:flex-row items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground px-3 lg:px-6 py-3 rounded-lg lg:rounded-xl transition-colors">
          <Coins size={20} />
          <span className="text-xs lg:text-base font-medium">Stake</span>
        </button>
      </div>
    </div>
  );
};
