"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Wallet, Gift
} from "lucide-react";
import { Transaction, TransactionTable } from "@/components/wallet/transaction-table";
import { AnalyticsTab } from "@/components/wallet/analytics";
import { BalanceCard } from "@/components/wallet/balance-card";
import { BuySellCard } from "@/components/wallet/buy-sell-card";
import { BuySellModal } from "@/components/wallet/buy-sell-modal";
import { ConnectWalletModal } from "@/components/wallet/connect-wallet-modal";
import { CreatorEarningsCard } from "@/components/wallet/creator-earnings-card";
import { Header } from "@/components/wallet/header";
import { ReceiveModal } from "@/components/wallet/receive-modal";
import { RedeemEarningsModal } from "@/components/wallet/redeem-earnings-modal";
import { SendModal } from "@/components/wallet/send-modal";

export default function AekoWallet() {
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [showConnectModal, setShowConnectModal] = useState<boolean>(false);
  const [showSendModal, setShowSendModal] = useState<boolean>(false);
  const [showReceiveModal, setShowReceiveModal] = useState<boolean>(false);
  const [showRedeemModal, setShowRedeemModal] = useState<boolean>(false);
  const [showBuySellModal, setShowBuySellModal] = useState<boolean>(false);
  const [buySellMode, setBuySellMode] = useState<"buy" | "sell">("buy");

  // Mock data
  const walletAddress: string = "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t";
  const balance: string = "1,234.56";
  const earnings: string = "456.78";
  const transactions: Transaction[] = [
    {
      id: "0x1a2b...3c4d",
      type: "receive",
      amount: "+123.45",
      timestamp: "2023-07-22 14:30",
      status: "completed",
      from: "0x8f7e...6d5c",
      to: walletAddress,
    },
    {
      id: "0x5e6f...7g8h",
      type: "send",
      amount: "-45.67",
      timestamp: "2023-07-21 09:15",
      status: "completed",
      from: walletAddress,
      to: "0x4b3c...2d1e",
    },
    {
      id: "0x9i0j...1k2l",
      type: "redeem",
      amount: "+200.00",
      timestamp: "2023-07-20 16:45",
      status: "completed",
      from: "Earnings",
      to: walletAddress,
    },
    {
      id: "0x3m4n...5o6p",
      type: "buy",
      amount: "+500.00",
      timestamp: "2023-07-19 11:20",
      status: "completed",
      from: "Exchange",
      to: walletAddress,
    },
    {
      id: "0x7q8r...9s0t",
      type: "sell",
      amount: "-100.00",
      timestamp: "2023-07-18 15:10",
      status: "completed",
      from: walletAddress,
      to: "Exchange",
    },
    {
      id: "0x1u2v...3w4x",
      type: "receive",
      amount: "+75.30",
      timestamp: "2023-07-17 13:25",
      status: "completed",
      from: "0x5y6z...7a8b",
      to: walletAddress,
    },
  ];

  const handleConnectWallet = (walletType: string): void => {
    console.log(`Connecting to ${walletType}...`);
    setIsWalletConnected(true);
    setShowConnectModal(false);
  };

  const handleDisconnectWallet = (): void => {
    setIsWalletConnected(false);
  };

  const getTransactionIcon = (type: string): React.ReactElement => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="text-red-500" />;
      case "receive":
        return <ArrowDownLeft className="text-green-500" />;
      case "redeem":
        return <Gift className="text-purple-500" />;
      case "buy":
        return <ArrowDownLeft className="text-blue-500" />;
      case "sell":
        return <ArrowUpRight className="text-orange-500" />;
      default:
        return <Clock className="text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string): string => {
    switch (type) {
      case "send":
        return "text-red-500";
      case "receive":
      case "redeem":
      case "buy":
        return "text-green-500";
      case "sell":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background py-20 md:py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <Header
          isWalletConnected={isWalletConnected}
          walletAddress={walletAddress}
          setShowConnectModal={setShowConnectModal}
          handleDisconnectWallet={handleDisconnectWallet}
        />

        {isWalletConnected ? (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <BalanceCard
                balance={balance}
                setShowSendModal={setShowSendModal}
                setShowReceiveModal={setShowReceiveModal}
              />
              <CreatorEarningsCard
                earnings={earnings}
                setShowRedeemModal={setShowRedeemModal}
              />
              <BuySellCard
                setShowBuySellModal={setShowBuySellModal}
                setBuySellMode={setBuySellMode}
              />
            </div>
            <div className="">
              <Tabs defaultValue="transactions" className="w-full">
                <TabsList className="grid grid-cols-2 mb-6 w-full ">
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                <TabsContent value="transactions">
                  <TransactionTable
                    transactions={transactions}
                    getTransactionIcon={getTransactionIcon}
                    getTransactionColor={getTransactionColor}
                  />
                </TabsContent>
                <TabsContent value="analytics">
                  <AnalyticsTab />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="bg-gigas-200 dark:bg-background dark:border-border dark:border-1 p-6 rounded-full mb-6">
              <Wallet className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-primary">Connect Your Wallet</h2>
            <p className="text-gray-500 dark:text-primary-foreground max-w-md mb-8">
              Connect your wallet to access your Aeko Coin balance, send and
              receive tokens, and manage your earnings.
            </p>
            <Button
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2 font-medium"
              onClick={() => setShowConnectModal(true)}
            >
              <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
            </Button>
          </div>
        )}

        <ConnectWalletModal
          showConnectModal={showConnectModal}
          setShowConnectModal={setShowConnectModal}
          handleConnectWallet={handleConnectWallet}
        />
        <SendModal
          showSendModal={showSendModal}
          setShowSendModal={setShowSendModal}
          balance={balance}
        />
        <ReceiveModal
          showReceiveModal={showReceiveModal}
          setShowReceiveModal={setShowReceiveModal}
          walletAddress={walletAddress}
        />
        <RedeemEarningsModal
          showRedeemModal={showRedeemModal}
          setShowRedeemModal={setShowRedeemModal}
          earnings={earnings}
        />
        <BuySellModal
          showBuySellModal={showBuySellModal}
          setShowBuySellModal={setShowBuySellModal}
          buySellMode={buySellMode}
          setBuySellMode={setBuySellMode}
          balance={balance}
        />
      </div>
    </div>
  );
}
