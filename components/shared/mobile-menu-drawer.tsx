"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  Users,
  LogOut,
  Coins,
  User,
  SearchIcon,
  SettingsIcon,
} from "lucide-react";
import { useMobileMenu } from "./mobile-menu-context";
import { logoutAction } from "@/app/(aeko-auth)/actions";

import { useUser } from "./user-context";
import { HomeIcon, RadioSolid, BellIcon, WalletOutline, ChatIcon } from "@/lib/icons";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useChatStore } from "@/features/chat/stores/chat-store";

function MobileWaitlistCard({
  onOpen,
}: {
  onOpen: () => void;
}) {
  return (
    <div className="rounded-[28px] border border-primary/20 bg-[radial-gradient(120%_120%_at_0%_0%,rgba(0,127,109,0.18),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,250,249,0.96))] p-4 shadow-sm">
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/15">
            <Coins className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary/80">
              Aeko Coin
            </p>
            <h3 className="text-base font-bold text-foreground">Join the waitlist</h3>
            <p className="text-sm text-muted-foreground">
              Early access and airdrop chance up to 3000 $AEKO.
            </p>
          </div>
        </div>

        <Button
          className="w-full rounded-full bg-foreground font-semibold text-background hover:bg-foreground/90"
          onClick={onOpen}
        >
          Join Waitlist
        </Button>
      </div>
    </div>
  );
}

function MobileWaitlistDialog({
  open,
  onOpenChange,
  onJoined,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoined?: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      toast.error("Please enter both your name and email");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(payload.message || "Failed to join waitlist");
        return;
      }

      toast.success("You’re on the Aeko Coin waitlist");
      resetForm();
      onOpenChange(false);
      onJoined?.();
    } catch (error) {
      console.error("Waitlist signup failed:", error);
      toast.error("Failed to join waitlist");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-[140] max-w-[92vw] overflow-hidden rounded-[28px] p-0">
        <div className="bg-[radial-gradient(120%_120%_at_0%_0%,rgba(0,127,109,0.14),transparent_52%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,250,249,0.95))] p-6">
          <DialogHeader className="space-y-3 text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/15">
              <Coins className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-foreground">
                Join the $AEKO waitlist
              </DialogTitle>
              <DialogDescription className="pt-1">
                Enter your details for early access and an airdrop opportunity of up to 3000 $AEKO.
              </DialogDescription>
            </div>
          </DialogHeader>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="rounded-full border-border/70 bg-background"
              disabled={isSubmitting}
              required
            />
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your@email.com"
              className="rounded-full border-border/70 bg-background"
              disabled={isSubmitting}
              required
            />
            <Button
              type="submit"
              className="w-full rounded-full bg-foreground font-semibold text-background hover:bg-foreground/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Joining..." : "Secure My Spot"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function MobileMenuDrawer() {
  const { open, closeMenu } = useMobileMenu();
  const { user } = useUser();
  const chats = useChatStore((state) => state.chats);
  const fetchChats = useChatStore((state) => state.fetchChats);
  const [mounted, setMounted] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const hasUnreadMessages = useMemo(
    () => chats.some((chat) => (chat.unreadCount || 0) > 0),
    [chats]
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeMenu]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const items = [
    { label: "Home", href: "/home", icon: HomeIcon },
    { label: "Explore", href: "/explore", icon: SearchIcon },
    { label: "Communities", href: "/communities", icon: Users },
    {
      label: "Live Streams",
      href: "/live-streams",
      icon: RadioSolid,
    },
    { label: "Notifications", href: "/notifications", icon: BellIcon },
    { label: "Messages", href: "/messages", icon: ChatIcon },
    { 
      label: "Aeko Wallet", 
      href: "/wallet", 
      icon: WalletOutline,
      badge: "Coming Soon" 
    },
    { label: "Profile", href: "/profile", icon: User },
    { label: "Settings", href: "/settings", icon: SettingsIcon },
  ];

  if (!mounted) return null;

  return createPortal(
    <>
      <AnimatePresence>
        {open && (
          <>
          <motion.div
            className="fixed inset-0 z-100 bg-black/40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
          />
          <motion.aside
            className="fixed left-0 top-0 bottom-0 z-101 w-[85vw] max-w-88 bg-white md:hidden shadow-2xl border-r border-black/10 flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              duration: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            drag="x"
            dragConstraints={{
              left: -120,
              right: 0,
            }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60 || info.velocity.x < -800) closeMenu();
            }}
            role="dialog"
            aria-modal="true">
            <div
              className="px-6 pt-6 flex-1 overflow-y-auto"
              style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
            >
              <div className="flex flex-col items-center gap-3 pb-4">
                <Avatar className="h-20 w-20 outline-2 outline-offset-2 outline-primary">
                  <AvatarImage src={user?.profilePicture || user?.avatar} />
                  <AvatarFallback>
                    {user?.profilePicture || user?.avatar ? (
                      user?.name?.charAt(0) || "U"
                    ) : (
                      <img
                        src="/aeko-logo.png"
                        alt="Aeko"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="text-lg font-semibold">
                    {user?.name || "Guest"}
                  </p>
                </div>
                <div className="flex items-center gap-8 text-center text-sm">
                  <div>
                    <p className="font-semibold">
                      {user?.postsCount ?? user?.postCount ?? user?.posts?.length ?? 0}
                    </p>
                    <p className="text-muted-foreground">Posts</p>
                  </div>
                  <div>
                    <p className="font-semibold">
                      {user?.followers?.length || 0}
                    </p>
                    <p className="text-muted-foreground">Followers</p>
                  </div>
                  <div>
                    <p className="font-semibold">
                      {user?.following?.length || 0}
                    </p>
                    <p className="text-muted-foreground">Following</p>
                  </div>
                </div>
              </div>
              <nav className="flex flex-col gap-4 py-6">
                {items.map(({ label, href, icon: Icon, badge }) => {
                  if (href === "/wallet") {
                    return (
                      <div
                        key={label}
                        className="flex items-center gap-3 rounded-lg px-2 py-3 text-lg opacity-60 cursor-not-allowed">
                        <Icon className="shrink-0" size={22} />
                        <span>{label}</span>
                        {badge && (
                          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                            {badge}
                          </span>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={label}
                      href={href}
                      className="flex items-center gap-3 rounded-lg px-2 py-3 text-lg hover:bg-gray-100"
                      onClick={closeMenu}>
                      <Icon className="shrink-0" size={22} />
                      <span>{label}</span>
                      {href === "/messages" && hasUnreadMessages && (
                        <span className="ml-auto h-2.5 w-2.5 rounded-full bg-primary" />
                      )}
                      {badge && (
                        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                          {badge}
                        </span>
                      )}
                    </Link>
                  );
                })}

                <MobileWaitlistCard
                  onOpen={() => {
                    setWaitlistOpen(true);
                    closeMenu();
                  }}
                />

                <button
                  onClick={() => {
                    logoutAction();
                    closeMenu();
                  }}
                  className="flex items-center gap-3 rounded-lg px-2 py-3 text-lg hover:bg-gray-100 w-full text-left">
                  <LogOut className="shrink-0" size={22} />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
            <div className="p-5 border-t">
              <div className="w-28 mx-auto">
                <Image
                  src="/aeko-logo.png"
                  alt="Aeko"
                  width={140}
                  height={40}
                  className="h-8 w-auto object-contain"
                  priority
                />
              </div>
            </div>
          </motion.aside>
          </>
        )}
      </AnimatePresence>

      <MobileWaitlistDialog
        open={waitlistOpen}
        onOpenChange={setWaitlistOpen}
      />
    </>,
    document.body
  );
}
