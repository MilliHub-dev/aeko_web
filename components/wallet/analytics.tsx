import { BarChart3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";

const AnalyticsTab = () => {
  return (
    <Card className="dark:border-border/30">
      <CardHeader>
        <CardTitle>Wallet Analytics</CardTitle>
        <CardDescription>Track your Aeko Coin performance</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>Analytics dashboard coming soon</p>
        </div>
      </CardContent>
    </Card>
  );
}
export { AnalyticsTab }