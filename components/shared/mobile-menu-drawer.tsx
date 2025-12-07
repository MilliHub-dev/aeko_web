"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Logo } from "../logo";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  Bookmark,
  Wallet2,
  Users,
  LifeBuoy,
  LogOut,
  Coins,
  User,
  SearchIcon,
} from "lucide-react";
import { useMobileMenu } from "./mobile-menu-context";
import { logoutAction } from "@/app/(aeko-auth)/actions";

import { useUser } from "./user-context";
import { HomeIcon, RadioSolid } from "@/lib/icons";

export function MobileMenuDrawer() {
  const { open, closeMenu } = useMobileMenu();
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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
    { label: "Profile", href: "/profile", icon: User },
    {
      label: "Live Streams",
      href: "/live-streams",
      icon: RadioSolid,
    },
    // { label: "Wallet", href: "/wallet", icon: Wallet2 },
    {
      label: "Community",
      href: "/communities",
      icon: Users,
    },
    // {
    //   label: "NFT marketplace",
    //   href: "/nft-marketplace",
    //   icon: Coins,
    // },
    // { label: "Support", href: "/#", icon: LifeBuoy },
    { label: "Logout", href: "/#", icon: LogOut },
  ];

  if (!mounted) return null;

  return createPortal(
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
            className="fixed left-0 top-0 bottom-0 z-101 w-[85vw] max-w-88 bg-white md:hidden shadow-2xl border-r border-black/10"
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
            <div className="p-5">
              <div className="w-20">
                <Logo />
              </div>
            </div>
            <div className="px-6">
              <div className="flex flex-col items-center gap-3 pb-4">
                <Avatar className="h-20 w-20 outline-2 outline-offset-2 outline-primary">
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="text-lg font-semibold">
                    {user?.name || "Guest"}
                  </p>
                </div>
                <div className="flex items-center gap-8 text-center text-sm">
                  <div>
                    <p className="font-semibold">{user?.posts?.length || 0}</p>
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
                {items.map(({ label, href, icon: Icon }) => {
                  if (label === "Logout") {
                    return (
                      <button
                        key={label}
                        onClick={() => {
                          logoutAction();
                          closeMenu();
                        }}
                        className="flex items-center gap-3 rounded-lg px-2 py-3 text-lg hover:bg-gray-100 w-full text-left">
                        <Icon className="shrink-0" size={22} />
                        <span>{label}</span>
                      </button>
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
                    </Link>
                  );
                })}
              </nav>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
