import { Copy, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface Transaction {
  id: string;
  type: "send" | "receive" | "redeem" | "buy" | "sell";
  amount: string;
  timestamp: string;
  status: string;
  from: string;
  to: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  getTransactionIcon: (type: string) => React.ReactElement;
  getTransactionColor: (type: string) => string;
}

const TransactionTable = ({
  transactions,
  getTransactionIcon,
  getTransactionColor,
}: TransactionTableProps) => {
  return (
    <Card className="dark:border-border/30">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>View all your Aeko Coin transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View (hidden on mobile) */}
        <div className="hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-primary dark:text-primary/70">Type</TableHead>
                <TableHead className="text-primary dark:text-primary/70">Transaction ID</TableHead>
                <TableHead className="text-primary dark:text-primary/70">Date & Time</TableHead>
                <TableHead className="text-primary dark:text-primary/70">Amount</TableHead>
                <TableHead className="text-primary dark:text-primary/70">Status</TableHead>
                <TableHead className="text-primary dark:text-primary/70">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <span className="capitalize">{tx.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="font-mono">{tx.id}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-6 w-6 p-0 text-primary"
                      >
                        <Copy size={14} />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{tx.timestamp}</TableCell>
                  <TableCell
                    className={`font-medium ${getTransactionColor(
                      tx.type
                    )}`}
                  >
                    {tx.amount} AEKO
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {tx.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-primary">
                      <ExternalLink size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View (hidden on desktop) */}
        <div className="block sm:hidden space-y-4">
          {transactions.map((tx, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 bg-background dark:border-border/30 hover:bg-background/20"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center mr-2">
                    {getTransactionIcon(tx.type)}
                  </div>
                  <span className="capitalize font-medium">{tx.type}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-primary dark:text-primary-foreground"
                >
                  <ExternalLink size={14} />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-primary dark:text-primary-foreground">
                    Amount
                  </span>
                  <p className={`font-medium ${getTransactionColor(tx.type)}`}>
                    {tx.amount} AEKO
                  </p>
                </div>
                <div>
                  <span className="text-primary dark:text-primary-foreground">
                    Date
                  </span>
                  <p className="text-primary dark:text-primary-foreground">
                    {tx.timestamp}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <div>
                  <span className="text-primary dark:text-primary-foreground">
                    ID
                  </span>
                  <div className="flex items-center">
                    <span className="font-mono text-xs text-primary dark:text-primary-foreground">
                      {tx.id}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-5 w-5 p-0 text-primary dark:text-primary-foreground"
                    >
                      <Copy size={12} />
                    </Button>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="default" className="rounded-full">
          Load More
        </Button>
      </CardFooter>
    </Card>
  );
};

export { TransactionTable };
export type { Transaction };