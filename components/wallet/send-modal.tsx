import { Label } from "@radix-ui/react-label";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface SendModalProps {
  showSendModal: boolean;
  setShowSendModal: (value: boolean) => void;
  balance: string;
}

const SendModal = ({
  showSendModal,
  setShowSendModal,
  balance,
}: SendModalProps) => {
  return (
    showSendModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Send Aeko Coin</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowSendModal(false)}
            >
              <X size={18} />
            </Button>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input id="recipient" placeholder="0x..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <Input id="amount" placeholder="0.00" />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500">AEKO</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Available: {balance} AEKO</span>
                <button className="text-blue-600">Max</button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Input id="note" placeholder="Add a note to this transaction" />
            </div>
            <div className="pt-2">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                Review Transaction
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export { SendModal }
