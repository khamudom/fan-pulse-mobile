"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TabId } from "@/config/navigation";

export type TransitionDirection = "forward" | "back" | "none";

export interface BottomSheetState {
  open: boolean;
  type: string | null;
  payload: unknown;
}

export interface InstallPromptState {
  dismissed: boolean;
  deferredEvent: BeforeInstallPromptEvent | null;
}

interface AppPreferences {
  reducedMotion: boolean;
}

interface AppState {
  activeTab: TabId;
  selectedMatchDate: string | null;
  selectedTeamId: string | null;
  transitionDirection: TransitionDirection;
  bottomSheet: BottomSheetState;
  headerCompact: boolean;
  preferences: AppPreferences;
  installPrompt: InstallPromptState;
  tabScrollPositions: Partial<Record<TabId, number>>;

  setActiveTab: (tab: TabId) => void;
  setSelectedMatchDate: (date: string | null) => void;
  setSelectedTeamId: (teamId: string | null) => void;
  setTransitionDirection: (direction: TransitionDirection) => void;
  openBottomSheet: (type: string, payload?: unknown) => void;
  closeBottomSheet: () => void;
  setHeaderCompact: (compact: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setInstallDeferredEvent: (event: BeforeInstallPromptEvent | null) => void;
  dismissInstallPrompt: () => void;
  saveTabScroll: (tab: TabId, position: number) => void;
  getTabScroll: (tab: TabId) => number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeTab: "home",
      selectedMatchDate: null,
      selectedTeamId: null,
      transitionDirection: "none",
      bottomSheet: { open: false, type: null, payload: null },
      headerCompact: false,
      preferences: { reducedMotion: false },
      installPrompt: { dismissed: false, deferredEvent: null },
      tabScrollPositions: {},

      setActiveTab: (tab) => set({ activeTab: tab }),
      setSelectedMatchDate: (date) => set({ selectedMatchDate: date }),
      setSelectedTeamId: (teamId) => set({ selectedTeamId: teamId }),
      setTransitionDirection: (direction) =>
        set({ transitionDirection: direction }),
      openBottomSheet: (type, payload) =>
        set({ bottomSheet: { open: true, type, payload: payload ?? null } }),
      closeBottomSheet: () =>
        set({ bottomSheet: { open: false, type: null, payload: null } }),
      setHeaderCompact: (compact) => set({ headerCompact: compact }),
      setReducedMotion: (reduced) =>
        set((state) => ({
          preferences: { ...state.preferences, reducedMotion: reduced },
        })),
      setInstallDeferredEvent: (event) =>
        set((state) => ({
          installPrompt: { ...state.installPrompt, deferredEvent: event },
        })),
      dismissInstallPrompt: () =>
        set((state) => ({
          installPrompt: { ...state.installPrompt, dismissed: true },
        })),
      saveTabScroll: (tab, position) =>
        set((state) => ({
          tabScrollPositions: { ...state.tabScrollPositions, [tab]: position },
        })),
      getTabScroll: (tab) => get().tabScrollPositions[tab] ?? 0,
    }),
    {
      name: "fanpulse-app-store",
      partialize: (state) => ({
        selectedMatchDate: state.selectedMatchDate,
        selectedTeamId: state.selectedTeamId,
        preferences: state.preferences,
        installPrompt: {
          dismissed: state.installPrompt.dismissed,
          deferredEvent: null,
        },
        tabScrollPositions: state.tabScrollPositions,
      }),
    },
  ),
);
