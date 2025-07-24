"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";
import { useState } from "react";
import { ArrowDown, ArrowUp, Copy, ExternalLink, Plus, Wallet } from "lucide-react";

interface CryptoAsset {
  id: number;
  name: string;
  symbol: string;
  amount: number;
  value: number;
  change: number;
  logo: string;
}

interface Transaction {
  id: number;
  type: "send" | "receive" | "swap";
  asset: string;
  amount: number;
  value: number;
  address: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
}

export function WalletContent() {
  const [activeTab, setActiveTab] = useState<string>("Assets");
  const [walletAddress, setWalletAddress] = useState<string>("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");

  const tabs = ["Assets", "Activity", "Swap", "Send", "Receive"];

  const assets: CryptoAsset[] = [
    {
      id: 1,
      name: "Ethereum",
      symbol: "ETH",
      amount: 1.245,
      value: 3245.67,
      change: 2.5,
      logo: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Bitcoin",
      symbol: "BTC",
      amount: 0.085,
      value: 4532.21,
      change: -1.2,
      logo: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Solana",
      symbol: "SOL",
      amount: 12.5,
      value: 1245.89,
      change: 5.7,
      logo: "/placeholder.svg",
    },
    {
      id: 4,
      name: "USD Coin",
      symbol: "USDC",
      amount: 500,
      value: 500,
      change: 0,
      logo: "/placeholder.svg",
    },
  ];

  const transactions: Transaction[] = [
    {
      id: 1,
      type: "receive",
      asset: "ETH",
      amount: 0.5,
      value: 1245.67,
      address: "0x1234...5678",
      timestamp: "2 hours ago",
      status: "completed",
    },
    {
      id: 2,
      type: "send",
      asset: "SOL",
      amount: 2.5,
      value: 245.89,
      address: "0x8765...4321",
      timestamp: "Yesterday",
      status: "completed",
    },
    {
      id: 3,
      type: "swap",
      asset: "BTC → ETH",
      amount: 0.01,
      value: 532.21,
      address: "",
      timestamp: "3 days ago",
      status: "completed",
    },
    {
      id: 4,
      type: "send",
      asset: "USDC",
      amount: 100,
      value: 100,
      address: "0x9876...5432",
      timestamp: "5 days ago",
      status: "failed",
    },
  ];

  // Calculate total portfolio value
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    // In a real app, you would show a toast notification here
    alert("Address copied to clipboard");
  };

  return (
    <div className="min-h-screen">
      {/* Wallet Overview */}
      <div className="border border-border dark:border-border/30 bg-background/95 backdrop-blur-md rounded-2xl overflow-hidden p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-blue-gem-50 dark:text-green-yellow-300 mb-2">
              Total Balance
            </h2>
            <div className="text-3xl font-bold text-blue-gem-50 dark:text-green-yellow-100">
              ${totalValue.toLocaleString()}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button className="rounded-full px-4 flex items-center gap-2">
              <Plus size={16} />
              <span>Add Funds</span>
            </Button>
            <Button variant="outline" className="rounded-full px-4 flex items-center gap-2">
              <Wallet size={16} />
              <span>Connect Wallet</span>
            </Button>
          </div>
        </div>

        {/* Wallet Address */}
        <div className="mt-6 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-300 font-mono truncate">
            {walletAddress}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={copyToClipboard}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <Copy size={16} className="text-gray-500 dark:text-gray-400" />
            </button>
            <a 
              href={`https://etherscan.io/address/${walletAddress}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <ExternalLink size={16} className="text-gray-500 dark:text-gray-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 hide-scrollbar gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab
              ? "bg-blue-gem-500 text-white dark:bg-green-yellow-500 dark:text-gray-900"
              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Assets Tab Content */}
      {activeTab === "Assets" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        </div>
      )}

      {/* Activity Tab Content */}
      {activeTab === "Activity" && (
        <div className="space-y-4">
          <div className="border border-border dark:border-border/30 bg-background/95 backdrop-blur-md rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border dark:border-border/30">
              <h3 className="font-semibold text-blue-gem-50 dark:text-green-yellow-300">
                Recent Transactions
              </h3>
            </div>
            <div className="divide-y divide-border dark:divide-border/30">
              {transactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Swap Tab Content */}
      {activeTab === "Swap" && (
        <div className="border border-border dark:border-border/30 bg-background/95 backdrop-blur-md rounded-2xl overflow-hidden p-6">
          <h3 className="font-semibold text-blue-gem-50 dark:text-green-yellow-300 mb-4">
            Swap Tokens
          </h3>
          <SwapForm assets={assets} />
        </div>
      )}

      {/* Send Tab Content */}
      {activeTab === "Send" && (
        <div className="border border-border dark:border-border/30 bg-background/95 backdrop-blur-md rounded-2xl overflow-hidden p-6">
          <h3 className="font-semibold text-blue-gem-50 dark:text-green-yellow-300 mb-4">
            Send Crypto
          </h3>
          <SendForm assets={assets} />
        </div>
      )}

      {/* Receive Tab Content */}
      {activeTab === "Receive" && (
        <div className="border border-border dark:border-border/30 bg-background/95 backdrop-blur-md rounded-2xl overflow-hidden p-6">
          <h3 className="font-semibold text-blue-gem-50 dark:text-green-yellow-300 mb-4">
            Receive Crypto
          </h3>
          <ReceiveForm walletAddress={walletAddress} copyToClipboard={copyToClipboard} />
        </div>
      )}
    </div>
  );
}

function AssetCard({ asset }: { asset: CryptoAsset }) {
  return (
    <div className="border border-border dark:border-border/30 bg-background/95 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={asset.logo} />
              <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
                {asset.symbol}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-blue-gem-50 dark:text-green-yellow-100">
                {asset.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {asset.symbol}
              </p>
            </div>
          </div>
          <Badge 
            className={`${asset.change >= 0 
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"}`}
          >
            {asset.change >= 0 ? "+" : ""}{asset.change}%
          </Badge>
        </div>
        <div className="mt-2">
          <div className="text-xl font-bold text-blue-gem-50 dark:text-green-yellow-100">
            ${asset.value.toLocaleString()}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {asset.amount} {asset.symbol}
          </p>
        </div>
        <div className="mt-4 flex space-x-2">
          <Link 
            href={`/wallet/asset/${asset.id}`}
            className="text-sm text-blue-gem-500 dark:text-green-yellow-300 hover:underline"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const getTransactionIcon = () => {
    switch (transaction.type) {
      case "send":
        return <ArrowUp className="w-5 h-5 text-red-500" />;
      case "receive":
        return <ArrowDown className="w-5 h-5 text-green-500" />;
      case "swap":
        return (
          <div className="w-5 h-5 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-full">
            <ArrowDown className="w-3 h-3 text-blue-500 dark:text-blue-300 rotate-45" />
          </div>
        );
    }
  };

  const getStatusBadge = () => {
    switch (transaction.status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
            Failed
          </Badge>
        );
    }
  };

  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            {getTransactionIcon()}
          </div>
          <div>
            <div className="font-medium text-blue-gem-50 dark:text-green-yellow-100">
              {transaction.type === "send" ? "Sent" : transaction.type === "receive" ? "Received" : "Swapped"} {transaction.asset}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
              <span>{transaction.timestamp}</span>
              {transaction.address && (
                <>
                  <span>•</span>
                  <span className="font-mono">{transaction.address}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`font-medium ${transaction.type === "send" ? "text-red-500" : "text-green-500"}`}>
            {transaction.type === "send" ? "-" : "+"}{transaction.amount} {transaction.asset.split(" ")[0]}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            ${transaction.value.toLocaleString()}
          </div>
        </div>
      </div>
      <div className="mt-2 flex justify-end">
        {getStatusBadge()}
      </div>
    </div>
  );
}

function SwapForm({ assets }: { assets: CryptoAsset[] }) {
  const [fromAsset, setFromAsset] = useState<string>(assets[0].symbol);
  const [toAsset, setToAsset] = useState<string>(assets[1].symbol);
  const [amount, setAmount] = useState<string>("");

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">From</label>
          <div className="flex items-center space-x-2">
            <select 
              value={fromAsset}
              onChange={(e) => setFromAsset(e.target.value)}
              className="flex-1 p-3 rounded-lg border border-border dark:border-border/30 bg-background text-blue-gem-50 dark:text-green-yellow-100"
            >
              {assets.map((asset) => (
                <option key={asset.id} value={asset.symbol}>
                  {asset.symbol} - {asset.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <ArrowDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">To</label>
          <div className="flex items-center space-x-2">
            <select 
              value={toAsset}
              onChange={(e) => setToAsset(e.target.value)}
              className="flex-1 p-3 rounded-lg border border-border dark:border-border/30 bg-background text-blue-gem-50 dark:text-green-yellow-100"
            >
              {assets.map((asset) => (
                <option key={asset.id} value={asset.symbol}>
                  {asset.symbol} - {asset.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full p-3 rounded-lg border border-border dark:border-border/30 bg-background text-blue-gem-50 dark:text-green-yellow-100"
          />
        </div>

        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Exchange Rate</span>
            <span className="text-blue-gem-50 dark:text-green-yellow-100">1 {fromAsset} ≈ 15.5 {toAsset}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500 dark:text-gray-400">Fee</span>
            <span className="text-blue-gem-50 dark:text-green-yellow-100">0.5%</span>
          </div>
        </div>
      </div>

      <Button className="w-full rounded-lg py-3">
        Swap Tokens
      </Button>
    </div>
  );
}

function SendForm({ assets }: { assets: CryptoAsset[] }) {
  const [selectedAsset, setSelectedAsset] = useState<string>(assets[0].symbol);
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Asset</label>
          <select 
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="w-full p-3 rounded-lg border border-border dark:border-border/30 bg-background text-blue-gem-50 dark:text-green-yellow-100"
          >
            {assets.map((asset) => (
              <option key={asset.id} value={asset.symbol}>
                {asset.symbol} - {asset.name} (Balance: {asset.amount})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Recipient Address</label>
          <input 
            type="text" 
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="0x..."
            className="w-full p-3 rounded-lg border border-border dark:border-border/30 bg-background text-blue-gem-50 dark:text-green-yellow-100 font-mono"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full p-3 rounded-lg border border-border dark:border-border/30 bg-background text-blue-gem-50 dark:text-green-yellow-100"
          />
        </div>

        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Network Fee</span>
            <span className="text-blue-gem-50 dark:text-green-yellow-100">0.0005 ETH</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500 dark:text-gray-400">Total</span>
            <span className="text-blue-gem-50 dark:text-green-yellow-100">{amount || "0"} {selectedAsset} + 0.0005 ETH</span>
          </div>
        </div>
      </div>

      <Button className="w-full rounded-lg py-3">
        Send {selectedAsset}
      </Button>
    </div>
  );
}

function ReceiveForm({ walletAddress, copyToClipboard }: { walletAddress: string, copyToClipboard: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="w-48 h-48 bg-white p-2 rounded-lg">
          {/* QR Code would go here */}
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">QR Code</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Wallet Address</label>
        <div className="flex items-center">
          <input 
            type="text" 
            value={walletAddress}
            readOnly
            className="w-full p-3 rounded-l-lg border border-border dark:border-border/30 bg-background text-blue-gem-50 dark:text-green-yellow-100 font-mono"
          />
          <button 
            onClick={copyToClipboard}
            className="p-3 rounded-r-lg bg-blue-gem-500 dark:bg-green-yellow-500 text-white dark:text-gray-900"
          >
            <Copy size={20} />
          </button>
        </div>
      </div>

      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          Only send assets on the Ethereum network to this address. Sending assets from other networks may result in permanent loss.
        </p>
      </div>
    </div>
  );
}