"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSalesReport = buildSalesReport;
const sales_dashboard_helper_1 = require("./sales-dashboard.helper");
const sales_analytics_helper_1 = require("./sales-analytics.helper");
function buildSalesReport(stats, sales) {
    return {
        dashboard: (0, sales_dashboard_helper_1.buildDashboard)(stats),
        totalRevenue: (0, sales_analytics_helper_1.sumMoney)(sales, "total"),
        totalRecords: sales.length,
        generatedAt: new Date().toISOString(),
    };
}
//# sourceMappingURL=sales-report.helper.js.map