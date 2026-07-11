import { safePercent } from "./sales-analytics.helper";

export function buildDashboard(stats: {
  totalSales: number;
  openSales: number;
  draftSales: number;
  pendingSales: number;
  approvedSales: number;
  wonSales: number;
  lostSales: number;
  cancelledSales: number;
  closedSales: number;
}) {
  const total = stats.totalSales;

  return {
    ...stats,
    activeSales:
      stats.openSales +
      stats.draftSales +
      stats.pendingSales +
      stats.approvedSales,

    winRate: safePercent(stats.wonSales, total),
    lossRate: safePercent(stats.lostSales, total),
    cancelRate: safePercent(stats.cancelledSales, total),
    closeRate: safePercent(stats.closedSales, total),
  };
}
