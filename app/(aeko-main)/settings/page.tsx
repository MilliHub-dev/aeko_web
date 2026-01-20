"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Settings Hub – the entry point for the Settings feature.
 * It displays navigation cards that link to the various settings sections
 * (Account & Profile, Privacy & Security, Notifications, Theme, Language, Help Center).
 * The UI re‑uses the existing Tailwind‑based design system and shared UI components.
 */
export default function SettingsPage() {
  const sections = [
    {
      href: "/settings/account",
      title: "Account & Profile",
      description: "Edit your profile, change your password and contact support",
    },
    {
      href: "/settings/privacy",
      title: "Privacy & Security",
      description: "Login activity, two‑factor authentication, account visibility",
    },
    {
      href: "/settings/notifications",
      title: "Push Notifications",
      description: "Manage which notifications you receive and smart controls",
    },
    {
      href: "/settings/theme",
      title: "Theme & Appearance",
      description: "Choose light, dark or system theme and adjust font size",
    },
    {
      href: "/settings/language",
      title: "Language & Localization",
      description: "Select language, region and text size",
    },
    {
      href: "/settings/help",
      title: "Help Center",
      description: "FAQs, contact support and policy documents",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background px-4 py-8 md:px-8">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <Link href="/" legacyBehavior>
          <Button variant="ghost" className="p-0 mr-2">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Grid of navigation cards */}
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
