"use client";

import React from "react";
import { WalletProvider } from "@/components/wallet/wallet-context";
import { MobileHeader } from "@/components/wallet/mobile-header";
import { MobileMenu } from "@/components/wallet/mobile-menu";
import { WalletSidebar } from "@/components/wallet/wallet-sidebar";
import { Dashboard } from "@/components/wallet/dashboard";

export default function AekoWallet() {
  return (
    <WalletProvider>
      <div className="flex h-screen bg-white overflow-hidden">
        <MobileHeader />
        <MobileMenu />
        <WalletSidebar />
        <Dashboard />
      </div>
    </WalletProvider>
  );
}
