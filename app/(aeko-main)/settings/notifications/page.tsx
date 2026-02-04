"use client";

import Link from "next/link";
import { ArrowLeft, Bell, Heart, MessageCircle, UserPlus, AtSign, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface NotificationSettings {
  global: {
    pauseAll: boolean;
    quietMode: boolean;
  };
  interactions: {
    likes: boolean;
    comments: boolean;
    mentions: boolean;
    tags: boolean;
  };
  network: {
    newFollowers: boolean;
    recommendations: boolean;
  };
}

const defaultSettings: NotificationSettings = {
  global: { pauseAll: false, quietMode: false },
  interactions: { likes: true, comments: true, mentions: true, tags: true },
  network: { newFollowers: true, recommendations: true },
};

export default function NotificationsSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/notifications/settings");
      if (res.ok) {
        const data = await res.json();
        // Ensure we merge with defaults in case of missing fields
        setSettings((prev) => ({
          ...prev,
          ...data,
          global: { ...prev.global, ...(data.global || {}) },
          interactions: { ...prev.interactions, ...(data.interactions || {}) },
          network: { ...prev.network, ...(data.network || {}) },
        }));
      }
    } catch (error) {
      console.error("Failed to fetch notification settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: NotificationSettings) => {
    // Optimistic update
    setSettings(newSettings);
    setUpdating(true);

    try {
      const res = await fetch("/api/notifications/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSettings),
      });

      if (!res.ok) {
        throw new Error("Failed to update settings");
      }
      // toast.success("Settings saved"); // Optional: could be too noisy
    } catch (error) {
      console.error("Failed to update settings:", error);
      toast.error("Failed to save changes");
      // Revert on error (re-fetch)
      fetchSettings();
    } finally {
      setUpdating(false);
    }
  };

  const handleToggle = (
    section: keyof NotificationSettings,
    key: string,
    value: boolean
  ) => {
    const newSettings = {
      ...settings,
      [section]: {
        ...settings[section as keyof NotificationSettings],
        [key]: value,
      },
    };
    updateSettings(newSettings);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Push Notifications</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage what notifications you receive on your devices</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                <Bell className="w-5 h-5" />
              </div>
              <CardTitle>Global Controls</CardTitle>
            </div>
            <CardDescription>Master switches for all notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="pause-all" className="text-base">Pause All</Label>
                <p className="text-sm text-muted-foreground">Temporarily pause all notifications.</p>
              </div>
              <Switch 
                id="pause-all" 
                checked={settings.global.pauseAll}
                onCheckedChange={(checked) => handleToggle('global', 'pauseAll', checked)}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="quiet-mode" className="text-base">Quiet Mode</Label>
                <p className="text-sm text-muted-foreground">Automatically mute notifications at night.</p>
              </div>
              <Switch 
                id="quiet-mode" 
                checked={settings.global.quietMode}
                onCheckedChange={(checked) => handleToggle('global', 'quietMode', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <Heart className="w-5 h-5" />
              </div>
              <CardTitle>Interactions</CardTitle>
            </div>
            <CardDescription>Notifications about your content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="likes" className="text-base flex items-center gap-2">
                  <Heart className="w-4 h-4 text-muted-foreground" /> Likes
                </Label>
                <p className="text-sm text-muted-foreground">When someone likes your posts or comments.</p>
              </div>
              <Switch 
                id="likes" 
                checked={settings.interactions.likes}
                onCheckedChange={(checked) => handleToggle('interactions', 'likes', checked)}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="comments" className="text-base flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-muted-foreground" /> Comments
                </Label>
                <p className="text-sm text-muted-foreground">When someone comments on your posts.</p>
              </div>
              <Switch 
                id="comments" 
                checked={settings.interactions.comments}
                onCheckedChange={(checked) => handleToggle('interactions', 'comments', checked)}
              />
            </div>
             <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="mentions" className="text-base flex items-center gap-2">
                  <AtSign className="w-4 h-4 text-muted-foreground" /> Mentions & Tags
                </Label>
                <p className="text-sm text-muted-foreground">When someone mentions or tags you.</p>
              </div>
              <Switch 
                id="mentions" 
                checked={settings.interactions.mentions}
                onCheckedChange={(checked) => handleToggle('interactions', 'mentions', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                <UserPlus className="w-5 h-5" />
              </div>
              <CardTitle>Network</CardTitle>
            </div>
            <CardDescription>Notifications about your connections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="new-followers" className="text-base">New Followers</Label>
                <p className="text-sm text-muted-foreground">When someone starts following you.</p>
              </div>
              <Switch 
                id="new-followers" 
                checked={settings.network.newFollowers}
                onCheckedChange={(checked) => handleToggle('network', 'newFollowers', checked)}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="recommendations" className="text-base flex items-center gap-2">
                   <Sparkles className="w-4 h-4 text-muted-foreground" /> Recommendations
                </Label>
                <p className="text-sm text-muted-foreground">People you may know or might like.</p>
              </div>
              <Switch 
                id="recommendations" 
                checked={settings.network.recommendations}
                onCheckedChange={(checked) => handleToggle('network', 'recommendations', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
