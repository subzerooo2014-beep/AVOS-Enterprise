export function safePercent(part: number, total: number): number {
  if (!total || total <= 0) return 0;
  return Number(((part / total) * 100).toFixed(2));
}

export function safeMoney(value: any): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? Number(n.toFixed(2)) : 0;
}

export function sumMoney(items: any[], field = 'total'): number {
  return safeMoney(
    items.reduce((sum, item) => sum + Number(item?.[field] ?? 0), 0),
  );
}
