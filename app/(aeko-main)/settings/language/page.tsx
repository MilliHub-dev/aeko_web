"use client";

import Link from "next/link";
import { ArrowLeft, Check, Globe, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/components/shared/language-context";
import { toast } from "sonner";

export default function LanguageSettingsPage() {
  const { language, setLanguage, autoTranslate, setAutoTranslate } = useLanguage();

  const handleLanguageChange = (value: string) => {
    setLanguage(value as any);
    toast.success("Language preference updated");
  };

  const toggleAutoTranslate = () => {
    const newValue = !autoTranslate;
    setAutoTranslate(newValue);
    toast.success(newValue ? "Auto-translate enabled" : "Auto-translate disabled");
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Language & Localization</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage language preferences and region settings</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
           <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-500/10 rounded-lg text-pink-500">
                <Globe className="w-5 h-5" />
              </div>
              <CardTitle>Display Language</CardTitle>
            </div>
            <CardDescription>Select the language you want the app to use</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>App Language</Label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English (US)</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                <Languages className="w-5 h-5" />
              </div>
              <CardTitle>Content Translation</CardTitle>
            </div>
            <CardDescription>Automatically translate posts to your preferred language</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
               <div className="space-y-1">
                 <h4 className="font-medium">Auto-Translate</h4>
                 <p className="text-sm text-muted-foreground">Translate foreign language posts automatically</p>
               </div>
               <Button 
                variant={autoTranslate ? "default" : "outline"} 
                size="sm" 
                className="gap-2"
                onClick={toggleAutoTranslate}
              >
                 {autoTranslate && <Check className="w-4 h-4" />} 
                 {autoTranslate ? "Enabled" : "Enable"}
               </Button>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
