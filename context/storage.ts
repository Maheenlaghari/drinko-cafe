import { useMemo, useSyncExternalStore } from "react";

interface StoredValue<T> {
  found: boolean;
  value: T;
}

const subscribers = new Map<string, Set<() => void>>();

function getStoredString(key: string) {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.error(`Unable to read saved data for ${key}.`, error);
    return null;
  }
}

function subscribeToStoredValue(key: string, callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const keySubscribers = subscribers.get(key) ?? new Set<() => void>();
  keySubscribers.add(callback);
  subscribers.set(key, keySubscribers);

  const handleStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) callback();
  };
  window.addEventListener("storage", handleStorage);

  return () => {
    keySubscribers.delete(callback);
    window.removeEventListener("storage", handleStorage);
    if (keySubscribers.size === 0) subscribers.delete(key);
  };
}

export function useStoredValue<T>(
  key: string,
  fallback: T,
  isValid: (value: unknown) => value is T
): StoredValue<T> {
  const stored = useSyncExternalStore(
    (callback) => subscribeToStoredValue(key, callback),
    () => getStoredString(key),
    () => null
  );

  return useMemo(() => {
    if (stored === null) return { found: false, value: fallback };

    try {
      const value: unknown = JSON.parse(stored);
      if (isValid(value)) return { found: true, value };
      console.error(`Saved data for ${key} has an invalid format.`);
    } catch (error) {
      console.error(`Unable to parse saved data for ${key}.`, error);
    }

    return { found: false, value: fallback };
  }, [fallback, isValid, key, stored]);
}

export function writeStoredValue<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    subscribers.get(key)?.forEach((callback) => callback());
  } catch (error) {
    console.error(`Unable to save data for ${key}.`, error);
  }
}
