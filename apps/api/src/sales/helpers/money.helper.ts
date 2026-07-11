export function toMoney(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 100) / 100;
}

export function safeNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function assertNonNegative(value: number, field: string): void {
  if (value < 0) {
    throw new Error(`${field} must not be negative`);
  }
}
