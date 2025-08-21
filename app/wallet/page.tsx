"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Settings,
  Copy,
  Check,
  CreditCard,
  History,
  TrendingUp,
  Shield,
  HelpCircle,
  FileText,
  Send,
  Download,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
} from "lucide-react";

export default function AekoWallet() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sendAmount, setSendAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("Token");
  const [insufficientBalance, setInsufficientBalance] = useState(false);

  const balance = 5.67000023;
  const usdValue = 15.23;
  const availableBalance = 10;
  const withdrawalFee = 0.8;

  const transactions = [
    {
      id: 1,
      type: "received",
      title: "Reel Tips",
      amount: 1.8,
      time: "16hr",
      icon: "🎬",
      status: "completed",
    },
    {
      id: 2,
      type: "received",
      title: "Referral Tips",
      amount: 2.2,
      time: "1d",
      icon: "👥",
      status: "completed",
    },
    {
      id: 3,
      type: "sent",
      title: "Riyyat Breem",
      amount: -3.0,
      time: "Jun, 16th",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "completed",
    },
    {
      id: 4,
      type: "received",
      title: "Clinton Rayyan",
      amount: 430.0,
      time: "Aug, 7th",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "completed",
    },
  ];

  const handleWithdraw = () => {
    const withdrawAmountNum = Number.parseFloat(withdrawAmount);
    if (withdrawAmountNum > availableBalance) {
      setInsufficientBalance(true);
      return;
    }
    setShowSuccess(true);
    setInsufficientBalance(false);
    setWithdrawAmount("");
  };

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Wallet },
    { id: "send", label: "Send", icon: Send },
    { id: "receive", label: "Receive", icon: ArrowDownLeft },
    { id: "withdraw", label: "Withdraw", icon: Download },
    { id: "transactions", label: "Transactions", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderSidebar = () => (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">A</span>
          </div>
          <div>
            <h1 className="font-semibold">Aeko Wallet</h1>
            <p className="text-xs text-muted-foreground">Digital Wallet</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              className="w-full justify-start gap-3 h-11"
              onClick={() => setActiveSection(item.id)}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">User Account</p>
            <p className="text-xs text-muted-foreground">Premium</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Overview</h1>
          <p className="text-muted-foreground">
            Manage your Aeko tokens and transactions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Token
          </Button>
        </div>
      </div>

      {/* Balance Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Balance Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Aekocoin Balance</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={activeTab === "Token" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setActiveTab("Token")}
                >
                  Token
                </Button>
                <Button
                  variant={activeTab === "NFTs" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setActiveTab("NFTs")}
                >
                  NFTs
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-4xl font-bold">{balance.toFixed(8)}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xl font-semibold">${usdValue}</span>
                  <span className="text-muted-foreground">(USD)</span>
                  <Badge
                    variant="secondary"
                    className="text-green-600 bg-green-50"
                  >
                    +5.6%
                  </Badge>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-4 gap-3 pt-4">
                <Button
                  className="flex flex-col gap-2 h-16"
                  onClick={() => setActiveSection("send")}
                >
                  <Send className="h-5 w-5" />
                  <span className="text-xs">Send</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col gap-2 h-16 bg-transparent"
                  onClick={() => setActiveSection("receive")}
                >
                  <ArrowDownLeft className="h-5 w-5" />
                  <span className="text-xs">Receive</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col gap-2 h-16 bg-transparent"
                  onClick={() => setActiveSection("withdraw")}
                >
                  <ArrowUpRight className="h-5 w-5" />
                  <span className="text-xs">Withdraw</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col gap-2 h-16 bg-transparent"
                >
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-xs">Stake</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Available Balance
                </span>
                <span className="font-medium">{availableBalance} AEKO</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Staked Amount
                </span>
                <span className="font-medium">2.5 AEKO</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Transactions
                </span>
                <span className="font-medium">47</span>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium">Recent Activity</p>
              <div className="text-xs text-muted-foreground">
                Last transaction: 16 hours ago
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button
              variant="ghost"
              onClick={() => setActiveSection("transactions")}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.slice(0, 4).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {tx.avatar ? (
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={tx.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{tx.title[0]}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-lg">{tx.icon}</span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{tx.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {tx.type === "received" ? "Received" : "Sent to"} •{" "}
                      {tx.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-xs">A</span>
                    </div>
                    <span
                      className={`font-semibold ${
                        tx.amount > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {tx.amount.toFixed(2)}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSend = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Send Aeko</h1>
        <p className="text-muted-foreground">
          Transfer tokens to another wallet
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Send Transaction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Recipient Address
              </label>
              <Input placeholder="Enter wallet address or username" />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Amount</label>
              <div className="relative">
                <Input
                  placeholder="0.00"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  className="pr-16"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-primary"
                  onClick={() => setSendAmount(availableBalance.toString())}
                >
                  Max
                </Button>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Available Balance</span>
              <span className="font-medium">{availableBalance} AEKO</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Network Fee</span>
              <span className="font-medium">0.001 AEKO</span>
            </div>

            <Button className="w-full" size="lg">
              Send Transaction
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">From</span>
                <span className="font-mono">0x1234...5678</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">To</span>
                <span className="font-mono">Not specified</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">{sendAmount || "0.00"} AEKO</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fee</span>
                <span>0.001 AEKO</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>
                  {(Number.parseFloat(sendAmount || "0") + 0.001).toFixed(3)}{" "}
                  AEKO
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderReceive = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Receive Aeko</h1>
        <p className="text-muted-foreground">
          Share your wallet address to receive tokens
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Wallet Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm">
                  0Z12234567123456789012345
                </span>
                <Button variant="ghost" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                Copy Address
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                Share Address
              </Button>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Recent Addresses</h3>
              <div className="space-y-2">
                {["0x1234...5678", "0x9876...4321", "0x5555...9999"].map(
                  (addr, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded hover:bg-muted/50"
                    >
                      <span className="font-mono text-sm">{addr}</span>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>QR Code</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm inline-block mb-4">
              <div className="w-48 h-48 bg-black rounded">
                <img
                  src="/placeholder.svg?height=192&width=192"
                  alt="QR Code"
                  className="w-full h-full"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Scan this QR code to send tokens to your wallet
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderWithdraw = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Withdraw Aeko</h1>
        <p className="text-muted-foreground">
          Transfer tokens to external wallet
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Withdrawal Amount
              </label>
              <div className="relative">
                <Input
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="pr-16"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-primary"
                  onClick={() => setWithdrawAmount(availableBalance.toString())}
                >
                  Max
                </Button>
              </div>
              {insufficientBalance && (
                <p className="text-destructive text-sm mt-1">
                  Insufficient balance
                </p>
              )}
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Available Balance</span>
                <span className="font-medium">{availableBalance} AEKO</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Withdrawal Fee</span>
                <span className="font-medium">{withdrawalFee} AEKO</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">You'll Receive</span>
                <span className="font-medium">
                  {Math.max(
                    0,
                    Number.parseFloat(withdrawAmount || "0") - withdrawalFee
                  ).toFixed(2)}{" "}
                  AEKO
                </span>
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={handleWithdraw}>
              Withdraw to External Wallet
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium mb-1">Processing Time</h4>
                <p className="text-muted-foreground">
                  Usually takes 5-10 minutes
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Minimum Amount</h4>
                <p className="text-muted-foreground">1.0 AEKO</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Network</h4>
                <p className="text-muted-foreground">Aeko Network</p>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Recent Withdrawals</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>5.0 AEKO</span>
                  <span className="text-muted-foreground">2 days ago</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>12.5 AEKO</span>
                  <span className="text-muted-foreground">1 week ago</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <p className="text-muted-foreground">
            View and manage all your transactions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="space-y-0">
            {transactions.map((tx, index) => (
              <div key={tx.id}>
                <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    {tx.avatar ? (
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={tx.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{tx.title[0]}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        <span className="text-xl">{tx.icon}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{tx.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {tx.type === "received" ? "Received from" : "Sent to"} •{" "}
                        {tx.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground text-xs">
                          A
                        </span>
                      </div>
                      <span
                        className={`font-semibold text-lg ${
                          tx.amount > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {tx.amount > 0 ? "+" : ""}
                        {tx.amount.toFixed(2)}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {tx.status}
                    </Badge>
                  </div>
                </div>
                {index < transactions.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your wallet preferences and security
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Wallet Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                icon: CreditCard,
                label: "Wallet Address",
                desc: "View and manage addresses",
              },
              {
                icon: Wallet,
                label: "Backup Wallet",
                desc: "Secure your wallet backup",
              },
              {
                icon: TrendingUp,
                label: "Coin Value",
                desc: "Price alerts and tracking",
              },
            ].map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start gap-3 h-auto p-4"
              >
                <item.icon className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.desc}
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security & Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                icon: Shield,
                label: "Security Settings",
                desc: "2FA and authentication",
              },
              {
                icon: HelpCircle,
                label: "Help & Support",
                desc: "Get help and contact us",
              },
              {
                icon: FileText,
                label: "Terms & Privacy",
                desc: "Legal documents",
              },
            ].map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start gap-3 h-auto p-4"
              >
                <item.icon className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.desc}
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* {renderSidebar()} */}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {activeSection === "overview" && renderOverview()}
          {activeSection === "send" && renderSend()}
          {activeSection === "receive" && renderReceive()}
          {activeSection === "withdraw" && renderWithdraw()}
          {activeSection === "transactions" && renderTransactions()}
          {activeSection === "settings" && renderSettings()}
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Check className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Withdrawal Successful!
              </h2>
              <p className="text-muted-foreground">
                Aeko withdrawn successfully
              </p>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                setShowSuccess(false);
                setWithdrawAmount("");
              }}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
