"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmAnalytics = void 0;
class CrmAnalytics {
    summary(total, active) {
        return {
            total,
            active,
            inactive: total - active,
        };
    }
}
exports.CrmAnalytics = CrmAnalytics;
//# sourceMappingURL=crm-analytics.js.map