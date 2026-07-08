"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDataQuality = calculateDataQuality;
exports.getDataQualityLabel = getDataQualityLabel;
function calculateDataQuality(record) {
    let score = 0;
    if (record?.name)
        score += 20;
    if (record?.phone)
        score += 20;
    if (record?.email)
        score += 20;
    if (record?.source)
        score += 10;
    if (record?.assignedToId)
        score += 10;
    if (record?.nextFollowUpAt)
        score += 10;
    if (record?.notes)
        score += 10;
    return Math.min(score, 100);
}
function getDataQualityLabel(score) {
    if (score >= 85)
        return "EXCELLENT";
    if (score >= 65)
        return "GOOD";
    if (score >= 40)
        return "FAIR";
    return "POOR";
}
//# sourceMappingURL=crm-quality.helper.js.map