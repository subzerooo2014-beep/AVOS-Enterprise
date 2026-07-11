function normalizeGovernanceValue(
  value: unknown,
): unknown {
  if (value === undefined) {
    return null;
  }

  if (value === null) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((item) =>
      normalizeGovernanceValue(item),
    );
  }

  if (typeof value === "object") {
    const input =
      value as Record<string, unknown>;

    const output:
      Record<string, unknown> = {};

    for (
      const key of Object.keys(input).sort()
    ) {
      if (input[key] !== undefined) {
        output[key] =
          normalizeGovernanceValue(
            input[key],
          );
      }
    }

    return output;
  }

  if (
    typeof value === "number" &&
    !Number.isFinite(value)
  ) {
    return String(value);
  }

  return value;
}

export function canonicalizeGovernanceJson(
  value: unknown,
): string {
  return JSON.stringify(
    normalizeGovernanceValue(value),
  );
}

export function cloneGovernanceJson<T>(
  value: T,
): T {
  return JSON.parse(
    canonicalizeGovernanceJson(value),
  ) as T;
}
