import { Label } from "@radix-ui/react-label";
import { X, ArrowDownUp } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface BuySellModalProps {
  showBuySellModal: boolean;
  setShowBuySellModal: (value: boolean) => void;
  buySellMode: "buy" | "sell";
  setBuySellMode: (value: "buy" | "sell") => void;
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
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
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
          <div className="space-y-4">
            <div className="flex border rounded-lg overflow-hidden">
              <button
                className={`flex-1 py-2 text-center ${
                  buySellMode === "buy"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
                onClick={() => setBuySellMode("buy")}
              >
                Buy
              </button>
              <button
                className={`flex-1 py-2 text-center ${
                  buySellMode === "sell"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
                onClick={() => setBuySellMode("sell")}
              >
                Sell
              </button>
            </div>
            {buySellMode === "buy" ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>You Pay</Label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Input placeholder="0.00" />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500">USD</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-24 bg-transparent">
                      USD
                    </Button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <ArrowDownUp className="text-gray-400" />
                </div>
                <div className="space-y-2">
                  <Label>You Receive</Label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Input placeholder="0.00" />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500">AEKO</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-24 bg-transparent">
                      AEKO
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Exchange Rate</span>
                    <span>1 AEKO ≈ $10.00 USD</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">Fee</span>
                    <span>$2.50 USD</span>
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Continue to Payment
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>You Sell</Label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Input placeholder="0.00" />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500">AEKO</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-24 bg-transparent">
                      AEKO
                    </Button>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Available: {balance} AEKO
                    </span>
                    <button className="text-blue-600">Max</button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <ArrowDownUp className="text-gray-400" />
                </div>
                <div className="space-y-2">
                  <Label>You Receive</Label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Input placeholder="0.00" />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500">USD</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-24 bg-transparent">
                      USD
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Exchange Rate</span>
                    <span>1 AEKO ≈ $10.00 USD</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">Fee</span>
                    <span>$2.50 USD</span>
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Review Sale
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export { BuySellModal };
