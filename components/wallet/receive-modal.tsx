import { Label } from "@radix-ui/react-label";
import { X, Copy } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ReceiveModalProps {
  showReceiveModal: boolean;
  setShowReceiveModal: (value: boolean) => void;
  walletAddress: string;
}

const ReceiveModal = ({
  showReceiveModal,
  setShowReceiveModal,
  walletAddress,
}: ReceiveModalProps) => {
  return (
    showReceiveModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-lg max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Receive Aeko Coin</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowReceiveModal(false)}
            >
              <X size={18} />
            </Button>
          </div>
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">QR Code</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Your Wallet Address</Label>
              <div className="flex">
                <Input
                  value={walletAddress}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button variant="outline" className="ml-2 bg-transparent">
                  <Copy size={16} />
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Send only Aeko Coin to this address. Sending any other coins may
                result in permanent loss.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export { ReceiveModal };
