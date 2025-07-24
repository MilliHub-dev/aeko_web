import { ChevronDown, Wallet } from "lucide-react";
import { Button } from "../ui/button";

// Header Component Props
interface HeaderProps {
  isWalletConnected: boolean;
  walletAddress: string;
  setShowConnectModal: (value: boolean) => void;
  handleDisconnectWallet: () => void;
}

const Header = ({
  isWalletConnected,
  walletAddress,
  setShowConnectModal,
  handleDisconnectWallet,
}: HeaderProps) => {
  const truncateAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <header className="md:flex flex-col md:flex-row justify-between items-center mb-8">
      <div className="hidden mb-4 md:mb-0">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">
          Aeko Wallet
        </h1>
        <p className="text-primary">Manage your Aeko Coin assets</p>
      </div>
      {isWalletConnected ? (
        <div className="flex items-center space-x-2 justify-end w-full">
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Connected
          </div>
          <Button
            variant="outline"
            className="flex items-center space-x-2 bg-transparent"
            onClick={() => {}}
          >
            <span className="text-primary dark:text-primary-foreground">{truncateAddress(walletAddress)}</span>
            <ChevronDown size={16} className="text-primary dark:text-primary-foreground" />
          </Button>
          <Button variant="default" size="sm" className="rounded-full bg-transparent hover:bg-red-400 hover:text-white border border-red-400 text-red-400" onClick={handleDisconnectWallet}>
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          className="hidden bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2 font-medium"
          onClick={() => setShowConnectModal(true)}
        >
          <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
        </Button>
      )}
    </header>
  );
};

export { Header };
