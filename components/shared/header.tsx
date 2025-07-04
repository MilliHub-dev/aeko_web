"use client";

import Image from "next/image";
import { Bell, MessageCircle, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input"; // assuming shadcn/ui input
import { useTheme } from "../theme-provider";

function Logo({ theme }: { theme: string }) {
  return (
    <div className="flex flex-[0.5] justify-center">
      <Image
        src={theme === "dark" ? "/aeko-dark.png" : "/aeko-light.png"}
        alt="aeko logo"
        width={50}
        height={50}
        className="object-contain"
        priority
      />
    </div>
  );
}

export default function Header() {
  const { theme } = useTheme();

  return (
    <header className="hidden md:flex sticky top-0 inset-x-0 z-50 px-4.5 py-2">
      <div className="flex items-center justify-between w-full max-w-screen-2xl mx-auto h-16 bg-accent-foreground/80 backdrop-blur-md rounded-lg shadow-sm">
        {/* Left: Logo */}
        <Logo theme={theme} />

        {/* Center: Search Bar */}
        <div className="flex-4">
          <div className="relative w-full max-w-xl mx-auto">
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-full pl-10 pr-4 py-2 text-sm bg-muted focus-visible:ring-1 focus-visible:ring-primary"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Right: Icons + Profile */}
        <div className="flex flex-2 lg:flex-1 justify-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Bell className="w-5 h-5" />
          </Button>

          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <MessageCircle className="w-5 h-5" />
          </Button>

          {/* Profile */}
          <Button variant="ghost" size="icon" className="rounded-full overflow-hidden bg-muted p-0">
            <Image
              src="/placeholder.svg"
              alt="Profile"
              width={32}
              height={32}
              className="object-cover rounded-full"
            />
          </Button>
        </div>
      </div>
    </header>
  );
}
