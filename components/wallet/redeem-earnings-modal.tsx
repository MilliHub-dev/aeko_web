import { Label } from "@radix-ui/react-label";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface RedeemEarningsModalProps {
  showRedeemModal: boolean;
  setShowRedeemModal: (value: boolean) => void;
  earnings: string;
}

const RedeemEarningsModal = ({
  showRedeemModal,
  setShowRedeemModal,
  earnings,
}: RedeemEarningsModalProps) => {
  return (
    showRedeemModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Redeem Creator Earnings</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowRedeemModal(false)}
            >
              <X size={18} />
            </Button>
          </div>
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Available Earnings</span>
                <span className="font-bold">{earnings} AEKO</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="redeemAmount">Amount to Redeem</Label>
              <div className="relative">
                <Input id="redeemAmount" placeholder="0.00" />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500">AEKO</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Minimum: 10 AEKO</span>
                <button className="text-purple-600">Max</button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Redemption Method</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="justify-start bg-transparent"
                >
                  <div className="w-4 h-4 rounded-full border-2 border-purple-600 mr-2 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                  </div>
                  Wallet Transfer
                </Button>
                <Button
                  variant="outline"
                  className="justify-start bg-transparent"
                >
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 mr-2"></div>
                  Bank Account
                </Button>
              </div>
            </div>
            <div className="pt-2">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Redeem Earnings
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export {RedeemEarningsModal}