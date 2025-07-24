import { X } from "lucide-react";
import { Button } from "../ui/button";

interface ConnectWalletModalProps {
  showConnectModal: boolean;
  setShowConnectModal: (value: boolean) => void;
  handleConnectWallet: (walletType: string) => void;
}

const ConnectWalletModal = ({
  showConnectModal,
  setShowConnectModal,
  handleConnectWallet,
}: ConnectWalletModalProps) => {
  return (
    showConnectModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Connect Wallet</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowConnectModal(false)}
            >
              <X size={18} />
            </Button>
          </div>
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start h-14 text-lg bg-transparent"
              onClick={() => handleConnectWallet("metamask")}
            >
              <div className="w-8 h-8 rounded-full bg-orange-100 mr-4"></div>
              MetaMask
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-14 text-lg bg-transparent"
              onClick={() => handleConnectWallet("walletconnect")}
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 mr-4"></div>
              WalletConnect
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-14 text-lg bg-transparent"
              onClick={() => handleConnectWallet("coinbase")}
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 mr-4"></div>
              Coinbase Wallet
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-14 text-lg bg-transparent"
              onClick={() => handleConnectWallet("trustwallet")}
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 mr-4"></div>
              Trust Wallet
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            By connecting your wallet, you agree to our Terms of Service and
            Privacy Policy.
          </p>
        </div>
      </div>
    )
  );
}

export { ConnectWalletModal }
