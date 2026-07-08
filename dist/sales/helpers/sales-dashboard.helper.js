"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDashboard = buildDashboard;
const sales_analytics_helper_1 = require("./sales-analytics.helper");
function buildDashboard(stats) {
    const total = stats.totalSales;
    return {
        ...stats,
        activeSales: stats.openSales +
            stats.draftSales +
            stats.pendingSales +
            stats.approvedSales,
        winRate: (0, sales_analytics_helper_1.safePercent)(stats.wonSales, total),
        lossRate: (0, sales_analytics_helper_1.safePercent)(stats.lostSales, total),
        cancelRate: (0, sales_analytics_helper_1.safePercent)(stats.cancelledSales, total),
        closeRate: (0, sales_analytics_helper_1.safePercent)(stats.closedSales, total),
    };
}
//# sourceMappingURL=sales-dashboard.helper.js.map