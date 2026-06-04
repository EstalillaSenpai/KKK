// Tiny localStorage-backed mock database.
// Swap this file out for a real backend client (fetch/supabase/etc.) without
// touching the service modules that consume it.

const PREFIX = "kkk:";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export const storage = {
  read<T>(key: string, fallback: T): T {
    if (!isBrowser()) return fallback;
    try {
      const raw = window.localStorage.getItem(PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  write<T>(key: string, value: T): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // quota / serialization errors are ignored in the mock layer.
    }
  },
  remove(key: string): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem(PREFIX + key);
  },
};

export function uid(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

// Simulate network latency so UIs can show loading states realistically.
export function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
