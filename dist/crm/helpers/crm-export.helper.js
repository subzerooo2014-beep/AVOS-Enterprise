"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCrmExportRows = toCrmExportRows;
function toCrmExportRows(items) {
    return (items ?? []).map((item) => ({
        id: item.id,
        number: item.number,
        name: item.name,
        phone: item.phone,
        email: item.email,
        source: item.source,
        status: item.status,
        assignedToId: item.assignedToId,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
    }));
}
//# sourceMappingURL=crm-export.helper.js.map