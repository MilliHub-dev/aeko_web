"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function NotificationsSettingsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background p-6">
      {/* Header with back navigation */}
      <div className="flex items-center mb-4">
        <Link href="/settings" legacyBehavior>
          <Button variant="ghost" className="p-0 mr-2">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Push Notifications</h1>
      </div>

      {/* Placeholder card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Notification Settings (coming soon)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section will let users toggle categories, enable quiet mode,
            priority‑only mode, and customize notification behavior.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
