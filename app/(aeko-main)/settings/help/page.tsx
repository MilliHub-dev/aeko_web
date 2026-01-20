"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function HelpCenterPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background p-6">
      {/* Header with back navigation */}
      <div className="flex items-center mb-4">
        <Link href="/settings" legacyBehavior>
          <Button variant="ghost" className="p-0 mr-2">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Help Center</h1>
      </div>

      {/* Placeholder content */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Help Center (coming soon)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This section will provide a searchable FAQ, categorized help topics,
            and a quick link to contact support. It will feature accordion‑style
            expandable categories such as Account, Wallet, Posting, Security,
            and Ads.
          </p>
          <Button disabled className="w-full">
            Explore FAQs (coming soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
