"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { ArrowLeft, Moon, Sun, Monitor, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function ThemeSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [fontSize, setFontSize] = useState(100);

  useEffect(() => {
    setMounted(true);
    // Load persisted font size preference
    const storedSize = localStorage.getItem("aeko-font-size-scale");
    if (storedSize) {
      setFontSize(parseInt(storedSize, 10));
      document.documentElement.style.fontSize = `${storedSize}%`;
    }
  }, []);

  const handleFontSizeChange = (value: number[]) => {
    const newSize = value[0];
    setFontSize(newSize);
    localStorage.setItem("aeko-font-size-scale", newSize.toString());
    // Apply font size scaling to root element (basic implementation)
    // 100% = 16px (default browser), range 85% - 115%
    // Mapping 0-100 slider to 85-115% scale
    // actually, let's just map slider 0-100 to a reasonable % scale directly if possible, 
    // or use the slider value as a percentage of default size.
    // Let's assume slider is 80 to 120.
    
    // Better approach:
    // Slider value: 0 (Small) -> 50 (Default) -> 100 (Large)
    // Map to: 85% -> 100% -> 115%
    const scale = 85 + (newSize / 100) * 30; 
    document.documentElement.style.fontSize = `${scale}%`;
  };

  if (!mounted) {
    return null;
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Theme & Appearance</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Customize the look and feel of your experience</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                <Sun className="w-5 h-5" />
              </div>
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>Select your preferred color theme</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              defaultValue={theme} 
              onValueChange={(value) => setTheme(value)}
              className="grid grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem value="light" id="light" className="peer sr-only" />
                <Label
                  htmlFor="light"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Sun className="mb-3 h-6 w-6" />
                  Light
                </Label>
              </div>
              <div>
                <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                <Label
                  htmlFor="dark"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Moon className="mb-3 h-6 w-6" />
                  Dark
                </Label>
              </div>
              <div>
                <RadioGroupItem value="system" id="system" className="peer sr-only" />
                <Label
                  htmlFor="system"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Monitor className="mb-3 h-6 w-6" />
                  System
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-500/10 rounded-lg text-pink-500">
                <Type className="w-5 h-5" />
              </div>
              <CardTitle>Typography</CardTitle>
            </div>
            <CardDescription>Adjust text size and scaling</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Font Size Scale</Label>
                  <span className="text-sm text-muted-foreground">
                    {fontSize < 30 ? "Small" : fontSize > 70 ? "Large" : "Default"}
                  </span>
                </div>
                <Slider 
                  value={[fontSize]} 
                  onValueChange={handleFontSizeChange}
                  max={100} 
                  step={1} 
                  className="w-full" 
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Aa (Small)</span>
                  <span>Aa (Large)</span>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
