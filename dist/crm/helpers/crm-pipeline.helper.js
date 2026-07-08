"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CRM_PIPELINE_STAGES = void 0;
exports.normalizePipelineStage = normalizePipelineStage;
exports.groupCrmPipeline = groupCrmPipeline;
exports.CRM_PIPELINE_STAGES = [
    "NEW",
    "CONTACTED",
    "QUALIFIED",
    "OPPORTUNITY",
    "WON",
    "LOST",
    "INACTIVE",
];
function normalizePipelineStage(status) {
    const value = String(status ?? "NEW").toUpperCase();
    return exports.CRM_PIPELINE_STAGES.includes(value) ? value : "NEW";
}
function groupCrmPipeline(items) {
    const grouped = {
        NEW: [],
        CONTACTED: [],
        QUALIFIED: [],
        OPPORTUNITY: [],
        WON: [],
        LOST: [],
        INACTIVE: [],
    };
    for (const item of items ?? []) {
        const stage = normalizePipelineStage(item?.status);
        grouped[stage].push(item);
    }
    return grouped;
}
//# sourceMappingURL=crm-pipeline.helper.js.map