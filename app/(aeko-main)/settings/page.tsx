"use client";

import Link from "next/link";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  HelpCircle, 
  ArrowLeft,
  ChevronRight,
  Megaphone
} from "lucide-react";

/**
 * Settings Hub – the entry point for the Settings feature.
 * It displays navigation cards that link to the various settings sections.
 * Revamped UI with icons, better typography, and hover effects.
 */
export default function SettingsPage() {
  const sections = [
    {
      href: "/settings/account",
      title: "Account & Profile",
      description: "Edit your profile, change your password and contact support",
      icon: User,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      href: "/settings/privacy",
      title: "Privacy & Security",
      description: "Login activity, two‑factor authentication, account visibility",
      icon: Shield,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      href: "/settings/notifications",
      title: "Push Notifications",
      description: "Manage which notifications you receive and smart controls",
      icon: Bell,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    },
    {
      href: "/settings/ads",
      title: "Ads Manager",
      description: "Create and manage your advertisements and view analytics",
      icon: Megaphone,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10"
    },
    {
      href: "/settings/theme",
      title: "Theme & Appearance",
      description: "Choose light, dark or system theme and adjust font size",
      icon: Palette,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      href: "/settings/language",
      title: "Language & Localization",
      description: "Select language, region and text size",
      icon: Globe,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10"
    },
    {
      href: "/settings/help",
      title: "Help Center",
      description: "FAQs, contact support and policy documents",
      icon: HelpCircle,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background px-4 py-8 md:px-8 max-w-7xl mx-auto w-full">
      {/* Header with back button */}
      <div className="flex items-center mb-8 gap-4">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" asChild>
          <Link href="/">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage your account preferences and settings</p>
        </div>
      </div>

      {/* Grid of navigation cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((sec) => (
          <Link key={sec.href} href={sec.href} className="group block h-full outline-none">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 border-muted-foreground/10 overflow-hidden relative">
              <CardHeader className="flex flex-row items-start gap-4 pb-2">
                <div className={`p-3 rounded-xl ${sec.bgColor} ${sec.color} ring-1 ring-inset ring-black/5 dark:ring-white/10 transition-transform group-hover:scale-110 duration-300`}>
                  <sec.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center justify-between">
                    {sec.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed mb-4">
                    {sec.description}
                </CardDescription>
                <div className="flex items-center text-sm font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 absolute bottom-4 right-4">
                  Open <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
