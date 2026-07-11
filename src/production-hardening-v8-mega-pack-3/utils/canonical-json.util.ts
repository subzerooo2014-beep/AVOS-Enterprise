function normalizeValue(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value ?? null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeValue(item));
  }

  if (typeof value === "object") {
    const objectValue = value as Record<string, unknown>;
    const normalized: Record<string, unknown> = {};

    for (const key of Object.keys(objectValue).sort()) {
      const entry = objectValue[key];

      if (entry !== undefined) {
        normalized[key] = normalizeValue(entry);
      }
    }

    return normalized;
  }

  if (typeof value === "number" && !Number.isFinite(value)) {
    return String(value);
  }

  return value;
}

export function canonicalizeJson(value: unknown): string {
  return JSON.stringify(normalizeValue(value));
}

export function cloneJson<T>(value: T): T {
  return JSON.parse(canonicalizeJson(value)) as T;
}
