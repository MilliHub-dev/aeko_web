"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";

interface BotSettings {
  botEnabled: boolean;
  botPersonality: string;
  customInstructions: string;
}

export function BotSettings({ onBack }: { onBack: () => void }) {
  const [settings, setSettings] = useState<BotSettings>({
    botEnabled: true,
    botPersonality: "friendly",
    customInstructions: "",
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
        // Merge with defaults if fields are missing and map legacy fields if necessary
        setSettings({
            botEnabled: data.botEnabled ?? data.isActive ?? true,
            botPersonality: data.botPersonality ?? data.personality ?? "friendly",
            customInstructions: data.customInstructions ?? "",
        });
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
          <Label htmlFor="bot-active">Enable Auto-Reply Bot</Label>
          <Switch
            id="bot-active"
            checked={settings.botEnabled}
            onCheckedChange={(checked) => saveSettings({ ...settings, botEnabled: checked })}
          />
        </div>

        <div className="space-y-2">
          <Label>Personality</Label>
          <Select
            value={settings.botPersonality}
            onValueChange={(value) => saveSettings({ ...settings, botPersonality: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select personality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="sarcastic">Sarcastic</SelectItem>
              <SelectItem value="mentor">Mentor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Custom Instructions</Label>
          <Textarea
            placeholder="E.g., Tell people I am currently on vacation."
            value={settings.customInstructions}
            onChange={(e) => saveSettings({ ...settings, customInstructions: e.target.value })}
            className="min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
}
