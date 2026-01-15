"use client";

import React, { createContext, useContext, useState } from "react";

// Types
export interface Transaction {
  id: string;
  type: "received" | "sent";
  title: string;
  amount: number;
  date: string;
  avatar?: string;
  icon?: string;
}

interface WalletState {
  balance: number;
  usdValue: number;
  percentChange: number;
  totalStaked: number;
  currentAPR: number;
  totalRewards: number;
  connectedWallet: string;
  transactions: Transaction[];
}

// Context
interface WalletContextType extends WalletState {
  setActiveView: (view: string) => void;
  activeView: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within WalletProvider");
  return context;
};

// Provider
export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeView, setActiveView] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const walletState: WalletState = {
    balance: 5.67000023,
    usdValue: 15.23,
    percentChange: 5.6,
    totalStaked: 2000.0,
    currentAPR: 10.5,
    totalRewards: 70.0,
    connectedWallet: "0xcg...ard2",
    transactions: [
      {
        id: "1",
        type: "received",
        title: "Reel Tips",
        amount: 1.8,
        date: "16hr",
        icon: "🎬",
      },
      {
        id: "2",
        type: "received",
        title: "Referral Tips",
        amount: 2.2,
        date: "1d",
        icon: "👥",
      },
      {
        id: "3",
        type: "sent",
        title: "Riyyat Breem",
        amount: -3.0,
        date: "Jun, 16th",
        avatar: "👤",
      },
      {
        id: "4",
        type: "received",
        title: "Clinton Rayyan",
        amount: 430.0,
        date: "Aug, 7th",
        avatar: "👤",
      },
    ],
  };

  return (
    <WalletContext.Provider
      value={{
        ...walletState,
        activeView,
        setActiveView,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
      }}>
      {children}
    </WalletContext.Provider>
  );
};
