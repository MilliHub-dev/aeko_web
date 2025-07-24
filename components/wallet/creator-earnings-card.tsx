import { Gift } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";

interface CreatorEarningsCardProps {
  earnings: string;
  setShowRedeemModal: (value: boolean) => void;
}

const CreatorEarningsCard = ({
  earnings,
  setShowRedeemModal,
}: CreatorEarningsCardProps) => {
  return (
    <Card className="dark:border-border/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Creator Earnings</CardTitle>
        <CardDescription>Available to redeem</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold">{earnings}</span>
          <span className="ml-2 text-gray-500">AEKO</span>
        </div>
        <div className="text-sm text-gray-500 mt-1">≈ $4,567.80 USD</div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          variant={"outline"}
          className="w-full text-primary hover:text-primary/90 bg-transparent rounded-full"
          onClick={() => setShowRedeemModal(true)}
        >
          <Gift className="mr-2 h-4 w-4" /> Redeem Earnings
        </Button>
      </CardFooter>
    </Card>
  );
}

export { CreatorEarningsCard }
