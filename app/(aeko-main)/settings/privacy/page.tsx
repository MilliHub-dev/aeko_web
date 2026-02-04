"use client";

import Link from "next/link";
import { ArrowLeft, Lock, Eye, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUser } from "@/components/shared/user-context";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PrivacySettingsPage() {
  const { user, refreshUser } = useUser();
  const [settings, setSettings] = useState({
    isPrivate: false,
    showOnlineStatus: true,
    allowComments: true,
    allowTags: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setSettings({
        isPrivate: user.privacy?.isPrivate ?? false,
        showOnlineStatus: user.privacy?.showOnlineStatus ?? true,
        allowComments: user.allowComments ?? true,
        allowTags: user.allowTags ?? true
      });
    }
  }, [user]);

  const handleToggle = async (key: keyof typeof settings) => {
    const newValue = !settings[key];
    // Optimistic update
    setSettings(prev => ({ ...prev, [key]: newValue }));

    try {
      setLoading(true);
      const res = await fetch("/api/security/privacy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          [key]: newValue
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update settings");
      }
      
      toast.success("Settings updated");
      refreshUser(); // Refresh global user state to keep it in sync
    } catch (error) {
      // Revert
      setSettings(prev => ({ ...prev, [key]: !newValue }));
      toast.error(error instanceof Error ? error.message : "Failed to update settings");
      console.error("Update privacy error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background px-4 py-8 md:px-8 max-w-7xl mx-auto w-full">
      {/* Header with back navigation */}
      <div className="flex items-center mb-8 gap-4">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" asChild>
          <Link href="/settings">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Privacy & Security</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage who can see your content and interact with you</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Lock className="w-5 h-5" />
              </div>
              <CardTitle>Account Privacy</CardTitle>
            </div>
            <CardDescription>Control visibility of your profile and posts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="private-account" className="text-base">Private Account</Label>
                <p className="text-sm text-muted-foreground">Only people you approve can see your photos and videos.</p>
              </div>
              <Switch 
                id="private-account" 
                checked={settings.isPrivate}
                onCheckedChange={() => handleToggle("isPrivate")}
                disabled={loading}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="activity-status" className="text-base">Activity Status</Label>
                <p className="text-sm text-muted-foreground">Allow accounts you follow to see when you were last active.</p>
              </div>
              <Switch 
                id="activity-status" 
                checked={settings.showOnlineStatus}
                onCheckedChange={() => handleToggle("showOnlineStatus")}
                disabled={loading}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                <Eye className="w-5 h-5" />
              </div>
              <CardTitle>Interactions</CardTitle>
            </div>
            <CardDescription>Manage how people can interact with your content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="comments" className="text-base">Allow Comments From Everyone</Label>
                <p className="text-sm text-muted-foreground">If disabled, only followers can comment on your posts.</p>
              </div>
              <Switch 
                id="comments" 
                checked={settings.allowComments}
                onCheckedChange={() => handleToggle("allowComments")}
                disabled={loading}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="tags" className="text-base">Allow Tags</Label>
                <p className="text-sm text-muted-foreground">Allow people to tag you in their photos and videos.</p>
              </div>
              <Switch 
                id="tags" 
                checked={settings.allowTags}
                onCheckedChange={() => handleToggle("allowTags")}
                disabled={loading}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
           <CardHeader>
             <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                <Shield className="w-5 h-5" />
              </div>
              <CardTitle>Data & Security</CardTitle>
            </div>
            <CardDescription>Manage your data and login security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Button variant="outline" className="w-full justify-between" asChild>
               <Link href="/settings/account/change-password">
                 Change Password <ArrowLeft className="w-4 h-4 rotate-180" />
               </Link>
             </Button>
             <Button variant="outline" className="w-full justify-between text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20" asChild>
                <Link href="/settings/account">
                  Delete Account <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
