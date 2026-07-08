"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCrmActivity = createCrmActivity;
exports.appendCrmActivity = appendCrmActivity;
function createCrmActivity(type, description, payload = {}) {
    return {
        id: `${type}-${Date.now()}`,
        type,
        description,
        payload,
        createdAt: new Date().toISOString(),
    };
}
function appendCrmActivity(record, activity) {
    const current = Array.isArray(record?.activities) ? record.activities : [];
    return [...current, activity];
}
//# sourceMappingURL=crm-activity.helper.js.map