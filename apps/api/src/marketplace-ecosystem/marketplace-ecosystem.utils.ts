export function marketplaceId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function clampMarketplaceScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}
