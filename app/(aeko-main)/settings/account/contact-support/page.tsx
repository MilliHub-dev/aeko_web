// aeko/app/(aeko-main)/settings/account/contact-support/page.tsx
"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ContactSupportPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background p-6">
      {/* Header with back navigation */}
      <div className="flex items-center mb-4">
        <Link href="/settings/account" legacyBehavior>
          <Button variant="ghost" className="p-0 mr-2">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Contact Support</h1>
      </div>

      {/* Placeholder card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Need help?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This is a placeholder for the Contact Support screen. From here you will be
            able to send a ticket, report a problem, or open an in‑app chat with our
            support team.
          </p>
          <Button disabled className="w-full">
            Submit Ticket (coming soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
