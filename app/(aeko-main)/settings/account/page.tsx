"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccountSettingsPage() {
  const sections = [
    {
      href: "/settings/account/edit-profile",
      title: "Edit Profile",
      description: "Update your name, username, bio and pictures",
    },
    {
      href: "/settings/account/change-password",
      title: "Change Password",
      description: "Update your password with validation",
    },
    {
      href: "/settings/account/contact-support",
      title: "Contact Support",
      description: "Send a ticket or report a problem",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background p-6">
      <div className="flex items-center mb-4">
        <Link href="/settings" legacyBehavior>
          <Button variant="ghost" className="p-0 mr-2">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Account &amp; Profile</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((sec) => (
          <Link key={sec.href} href={sec.href} legacyBehavior>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle>{sec.title}</CardTitle>
                <CardDescription>{sec.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end pt-2">
                <Button variant="link" className="p-0">
                  Go →
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
