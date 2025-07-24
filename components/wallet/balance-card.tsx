import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";

// BalanceCard Component Props
interface BalanceCardProps {
  balance: string;
  setShowSendModal: (value: boolean) => void;
  setShowReceiveModal: (value: boolean) => void;
}

const BalanceCard = ({
  balance,
  setShowSendModal,
  setShowReceiveModal,
}: BalanceCardProps) => {
  return (
    <Card className="md:col-span-2 xl:col-span-1 dark:border-border/30">
      <CardHeader>
        <CardTitle className="text-xl">Aeko Coin Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold">{balance}</span>
          <span className="ml-2 text-gray-500">AEKO</span>
        </div>
        <div className="text-sm text-gray-500 mt-1">≈ $12,345.60 USD</div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 pt-0">
        <Button
          variant="default"
          className="w-full sm:flex-1 bg-red-400 dark:bg-transparent dark:text-red-400 border dark:border-red-400/30  hover:bg-red-300 rounded-full"
          onClick={() => setShowSendModal(true)}
        >
          <ArrowUpRight className="mr-2 h-4 w-4" />
          Send
        </Button>
        <Button
          variant="default"
          className="w-full sm:flex-1 dark:bg-transparent dark:text-primary dark:border dark:border-primary/30 hover:bg-primary/90 rounded-full"
          onClick={() => setShowReceiveModal(true)}
        >
          <ArrowDownLeft className="mr-2 h-4 w-4" />
          Receive
        </Button>
      </CardFooter>
    </Card>
  );
};

export { BalanceCard };
