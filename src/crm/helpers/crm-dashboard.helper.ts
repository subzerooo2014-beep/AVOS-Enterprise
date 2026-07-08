export function percent(part: number, total: number): number {
  if (!total || total <= 0) return 0;
  return Number(((part / total) * 100).toFixed(2));
}

export function buildCrmDashboard(stats: any) {
  const total = Number(stats.total ?? 0);

  return {
    ...stats,
    active: Number(stats.newCount ?? 0) + Number(stats.contacted ?? 0) + Number(stats.qualified ?? 0) + Number(stats.opportunity ?? 0),
    winRate: percent(Number(stats.won ?? 0), total),
    lossRate: percent(Number(stats.lost ?? 0), total),
    inactiveRate: percent(Number(stats.inactive ?? 0), total),
  };
}
