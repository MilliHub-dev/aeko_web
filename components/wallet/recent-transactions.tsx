"use client";

import React from "react";
import { useWallet, Transaction } from "./wallet-context";

export const TransactionItem: React.FC<{ transaction: Transaction }> = ({
  transaction,
}) => {
  const isPositive = transaction.type === "received";

  return (
    <div className="flex items-center justify-between p-4 hover:bg-secondary/50 rounded-xl transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-xl text-foreground">
          {transaction.icon || transaction.avatar}
        </div>
        <div>
          <p className="text-foreground font-semibold">{transaction.title}</p>
          <p className="text-muted-foreground text-sm capitalize">
            {transaction.type}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`font-bold flex items-center gap-1 ${
            isPositive ? "text-primary" : "text-destructive"
          }`}>
          <span className="text-xs">⚡</span>
          {isPositive ? "" : ""}
          {Math.abs(transaction.amount).toFixed(2)}
        </p>
        <p className="text-muted-foreground text-sm">{transaction.date}</p>
      </div>
    </div>
  );
};

export const RecentTransactions: React.FC = () => {
  const { transactions } = useWallet();

  return (
    <div className="bg-card border border-border rounded-2xl p-4 lg:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <h3 className="text-foreground text-xl lg:text-2xl font-bold">
          Transactions
        </h3>
        <button className="text-primary hover:text-primary/80 text-sm font-medium">
          View all
        </button>
      </div>
      <div className="space-y-1">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
};
