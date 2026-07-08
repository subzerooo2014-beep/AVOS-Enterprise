"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevenueAnalytics = void 0;
class RevenueAnalytics {
    static summary(revenue, cost) {
        return {
            revenue,
            cost,
            profit: revenue - cost,
        };
    }
}
exports.RevenueAnalytics = RevenueAnalytics;
//# sourceMappingURL=revenue-analytics.js.map