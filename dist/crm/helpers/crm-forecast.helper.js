"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateWeightedPipelineValue = calculateWeightedPipelineValue;
exports.calculateRawPipelineValue = calculateRawPipelineValue;
function calculateWeightedPipelineValue(items) {
    const weights = {
        NEW: 0.05,
        CONTACTED: 0.15,
        QUALIFIED: 0.35,
        OPPORTUNITY: 0.65,
        WON: 1,
        LOST: 0,
        INACTIVE: 0,
    };
    const total = (items ?? []).reduce((sum, item) => {
        const status = String(item?.status ?? "NEW");
        const value = Number(item?.expectedValue ?? item?.total ?? 0);
        const weight = weights[status] ?? 0;
        return sum + value * weight;
    }, 0);
    return Number(total.toFixed(2));
}
function calculateRawPipelineValue(items) {
    const total = (items ?? []).reduce((sum, item) => {
        return sum + Number(item?.expectedValue ?? item?.total ?? 0);
    }, 0);
    return Number(total.toFixed(2));
}
//# sourceMappingURL=crm-forecast.helper.js.map