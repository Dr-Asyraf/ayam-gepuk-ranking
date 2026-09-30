"use client";

import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function getSnapshot() {
  return (
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
  );
}

function getServerSnapshot() {
  return false;
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function setTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);

  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch {
    // Ignore if storage is unavailable
  }

  listeners.forEach((listener) => listener());
}

export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <button
      type="button"
      onClick={() => setTheme(!dark)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-9 w-9 items-center justify-center rounded-full border text-base transition hover:bg-stone-100 dark:hover:bg-stone-800"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}