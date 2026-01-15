"use client";

import React from "react";
import { DesktopHeader } from "./desktop-header";
import { BalanceCard } from "./balance-card";
import { RecentTransactions } from "./recent-transactions";
import { StakingSummary } from "./staking-summary";
import { ConnectedWallet } from "./connected-wallet";

// Mobile Tab Selector
export const MobileTabSelector: React.FC = () => {
  return (
    <div className="lg:hidden flex justify-center mb-6">
      <div className="inline-flex bg-gray-100 rounded-full p-1">
        <button className="px-8 py-2 bg-emerald-500 text-white rounded-full text-sm font-medium">
          Token
        </button>
        <button className="px-8 py-2 text-gray-600 rounded-full text-sm font-medium">
          NFTs
        </button>
      </div>
    </div>
  );
};

// Main Dashboard Component
export const Dashboard: React.FC = () => {
  return (
    <div className="flex-1 bg-background pt-20 lg:pt-8 px-4 lg:px-8 pb-6 overflow-y-auto">
      <DesktopHeader />
      <MobileTabSelector />

      <div className="space-y-6 max-w-7xl mx-auto">
        <BalanceCard />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentTransactions />
          </div>
          <div className="space-y-6">
            <StakingSummary />
            <ConnectedWallet />
          </div>
        </div>
      </div>
    </div>
  );
};
