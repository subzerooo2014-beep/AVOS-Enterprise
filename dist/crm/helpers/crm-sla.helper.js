"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCrmSlaStatus = getCrmSlaStatus;
exports.enrichWithSla = enrichWithSla;
function getCrmSlaStatus(record, now = new Date()) {
    if (!record?.nextFollowUpAt)
        return "NO_FOLLOW_UP";
    const followUp = new Date(record.nextFollowUpAt);
    if (Number.isNaN(followUp.getTime()))
        return "NO_FOLLOW_UP";
    const diffMs = followUp.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    if (diffHours < 0)
        return "OVERDUE";
    if (diffHours <= 24)
        return "DUE_SOON";
    return "OK";
}
function enrichWithSla(record) {
    if (!record)
        return null;
    return {
        ...record,
        slaStatus: getCrmSlaStatus(record),
    };
}
//# sourceMappingURL=crm-sla.helper.js.map