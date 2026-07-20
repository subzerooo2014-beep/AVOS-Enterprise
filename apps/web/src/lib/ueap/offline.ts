const CACHE_KEY = "avos-ueap-runtime-cache";

export function saveRuntimeCache(value: unknown): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ value, savedAt: new Date().toISOString() }),
  );
}

export function readRuntimeCache<T>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CACHE_KEY);
  if (!raw) return null;

  try {
    return (JSON.parse(raw) as { value: T }).value;
  } catch {
    return null;
  }
}
