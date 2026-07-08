"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCrmPriority = calculateCrmPriority;
function calculateCrmPriority(record) {
    const score = Number(record?.score ?? 0);
    if (record?.status === "OPPORTUNITY" && score >= 80)
        return "URGENT";
    if (score >= 70)
        return "HIGH";
    if (score >= 40)
        return "MEDIUM";
    return "LOW";
}
//# sourceMappingURL=crm-priority.helper.js.map