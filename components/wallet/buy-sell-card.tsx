import { CreditCard, BarChart3 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";

interface BuySellCardProps {
  setShowBuySellModal: (value: boolean) => void;
  setBuySellMode: (value: "buy" | "sell") => void;
}

const BuySellCard = ({
  setShowBuySellModal,
  setBuySellMode,
}: BuySellCardProps) => {
  return (
    <Card className="dark:border-border/30 text-primary dark:text-primary-foreground">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Buy/Sell Aeko Coin</CardTitle>
        <CardDescription>Exchange your Aeko Coin</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant={"outline"}
         className="w-full text-primary hover:text-white hover:bg-primary dark:hover:bg-primary/70 rounded-full"
          onClick={() => {
            setBuySellMode("buy");
            setShowBuySellModal(true);
          }}
        >
          <CreditCard className="mr-2 h-4 w-4" /> Buy Aeko Coin
        </Button>
        <Button
          variant="outline"
         className="w-full text-primary hover:text-white hover:bg-primary dark:hover:bg-primary/70 rounded-full"
          onClick={() => {
            setBuySellMode("sell");
            setShowBuySellModal(true);
          }}
        >
          <BarChart3 className="mr-2 h-4 w-4" /> Sell Aeko Coin
        </Button>
      </CardContent>
    </Card>
  );
};

export { BuySellCard };
