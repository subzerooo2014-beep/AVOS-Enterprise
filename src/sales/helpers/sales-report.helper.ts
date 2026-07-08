import { buildDashboard } from "./sales-dashboard.helper";
import { sumMoney } from "./sales-analytics.helper";

export function buildSalesReport(stats: any, sales: any[]) {
  return {
    dashboard: buildDashboard(stats),
    totalRevenue: sumMoney(sales, "total"),
    totalRecords: sales.length,
    generatedAt: new Date().toISOString(),
  };
}
