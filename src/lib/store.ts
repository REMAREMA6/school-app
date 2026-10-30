// Simple state-based navigation store (no URL routing needed for static export)
import { useState, useCallback } from "react";

export type ScreenId =
  | "dashboard"
  | "school-config"
  | "subjects-classes"
  | "students"
  | "assessments"
  | "users-permissions"
  | "upload"
  | "review"
  | "report-cards"
  | "settings";

// Simple global state without zustand (to avoid extra dependency)
let globalScreen: ScreenId = "dashboard";
const listeners: Set<(s: ScreenId) => void> = new Set();

export function useScreen() {
  const [screen, setScreen] = useState<ScreenId>(globalScreen);
  
  const subscribe = useCallback((cb: (s: ScreenId) => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  }, []);

  const set = useCallback((s: ScreenId) => {
    globalScreen = s;
    setScreen(s);
    listeners.forEach(cb => cb(s));
  }, []);

  return { screen, setScreen: set };
}
