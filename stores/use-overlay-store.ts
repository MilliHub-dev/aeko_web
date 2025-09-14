"use client";

import { create } from "zustand";

interface OverlayState {
	showOverlay: boolean;
	setShowOverlay: (show: boolean) => void;
}

export const useOverlayStore = create<OverlayState>((set) => ({
	showOverlay: true,
	setShowOverlay: (show) => set({ showOverlay: show })
}));
