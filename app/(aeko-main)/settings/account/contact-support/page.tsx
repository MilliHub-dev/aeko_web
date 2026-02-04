"use client";

import Link from "next/link";
import { ArrowLeft, Headphones, MessageSquare, Mail, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ContactSupportPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background px-4 py-8 md:px-8 max-w-7xl mx-auto w-full">
      {/* Header with back navigation */}
      <div className="flex items-center mb-8 gap-4">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" asChild>
          <Link href="/settings/account">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Contact Support</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Get help with your account or report an issue</p>
        </div>
      </div>

      <div className="grid gap-6 max-w-3xl mx-auto w-full">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                <Headphones className="w-5 h-5" />
              </div>
              <CardTitle>How can we help you?</CardTitle>
            </div>
            <CardDescription>Choose the best way to get in touch with our team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all" asChild>
                <Link href="/messages">
                  <MessageSquare className="w-8 h-8 text-blue-500" />
                  <div className="text-center">
                    <div className="font-semibold">Live Chat</div>
                    <div className="text-xs text-muted-foreground mt-1">Chat with support agent</div>
                  </div>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all" onClick={() => window.location.href = "mailto:support@aeko.social"}>
                <Mail className="w-8 h-8 text-purple-500" />
                <div className="text-center">
                  <div className="font-semibold">Email Support</div>
                  <div className="text-xs text-muted-foreground mt-1">support@aeko.social</div>
                </div>
              </Button>
            </div>
            
            <Separator />
            
            <div className="bg-muted/50 rounded-lg p-4 border flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <h4 className="font-medium text-sm">Report a technical issue</h4>
                <p className="text-xs text-muted-foreground">
                  Found a bug? Please let us know so we can fix it. Include screenshots if possible.
                </p>
                <Button variant="link" className="h-auto p-0 text-orange-500 mt-2 text-xs">
                  Report Bug &rarr;
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
