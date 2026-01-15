"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface AssetPageProps {
  params: {
    id: string;
  };
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

export default function AssetPage({ params }: AssetPageProps) {
  const [activeTab, setActiveTab] = useState<string>("Transactions");
  const assetId = parseInt(params.id);
  
  // In a real app, you would fetch the asset data based on the ID
  const asset = {
    id: assetId,
    name: "Ethereum",
    symbol: "ETH",
    amount: 1.245,
    value: 3245.67,
    pricePerUnit: 2608.57,
    change: 2.5,
    logo: "/placeholder.svg",
    description: "Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether is the native cryptocurrency of the platform.",
    marketCap: "$315.5B",
    volume24h: "$15.7B",
    circulatingSupply: "120.8M ETH",
  };

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
      asset: "ETH",
      amount: 0.25,
      value: 622.84,
      address: "0x8765...4321",
      timestamp: "Yesterday",
      status: "completed",
    },
    {
      id: 3,
      type: "swap",
      asset: "BTC → ETH",
      amount: 0.75,
      value: 1867.51,
      address: "",
      timestamp: "3 days ago",
      status: "completed",
    },
  ];

  const tabs = ["Transactions", "About", "Market Data"];

  return (
    <div className="space-y-6 px-4">
      <Link 
        href="/wallet" 
        className="text-blue-gem-500 dark:text-green-yellow-300 hover:underline inline-flex items-center mb-4"
      >
        ← Back to Wallet
      </Link>

      {/* Asset Overview */}
      <div className="border border-border dark:border-border/30 bg-background/95 backdrop-blur-md rounded-2xl overflow-hidden p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={asset.logo} />
              <AvatarFallback className="bg-gray-300 text-gray-600 text-lg font-bold">
                {asset.symbol}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-blue-gem-50 dark:text-green-yellow-300">
                {asset.name} <span className="text-gray-500 dark:text-gray-400">{asset.symbol}</span>
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <div className="text-xl font-semibold text-blue-gem-50 dark:text-green-yellow-100">
                  ${asset.pricePerUnit.toLocaleString()}
                </div>
                <Badge 
                  className={`${asset.change >= 0 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"}`}
                >
                  {asset.change >= 0 ? "+" : ""}{asset.change}%
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button className="rounded-full px-4">
              Buy
            </Button>
            <Button variant="outline" className="rounded-full px-4">
              Send
            </Button>
            <Button variant="outline" className="rounded-full px-4">
              Receive
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400">Your Balance</div>
            <div className="text-xl font-bold text-blue-gem-50 dark:text-green-yellow-100 mt-1">
              {asset.amount} {asset.symbol}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              ${asset.value.toLocaleString()}
            </div>
          </div>
          
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400">Price Change (24h)</div>
            <div className="text-xl font-bold text-blue-gem-50 dark:text-green-yellow-100 mt-1">
              {asset.change >= 0 ? "+" : ""}{asset.change}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              ${(asset.pricePerUnit * asset.change / 100).toFixed(2)}
            </div>
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

      {/* Transactions Tab Content */}
      {activeTab === "Transactions" && (
        <div className="border border-border dark:border-border/30 bg-background/95 backdrop-blur-md rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border dark:border-border/30">
            <h3 className="font-semibold text-blue-gem-50 dark:text-green-yellow-300">
              {asset.symbol} Transactions
            </h3>
          </div>
          <div className="divide-y divide-border dark:divide-border/30">
            {transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
          {transactions.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No transactions found for this asset.
            </div>
          )}
        </div>
      )}

      {/* About Tab Content */}
      {activeTab === "About" && (
        <div className="border border-border dark:border-border/30 bg-background/95 backdrop-blur-md rounded-2xl overflow-hidden p-6">
          <h3 className="font-semibold text-blue-gem-50 dark:text-green-yellow-300 mb-4">
            About {asset.name}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {asset.description}
          </p>
          <div className="flex items-center justify-center">
            <a 
              href={`https://etherscan.io/token/${asset.symbol}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-gem-500 dark:text-green-yellow-300 hover:underline inline-flex items-center gap-1"
            >
              View on Blockchain Explorer <ExternalLink size={14} />
            </a>
          </div>
        </div>
      )}

      {/* Market Data Tab Content */}
      {activeTab === "Market Data" && (
        <div className="border border-border dark:border-border/30 bg-background/95 backdrop-blur-md rounded-2xl overflow-hidden p-6">
          <h3 className="font-semibold text-blue-gem-50 dark:text-green-yellow-300 mb-4">
            Market Data
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Market Cap</div>
              <div className="text-lg font-bold text-blue-gem-50 dark:text-green-yellow-100 mt-1">
                {asset.marketCap}
              </div>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">24h Volume</div>
              <div className="text-lg font-bold text-blue-gem-50 dark:text-green-yellow-100 mt-1">
                {asset.volume24h}
              </div>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Circulating Supply</div>
              <div className="text-lg font-bold text-blue-gem-50 dark:text-green-yellow-100 mt-1">
                {asset.circulatingSupply}
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h4 className="font-medium text-blue-gem-50 dark:text-green-yellow-300 mb-3">
              Price Chart
            </h4>
            <div className="aspect-[16/9] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">Price chart would go here</span>
            </div>
          </div>
        </div>
      )}
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
    </div>
  );
}