"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCrmTimelineEvent = createCrmTimelineEvent;
exports.appendCrmTimeline = appendCrmTimeline;
function createCrmTimelineEvent(type, payload = {}) {
    return {
        type,
        payload,
        createdAt: new Date().toISOString(),
    };
}
function appendCrmTimeline(record, event) {
    const current = Array.isArray(record?.timeline) ? record.timeline : [];
    return [...current, event];
}
//# sourceMappingURL=crm-timeline.helper.js.map