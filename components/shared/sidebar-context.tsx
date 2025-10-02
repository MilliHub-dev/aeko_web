"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

type SidebarState = {
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (v: boolean) => void;
};

const SidebarContext = createContext<SidebarState | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const v = localStorage.getItem("aeko_sidebar_collapsed");
      if (v != null) setCollapsed(v === "1");
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("aeko_sidebar_collapsed", collapsed ? "1" : "0");
    } catch {}
  }, [collapsed]);

  const toggle = useCallback(() => setCollapsed((s) => !s), []);

  return (
    <SidebarContext.Provider value={{ collapsed, toggle, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
	const ctx = useContext(SidebarContext);
	// if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
	return ctx;
}

