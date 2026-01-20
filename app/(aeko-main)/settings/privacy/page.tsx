"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function PrivacySettingsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background p-6">
      {/* Header with back navigation */}
      <div className="flex items-center mb-4">
        <Link href="/settings" legacyBehavior>
          <Button variant="ghost" className="p-0 mr-2">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Privacy &amp; Security</h1>
      </div>

      {/* Placeholder card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section will contain privacy and security options such as login
            activity, two‑factor authentication, account visibility, blocked users,
            and more.
          </p>
          {/* Future components will replace this placeholder */}
        </CardContent>
      </Card>
    </div>
  );
}
