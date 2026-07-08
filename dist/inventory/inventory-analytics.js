"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryAnalytics = void 0;
class InventoryAnalytics {
    summary(total, available) {
        return {
            total,
            available,
            reserved: total - available,
        };
    }
}
exports.InventoryAnalytics = InventoryAnalytics;
//# sourceMappingURL=inventory-analytics.js.map