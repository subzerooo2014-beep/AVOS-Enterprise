"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAutomationTags = getAutomationTags;
function getAutomationTags(record) {
    const tags = [];
    if (!record?.phone && !record?.email)
        tags.push("MISSING_CONTACT");
    if (record?.status === "NEW")
        tags.push("NEEDS_FIRST_CONTACT");
    if (record?.status === "OPPORTUNITY")
        tags.push("SALES_READY");
    if (record?.nextFollowUpAt && new Date(record.nextFollowUpAt).getTime() < Date.now()) {
        tags.push("OVERDUE_FOLLOW_UP");
    }
    if (Number(record?.score ?? 0) >= 80)
        tags.push("HIGH_VALUE");
    return tags;
}
//# sourceMappingURL=crm-automation.helper.js.map