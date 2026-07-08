"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeFollowUpDate = normalizeFollowUpDate;
exports.isFollowUpOverdue = isFollowUpOverdue;
exports.getFollowUpBucket = getFollowUpBucket;
function normalizeFollowUpDate(value) {
    if (!value)
        return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return null;
    }
    return date;
}
function isFollowUpOverdue(value, now = new Date()) {
    const date = normalizeFollowUpDate(value);
    if (!date)
        return false;
    return date.getTime() < now.getTime();
}
function getFollowUpBucket(value, now = new Date()) {
    const date = normalizeFollowUpDate(value);
    if (!date)
        return "NONE";
    const startToday = new Date(now);
    startToday.setHours(0, 0, 0, 0);
    const endToday = new Date(now);
    endToday.setHours(23, 59, 59, 999);
    if (date.getTime() < startToday.getTime())
        return "OVERDUE";
    if (date.getTime() <= endToday.getTime())
        return "TODAY";
    return "UPCOMING";
}
//# sourceMappingURL=crm-followup.helper.js.map