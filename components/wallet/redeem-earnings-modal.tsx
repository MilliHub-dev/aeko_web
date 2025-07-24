import { Label } from "@radix-ui/react-label";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

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
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={() => setShowRedeemModal(false)}
      >
        <div
          className="bg-background dark:border dark:border-primary/30 rounded-lg max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-primary dark:text-primary-foreground">
              Redeem Creator Earnings
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-primary dark:text-primary-foreground"
              onClick={() => setShowRedeemModal(false)}
            >
              <X size={18} />
            </Button>
          </div>
          <div className="space-y-4">
            <div className="bg-background border border-primary/30 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Available Earnings</span>
                <span className="font-bold text-primary dark:text-primary-foreground">
                  {earnings} AEKO
                </span>
              </div>
            </div>
            <div className="space-y-2 text-primary dark:text-primary-foreground">
              <Label htmlFor="redeemAmount">Amount to Redeem</Label>
              <div className="relative">
                <Input
                  id="redeemAmount"
                  placeholder="0.00"
                  className="border border-primary/30"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500">AEKO</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Minimum: 10 AEKO</span>
                <button className="text-primary">Max</button>
              </div>
            </div>
            <div className="space-y-2 text-primary dark:text-primary-foreground">
              <Label>Redemption Method</Label>
              <RadioGroup
                defaultValue="wallet"
                className="grid grid-cols-2 gap-3 border border-primary/30 p-2 rounded-lg bg-black-500/90"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wallet" id="wallet" />
                  <Label htmlFor="wallet" className="text-sm">
                    Wallet Transfer
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="text-sm">
                    Bank Account
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="pt-2">
              <Button
                variant={"outline"}
                className="w-full text-primary bg-transparent rounded-full"
              >
                Redeem Earnings
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export { RedeemEarningsModal };
