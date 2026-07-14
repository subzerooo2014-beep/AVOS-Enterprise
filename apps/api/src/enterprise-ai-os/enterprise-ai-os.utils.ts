export function aiOsId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function clampAiScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}
