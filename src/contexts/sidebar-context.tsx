"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "btc-tool-sidebar-collapsed";
const POSITION_KEY = "btc-tool-sidebar-position";

export type SidebarPosition = "left" | "right";

type SidebarContextType = {
  collapsed: boolean;
  position: SidebarPosition;
  toggle: () => void;
  togglePosition: () => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

function getStoredCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function getStoredPosition(): SidebarPosition {
  if (typeof window === "undefined") return "left";
  try {
    const v = localStorage.getItem(POSITION_KEY);
    return v === "right" ? "right" : "left";
  } catch {
    return "left";
  }
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsedState] = useState(false);
  const [position, setPositionState] = useState<SidebarPosition>("left");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCollapsedState(getStoredCollapsed());
    setPositionState(getStoredPosition());
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    setCollapsedState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const togglePosition = useCallback(() => {
    setPositionState((prev) => {
      const next = prev === "left" ? "right" : "left";
      try {
        localStorage.setItem(POSITION_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        collapsed: mounted ? collapsed : false,
        position: mounted ? position : "left",
        toggle,
        togglePosition,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}
