"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCrmSegment = getCrmSegment;
exports.groupBySegment = groupBySegment;
function getCrmSegment(record) {
    const score = Number(record?.score ?? 0);
    const status = String(record?.status ?? "NEW");
    if (status === "WON")
        return "CUSTOMER";
    if (status === "OPPORTUNITY" || score >= 75)
        return "HOT";
    if (status === "QUALIFIED" || score >= 50)
        return "WARM";
    if (status === "LOST" || status === "INACTIVE")
        return "COLD";
    return "NEW";
}
function groupBySegment(items) {
    const grouped = {
        NEW: [],
        WARM: [],
        HOT: [],
        CUSTOMER: [],
        COLD: [],
    };
    for (const item of items ?? []) {
        const segment = getCrmSegment(item);
        grouped[segment] = grouped[segment] ?? [];
        grouped[segment].push(item);
    }
    return grouped;
}
//# sourceMappingURL=crm-segmentation.helper.js.map