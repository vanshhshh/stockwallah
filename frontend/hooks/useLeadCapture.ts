"use client";

import { create } from "zustand";

type LeadCaptureState = {
  isOpen: boolean;
  hasChecked: boolean;
  open: () => void;
  close: () => void;
  markCaptured: () => void;
  initialize: () => void;
};

export const useLeadCapture = create<LeadCaptureState>((set) => ({
  isOpen: false,
  hasChecked: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  markCaptured: () => {
    set({ isOpen: false, hasChecked: true });
  },
  initialize: () => {
    if (typeof window === "undefined") return;
    set({ hasChecked: true });
    window.setTimeout(() => {
      set({ isOpen: true });
    }, 2000);
  }
}));
