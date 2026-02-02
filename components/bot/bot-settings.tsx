"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

interface BotSettings {
  personality: string;
  responseLength: string;
  isActive: boolean;
}

export function BotSettings({ onBack }: { onBack: () => void }) {
  const [settings, setSettings] = useState<BotSettings>({
    personality: "friendly",
    responseLength: "medium",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/enhanced-bot/settings");
      if (res.ok) {
        const data = await res.json();
        // Merge with defaults if fields are missing
        setSettings({ ...settings, ...data });
      }
    } catch (error) {
      console.error("Failed to fetch bot settings", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: BotSettings) => {
    setSettings(newSettings);
    try {
      await fetch("/api/enhanced-bot/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
    } catch (error) {
      console.error("Failed to save bot settings", error);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Bot Settings</h3>
        <Button variant="ghost" size="sm" onClick={onBack}>
          Back to Chat
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="bot-active">Enable Bot</Label>
          <Switch
            id="bot-active"
            checked={settings.isActive}
            onCheckedChange={(checked) => saveSettings({ ...settings, isActive: checked })}
          />
        </div>

        <div className="space-y-2">
          <Label>Personality</Label>
          <Select
            value={settings.personality}
            onValueChange={(value) => saveSettings({ ...settings, personality: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select personality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="sarcastic">Sarcastic</SelectItem>
              <SelectItem value="concise">Concise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Response Length</Label>
          <Select
            value={settings.responseLength}
            onValueChange={(value) => saveSettings({ ...settings, responseLength: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="long">Detailed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
