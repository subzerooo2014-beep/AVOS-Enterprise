"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildBulkStatusPayload = buildBulkStatusPayload;
exports.normalizeBulkIds = normalizeBulkIds;
function buildBulkStatusPayload(status, extra = {}) {
    return {
        status,
        ...extra,
    };
}
function normalizeBulkIds(ids) {
    if (Array.isArray(ids)) {
        return ids.map((id) => String(id)).filter(Boolean);
    }
    if (typeof ids === "string") {
        return ids
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean);
    }
    return [];
}
//# sourceMappingURL=crm-bulk.helper.js.map