import { Label } from "@radix-ui/react-label";
import { X, ArrowDownUp } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";

interface BuySellModalProps {
  showBuySellModal: boolean;
  setShowBuySellModal: (value: boolean) => void;
  buySellMode: string;
  setBuySellMode: (value: string) => void;
  balance: string;
}

const BuySellModal = ({
  showBuySellModal,
  setShowBuySellModal,
  buySellMode,
  setBuySellMode,
  balance,
}: BuySellModalProps) => {
  return (
    showBuySellModal && (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={() => setShowBuySellModal(false)}
      >
        <div
          className="bg-background rounded-lg max-w-md w-full p-6 dark:border dark:border-primary/30"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">
              {buySellMode === "buy" ? "Buy" : "Sell"} Aeko Coin
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowBuySellModal(false)}
            >
              <X size={18} />
            </Button>
          </div>
          <Tabs
            value={buySellMode}
            onValueChange={setBuySellMode}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="buy"
                className="data-[state=active]:dark:bg-primary/70 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:dark:text-primary-foreground"
              >
                Buy
              </TabsTrigger>
              <TabsTrigger
                value="sell"
                className="data-[state=active]:dark:bg-primary/70 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:dark:text-primary-foreground"
              >
                Sell
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buy" className="space-y-4">
              <div className="space-y-2">
                <Label>You Pay</Label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="0.00"
                      className="border border-primary dark:border-primary/30"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500">USD</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-24 hover:text-primary text-white bg-primary dark:bg-primary/70 rounded-full"
                  >
                    USD
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <ArrowDownUp className="text-primary" />
              </div>
              <div className="space-y-2">
                <Label>You Receive</Label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="0.00"
                      className="border border-primary dark:border-primary/30"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500">AEKO</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-24 hover:text-primary text-white bg-primary dark:bg-primary/70 rounded-full"
                  >
                    AEKO
                  </Button>
                </div>
              </div>
              <div className="bg-background dark:border dark:border-primary/30 p-3 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-primary-foreground">
                    Exchange Rate
                  </span>
                  <span>1 AEKO ≈ $10.00 USD</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500 dark:text-primary-foreground">
                    Fee
                  </span>
                  <span>$2.50 USD</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full text-primary hover:text-white hover:bg-primary dark:hover:bg-primary/70 rounded-full"
              >
                Continue to Payment
              </Button>
            </TabsContent>

            <TabsContent value="sell" className="space-y-4">
              <div className="space-y-2 text-primary dark:text-primary-foreground">
                <Label>You Sell</Label>
                <div className="flex space-x-2 ">
                  <div className="relative flex-1">
                    <Input
                      placeholder="0.00"
                      className="border border-primary dark:border-primary/30"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500">AEKO</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-24 hover:text-primary text-white bg-primary dark:bg-primary/70 rounded-full"
                  >
                    AEKO
                  </Button>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Available: {balance} AEKO
                  </span>
                  <button className="text-primary">Max</button>
                </div>
              </div>
              <div className="flex justify-center">
                <ArrowDownUp className="text-primary" />
              </div>
              <div className="space-y-2 text-primary dark:text-primary-foreground">
                <Label>You Receive</Label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="0.00"
                      className="border border-primary dark:border-primary/30"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500">USD</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-24 hover:text-primary text-white bg-primary dark:bg-primary/70 rounded-full"
                  >
                    USD
                  </Button>
                </div>
              </div>
              <div className="bg-background dark:border dark:border-primary/30 p-3 rounded-lg text-primary dark:text-primary-foreground">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-primary-foreground">
                    Exchange Rate
                  </span>
                  <span>1 AEKO ≈ $10.00 USD</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500 dark:text-primary-foreground">
                    Fee
                  </span>
                  <span>$2.50 USD</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full text-primary hover:text-white hover:bg-primary dark:hover:bg-primary/70 rounded-full"
              >
                Review Sale
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  );
};

export { BuySellModal };
